#!/usr/bin/env bash
# Autoresearch benchmark entrypoint for Kit.
#
# Builds the production bundle, serves it, and runs the deterministic UI
# bug audit (scripts/ui-audit.mjs) against every tool route in desktop and
# mobile viewports. Prints METRIC lines; primary metric: ui_bugs (lower is
# better). Exits non-zero only on harness/infrastructure failure; bugs
# found are the measurement, not an error.
#
# Env:
#   AUTORESEARCH_SKIP_BUILD=1  reuse the existing .next build (iteration aid)
#   AUTORESEARCH_PORT          server port (default 4199)

set -euo pipefail
cd "$(dirname "$0")"

PORT="${AUTORESEARCH_PORT:-4199}"
BASE="http://127.0.0.1:${PORT}"
LOG="${TMPDIR:-/tmp}/autoresearch-next.log"

log() { printf '[autoresearch] %s\n' "$*" >&2; }

command -v bun >/dev/null 2>&1 || { log "bun not found"; exit 1; }
command -v node >/dev/null 2>&1 || { log "node not found"; exit 1; }

log "installing dependencies"
bun install --frozen-lockfile >&2

if [[ "${AUTORESEARCH_SKIP_BUILD:-0}" == "1" && -d .next ]]; then
	log "skipping build (AUTORESEARCH_SKIP_BUILD=1)"
else
	log "building production bundle"
	bun run build >&2
fi

# Port hygiene: a stale server from an earlier aborted run would serve a
# pre-rebuild manifest (ChunkLoadError on every route) and silently corrupt
# the metric. Reclaim the port from leftover next servers; never kill
# unrelated processes.
if lsof -nP -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
	STALE_PID="$(lsof -t -nP -iTCP:"${PORT}" -sTCP:LISTEN | head -1)"
	STALE_CMD="$(ps -p "${STALE_PID}" -o command= 2>/dev/null || true)"
	case "${STALE_CMD}" in
	*next-server*|*"next start"*)
		log "reclaiming :${PORT} from stale server (pid ${STALE_PID}: ${STALE_CMD})"
		kill "${STALE_PID}" 2>/dev/null || true
		for _ in $(seq 1 20); do
			kill -0 "${STALE_PID}" 2>/dev/null || break
			sleep 0.5
		done
		kill -9 "${STALE_PID}" 2>/dev/null || true
		;;
	*)
		log "port :${PORT} is held by an unrelated process (${STALE_CMD}); aborting"
		exit 1
		;;
	esac
fi
log "starting production server on :${PORT}"
bun run start -- -p "${PORT}" >"${LOG}" 2>&1 &
SERVER_PID=$!
trap 'kill "${SERVER_PID}" 2>/dev/null || true' EXIT

ready=0
for _ in $(seq 1 120); do
	if curl -fsS -o /dev/null "${BASE}/" 2>/dev/null; then ready=1; break; fi
	if ! kill -0 "${SERVER_PID}" 2>/dev/null; then
		log "server process died; log follows"
		cat "${LOG}" >&2 || true
		exit 1
	fi
	sleep 0.5
done
if [[ "${ready}" != "1" ]]; then
	log "server never became ready; log follows"
	cat "${LOG}" >&2 || true
	exit 1
fi

log "running UI audit against ${BASE}"
node scripts/ui-audit.mjs --base "${BASE}"
