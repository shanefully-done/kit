// Kit. — English dictionary (source of truth).
// ko.ts must define every key defined here (type-checked).
// Comments are written for a translator who sees only this file:
// they describe where each string renders and its constraints.
// `{var}` placeholders are interpolated at runtime — keep them verbatim.
import type { Dictionary } from "./en";

export const ko: Dictionary = {
	common: {
		/** Generic copy-to-clipboard button */
		copy: "복사",
		/** Toast title after copying; {what} = e.g. "Password", "JSON" */
		copiedType: "{what} 클립보드에 복사됨!",
		/** Toast title after copying, no object named */
		copied: "클립보드에 복사됨!",
		/** Toast title when a copy to the clipboard fails */
		copyFailed: "클립보드 복사에 실패했습니다.",
		/** Resets a tool's inputs/outputs */
		clear: "지우기",
	},
	ui: {
		/** sr-only label on × close buttons (Dialog, Sheet) */
		close: "닫기",
		/** Mobile header button that opens the navigation Sheet */
		openNavigation: "내비게이션 열기",
		/** Pagination — previous page link text */
		previous: "이전",
		/** Pagination — next page link text */
		next: "다음",
		/** Pagination — aria-label on the previous page link */
		goToPreviousPage: "이전 페이지로 이동",
		/** Pagination — aria-label on the next page link */
		goToNextPage: "다음 페이지로 이동",
		/** Pagination — sr-only text on the … ellipsis */
		morePages: "더 많은 페이지",
		/** Command dialog sr-only title (default) */
		commandTitle: "명령 팔레트",
		/** Command dialog sr-only description (default) */
		commandDesc: "실행할 명령을 검색하세요...",
	},
	nav: {
		/** Sidebar search box placeholder; mono uppercase micro label, keep short */
		filterPlaceholder: "유닛 필터",
		/** Sidebar search box aria-label */
		filterAria: "도구 필터",
		/** Sidebar filter empty state; keep the brackets */
		noMatch: "[ 일치 항목 없음 ]",
		/** aria-label of the theme radio row (System/Light/Dark) */
		themeAria: "색상 테마",
		/** aria-label of the language radio row (EN/한국어) */
		languageAria: "언어",
		/** Sidebar footer, line 1; © IXTJ stays literal */
		footerLine1: "© IXTJ / 모든 처리는 로컬에서 수행됨",
		/** Sidebar footer, line 2; UNIT D-01 stays literal */
		footerLine2: "계정 없음 · 텔레메트리 없음 · UNIT D-01",
		/** Sidebar + homepage section headings */
		categories: {
			/** Route group /converters-parsers */
			converters: "변환기 & 파서",
			/** Route group /generators */
			generators: "생성기",
			/** Route group /viewers-miscellaneous */
			viewers: "뷰어 & 기타",
			/** Sidebar + homepage section heading for Discord message tools */
			discordMessages: "디스코드 · 메시지",
			/** Sidebar + homepage section heading for Discord developer tools */
			discordDevelopers: "디스코드 · 개발자",
		},
	},
	home: {
		/** Homepage top strip, left; KIT® and REV 2.6 stay literal */
		topStrip: "KIT® 개발 툴킷 / REV 2.6",
		/** Homepage top strip GitHub button */
		sourceButton: "소스 / GITHUB",
		/** Hero stats line; {units} and {sections} are zero-padded numbers */
		statsUnits: "{units}개 유닛 / {sections}개 섹션",
		/** Hero stats line — processing tagline */
		allLocal: "모든 처리는 로컬에서 수행됨",
		/** Hero stats line — privacy tagline; keep ™ */
		noTelemetry: "계정 없음 / 텔레메트리 없음™",
		/** Per-section counter; {count} zero-padded */
		unitsCount: "{count}개 유닛",
		/** Homepage footer font credit — keep exactly in sync with fonts in use; font names stay Latin */
		setIn: "INTER + IBM PLEX MONO + PRETENDARD ®로 제작됨",
	},
	tools: {
		// ─── Base64 Encoder/Decoder (/converters-parsers/base64-encoder-decoder) ──
		base64EncoderDecoder: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "Base64 인코더/디코더",
			/** sr-only paragraph above the tab group */
			srTabsDescription: "아래 탭에 입력과 출력이 정리되어 있습니다",
			/** Label next to the URL-safe switch */
			urlSafeModeLabel: "URL-SAFE 모드",
			/** Status text shown when the URL-safe switch is on */
			on: "켜짐",
			/** Status text shown when the URL-safe switch is off */
			off: "꺼짐",
			/** sr-only aria-label on the URL-safe switch */
			urlSafeToggleAria: "URL-safe 인코딩 전환",
			/** First tab trigger (encode direction) */
			encodeTab: "인코딩",
			/** Second tab trigger (decode direction) */
			decodeTab: "디코딩",
			/** Bracketed micro label above both input areas; keep brackets */
			inputLabel: "[ 입력 ]",
			/** Bracketed micro label above both output areas; keep brackets */
			outputLabel: "[ 출력 ]",
			/** Textarea placeholder in the Encode tab */
			encodePlaceholder: "인코딩할 텍스트를 입력하세요...",
			/** Textarea placeholder in the Decode tab */
			decodePlaceholder: "디코딩할 Base64 문자열을 입력하세요...",
			/** Drag & drop zone caption in the Encode tab */
			dropzoneLabel: "파일을 여기에 끌어다 놓거나 클릭하여 선택하세요",
			/** aria-label on the clickable drop zone in the Encode tab */
			uploadFileAria: "인코딩할 파일 업로드",
			/** Primary button in the Encode tab */
			encodeButton: "인코딩",
			/** Primary button in the Decode tab */
			decodeButton: "디코딩",
			/** Empty-state hint in the Encode output box */
			encodedEmptyHint: "인코딩된 결과가 여기에 표시됩니다...",
			/** Empty-state hint in the Decode output box */
			decodedEmptyHint: "디코딩된 결과가 여기에 표시됩니다...",
			/** {what} for common.copiedType toast after copying encoded text */
			encodedText: "인코딩된 텍스트",
			/** {what} for common.copiedType toast after copying decoded text */
			decodedText: "디코딩된 텍스트",
			/** aria-label on the Copy button in the Encode tab */
			copyEncodedAria: "인코딩된 결과 복사",
			/** aria-label on the Copy button in the Decode tab */
			copyDecodedAria: "디코딩된 결과 복사",
			/** Error line shown when encoding/decoding fails; {message} = library error text */
			errorPrefix: "오류: {message}",
		},
		// ─── Base64 Image Converter (/converters-parsers/base64-image-converter) ──
		base64ImageConverter: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "Base64 이미지 변환기",
			/** sr-only paragraph above the tab group */
			srTabsDescription: "아래 탭에 입력과 출력이 정리되어 있습니다",
			/** Label next to the data-URI-prefix switch */
			dataUriPrefixLabel: "DATA URI 접두사",
			/** Status text shown when the switch is on */
			on: "켜짐",
			/** Status text shown when the switch is off */
			off: "꺼짐",
			/** aria-label on the data-URI-prefix switch */
			dataUriToggleAria: "데이터 URI 접두사 전환",
			/** First tab trigger (image encodes to Base64); keep the arrow */
			imgToBase64Tab: "이미지 → Base64",
			/** Second tab trigger (Base64 decodes to image); keep the arrow */
			base64ToImgTab: "Base64 → 이미지",
			/** Drag & drop zone caption in the Image → Base64 tab */
			dropzoneLabel: "이미지를 여기에 끌어다 놓거나 클릭하여 선택하세요",
			/** aria-label on the clickable drop zone */
			uploadImageAria: "변환할 이미지 업로드",
			/** Bracketed heading of the uploaded-file info panel; keep brackets */
			fileInfoLabel: "[ 파일 정보 ]",
			/** File info row label followed by a colon in JSX */
			nameLabel: "이름",
			/** File info row label followed by a colon in JSX; value renders as "NN.NN KB" */
			sizeLabel: "크기",
			/** File info row label followed by a colon in JSX; value = MIME type */
			typeLabel: "유형",
			/** Button that runs image → Base64 conversion */
			convertButton: "Base64로 변환",
			/** aria-label on the convert button */
			convertButtonAria: "이미지를 Base64로 변환",
			/** alt text for the uploaded-image preview thumbnail */
			uploadPreviewAlt: "업로드된 이미지 미리보기",
			/** Bracketed micro label above the Base64 result box; keep brackets */
			base64OutputLabel: "[ BASE64 출력 ]",
			/** {what} for common.copiedType toast after copying the Base64 string */
			base64StringType: "Base64 문자열",
			/** aria-label on the Copy button under the Base64 output */
			copyOutputAria: "Base64 출력 복사",
			/** Error shown when FileReader fails */
			readFileError: "파일을 읽지 못했습니다",
			/** Error shown when a non-image file is uploaded or dropped */
			notImageError: "이미지 파일을 업로드해주세요",
			/** Error shown when decoding with an empty textarea */
			emptyInputError: "Base64 문자열을 입력해주세요",
			/** Error shown when atob() throws; {message} = browser error text */
			invalidBase64Error: "잘못된 Base64 문자열: {message}",
			/** Bracketed micro label above the Base64 textarea; keep brackets */
			base64InputLabel: "[ BASE64 입력 ]",
			/** Textarea placeholder in the Base64 → Image tab */
			pastePlaceholder: "여기에 Base64 문자열을 붙여넣으세요...",
			/** Button that decodes Base64 into an image */
			decodeButton: "이미지로 디코딩",
			/** aria-label on the decode button */
			decodeButtonAria: "Base64를 이미지로 디코딩",
			/** alt text for the decoded image preview */
			decodedPreviewAlt: "디코딩된 이미지 미리보기",
			/** Button that downloads the decoded image */
			downloadButton: "이미지 다운로드",
			/** aria-label on the download button */
			downloadButtonAria: "디코딩된 이미지 다운로드",
		},
		// ─── chmod Calculator (/converters-parsers/chmod-calculator) ──
		chmodCalculator: {
			/** ToolHeader title; sidebar + homepage card use the same key. "chmod" stays literal (technical token) */
			title: "chmod 계산기",
			/** Bracketed heading above the permission checkbox grid; keep brackets */
			permissionMatrixLabel: "[ 권한 매트릭스 ]",
			/** Column-row label in the permission matrix (file owner class) */
			owner: "소유자",
			/** Permission matrix row label (group class) */
			group: "그룹",
			/** Permission matrix row label (others class) */
			other: "기타",
			/** Permission matrix column header; checkbox column for read bit */
			read: "읽기",
			/** Permission matrix column header; checkbox column for write bit */
			write: "쓰기",
			/** Permission matrix column header; checkbox column for execute bit */
			execute: "실행",
			/** Bracketed heading above the result panel; keep brackets */
			resultLabel: "[ 결과 ]",
			/** Micro label above the octal number output */
			octalLabel: "8진수",
			/** Micro label above the symbolic (rwx-style) output */
			symbolicLabel: "심볼릭",
			/** Micro label above the generated chmod command line */
			commandLabel: "명령어",
			/** Bracketed heading above the octal input field; keep brackets */
			octalInputLabel: "[ 8진수 입력 ]",
			/** Error shown when the octal input doesn't match /^[0-7]{3,4}$/; keep brackets */
			invalidOctalError: "[ 잘못된 8진수 ]",
		},
		// ─── Color Converter (/converters-parsers/color-converter) ──
		colorConverter: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "색상 변환기",
			/** Bracketed heading above the hex input and format rows; keep brackets. Format tokens (HEX/RGB/HSL/OKLCH) stay literal and are NOT keys */
			conversionLabel: "[ 변환 ]",
			/** aria-label on the native color picker input */
			pickColorAria: "색상 선택",
			/** Inline error shown when the hex input is invalid; keep brackets */
			invalidHexError: "[ 잘못된 HEX ]",
			/** Bracketed heading above the contrast section; keep brackets */
			contrastCheckLabel: "[ 대비 검사 ]",
			/** Label above the foreground color controls */
			foregroundLabel: "전경색",
			/** Label above the background color controls */
			backgroundLabel: "배경색",
			/** aria-label on the foreground color picker input */
			foregroundAria: "전경색",
			/** aria-label on the background color picker input */
			backgroundAria: "배경색",
			/** Micro label above the numeric contrast ratio */
			contrastRatioLabel: "대비 비율",
			/** WCAG check card label; ratio threshold (≥4.5) is appended in JSX */
			aaNormal: "AA 일반",
			/** WCAG check card label; ratio threshold (≥3) appended in JSX */
			aaLarge: "AA 큰 텍스트",
			/** WCAG check card label; ratio threshold (≥7) appended in JSX */
			aaaNormal: "AAA 일반",
			/** WCAG check card label; ratio threshold (≥4.5) appended in JSX */
			aaaLarge: "AAA 큰 텍스트",
			/** Badge shown when a WCAG check passes */
			pass: "통과",
			/** Badge shown when a WCAG check fails */
			fail: "실패",
		},
		// ─── CRON Parser (/converters-parsers/cron-parser) ──
		cronParser: {
			/** ToolHeader title; sidebar + homepage card use the same key. CRON stays uppercase (technical token) */
			title: "CRON 파서",
			/** Bracketed micro label above the expression input; keep brackets */
			inputLabel: "[ 입력 ]",
			/** Visible label for the cron expression text field */
			expressionLabel: "표현식",
			/** Placeholder on the cron input; the "* * * * *" part is an example expression — keep it verbatim */
			examplePlaceholder: "예: * * * * *",
			/** Label above the presets dropdown */
			presetsLabel: "프리셋",
			/** Placeholder on the closed Select trigger */
			selectExamplePlaceholder: "예제 선택",
			/** Preset option for "* * * * *" */
			presetEveryMinute: "매분",
			/** Preset option for "0 0 * * *" */
			presetDailyMidnight: "매일 자정",
			/** Preset option for "0 0 1 * *" */
			presetMonthlyFirstMidnight: "매월 1일 자정",
			/** Preset option for "0 0 * * 0" */
			presetSundayMidnight: "매주 일요일 자정",
			/** Bracketed heading above the human-readable description (generated by cronstrue, not from this dictionary); keep brackets */
			humanReadableLabel: "[ 읽기 쉬운 설명 ]",
			/** Bracketed heading above the parse-error message; keep brackets. The message body comes from cronstrue */
			errorLabel: "[ 오류 ]",
		},
		// ─── curl to fetch (/converters-parsers/curl-converter) ──
		curlConverter: {
			/** Sidebar, homepage card, and page header title */
			title: "curl to fetch",
			/** Input panel heading; keep brackets */
			curlCommandLabel: "[ CURL 명령어 ]",
			/** Empty state when no curl input provided; keep brackets */
			awaitingInput: "[ 입력 대기 중 ]",
			/** Output panel heading; keep brackets */
			fetchSnippetLabel: "[ FETCH 스니펫 ]",
			/** Toast after successful copy */
			copied: "복사됨",
			/** Toast when copy to clipboard fails */
			copyFailed: "복사 실패",
			/** Parsed request summary bar; {method}=HTTP method, {count}=header count, {headers}=translated label, {body}=translated label, {status}=YES/NO */
			requestInfo: "[ {method} / {count} {headers} / {body}: {status} ]",
			/** Label in request info bar */
			headersLabel: "헤더",
			/** Label in request info bar */
			bodyLabel: "본문",
			/** Status in request info bar */
			yes: "예",
			/** Status in request info bar */
			no: "아니오",
		},
		// ─── Data Converter (/converters-parsers/data-converter) ──
		dataConverter: {
			/** Sidebar, homepage card, and page header title */
			title: "데이터 변환기",
			/** Section heading above the two format panels; keep brackets */
			formatConversionLabel: "[ 형식 변환 ]",
			/** Source format label above the FROM dropdown */
			fromLabel: "원본",
			/** Destination format label above the TO dropdown */
			toLabel: "대상",
			/** Textarea placeholder for input data */
			placeholder: "여기에 데이터를 붙여넣으세요...",
			/** Error banner shown when parsing fails; keep brackets */
			parseError: "[ 파싱 오류 ]",
			/** Toast after copying output */
			copied: "복사됨",
		},
		// ─── JSON Parser (/converters-parsers/json-parser) ──
		jsonParser: {
			/** Sidebar, homepage card, and page header title */
			title: "JSON 파서",
			/** Input panel heading; keep brackets */
			inputLabel: "[ 입력 ]",
			/** Textarea placeholder with example JSON */
			placeholder:
				'여기에 JSON을 입력하세요. 예: {"name": "Kilo Code", "age": 30}',
			/** Status bar when JSON is valid; keep brackets */
			validJson: "[ 유효한 JSON ]",
			/** Status bar when JSON is invalid; keep brackets */
			parseError: "[ 파싱 오류 ]",
			/** Output panel heading; keep brackets */
			formattedOutputLabel: "[ 정렬된 출력 ]",
			/** Fallback text when JSON is invalid and no tree is shown */
			invalidJson: "잘못된 JSON",
			/** Error boundary heading when the JSON viewer crashes; keep brackets */
			renderError: "[ 렌더링 오류 ]",
			/** Expandable details label inside the error boundary */
			errorDetails: "오류 세부정보",
			/** Toast after copying formatted JSON */
			formattedCopied: "정렬된 JSON이 클립보드에 복사되었습니다!",
			/** Toast when copy fails because JSON is invalid */
			copyFailed: "JSON 복사에 실패했습니다. 유효한 JSON인지 확인해주세요.",
			/** Button text for the copy-formatted action */
			copyFormatted: "정렬된 JSON 복사",
			/** aria-label on the copy-formatted button */
			copyFormattedAria: "정렬된 JSON을 클립보드에 복사",
		},
		// ─── JWT Decoder (/converters-parsers/jwt-decoder) ──
		jwtDecoder: {
			/** Sidebar, homepage card, and page header title */
			title: "JWT 디코더",
			/** Label above the token input; keep brackets */
			encodedTokenLabel: "[ 인코딩된 토큰 ]",
			/** Textarea placeholder */
			placeholder: "여기에 JWT 토큰을 입력하세요",
			/** Error banner when token is malformed; keep brackets */
			malformedToken: "[ 잘못된 형식의 JWT 토큰 ]",
			/** Card title for the header segment */
			header: "헤더",
			/** Card title for the payload segment */
			payload: "페이로드",
			/** Card title for the signature segment */
			signature: "서명",
			/** aria-label on the header copy button */
			copyHeaderAria: "헤더 복사",
			/** aria-label on the payload copy button */
			copyPayloadAria: "페이로드 복사",
			/** aria-label on the signature copy button */
			copySignatureAria: "서명 복사",
			/** Note below the payload card */
			verificationNote: "참고: 이 디코더는 서명 검증 상태를 확인하지 않습니다.",
			/** Error text set in all three cards when JWT has wrong segment count */
			invalidJwtFormat: "잘못된 JWT 형식",
			/** Error text when header segment cannot be decoded */
			invalidHeader: "잘못된 헤더",
			/** Error text when payload segment cannot be decoded */
			invalidPayload: "잘못된 페이로드",
			/** Error text when signature segment is empty */
			invalidSignature: "잘못된 서명",
		},
		// ─── Number Base Converter (/converters-parsers/number-base-converter) ──
		numberBaseConverter: {
			/** Sidebar, homepage card, and page header title */
			title: "진법 변환기",
			/** Input section heading; keep brackets */
			inputLabel: "[ 입력 ]",
			/** Short label for the decimal row */
			decLabel: "DEC",
			/** Short label for the hexadecimal row */
			hexLabel: "HEX",
			/** Short label for the octal row */
			octLabel: "OCT",
			/** Short label for the binary row */
			binLabel: "BIN",
			/** Placeholder for the decimal input */
			decPlaceholder: "10진수를 입력하세요",
			/** Placeholder for the hexadecimal input */
			hexPlaceholder: "16진수를 입력하세요",
			/** Placeholder for the octal input */
			octPlaceholder: "8진수를 입력하세요",
			/** Placeholder for the binary input */
			binPlaceholder: "2진수를 입력하세요",
			/** aria-label on the decimal copy button */
			copyDecAria: "10진수 복사",
			/** aria-label on the hexadecimal copy button */
			copyHexAria: "16진수 복사",
			/** aria-label on the octal copy button */
			copyOctAria: "8진수 복사",
			/** aria-label on the binary copy button */
			copyBinAria: "2진수 복사",
			/** Toast when nothing to copy */
			nothingToCopy: "복사할 내용이 없습니다!",
			/** Toast for unexpected conversion errors */
			unknownError: "알 수 없는 오류가 발생했습니다.",
			/** Validation error for decimal input */
			invalidDecimal: "잘못된 10진수 입력",
			/** Validation error for hexadecimal input */
			invalidHexadecimal: "잘못된 16진수 입력",
			/** Validation error for octal input */
			invalidOctal: "잘못된 8진수 입력",
			/** Validation error for binary input */
			invalidBinary: "잘못된 2진수 입력",
		},
		// ─── Regex Tester (/converters-parsers/regex-tester) ──
		regexTester: {
			/** Sidebar, homepage card, and page header title */
			title: "정규식 테스터",
			/** Placeholder for the regex pattern input */
			patternPlaceholder: "정규식 패턴을 입력하세요",
			/** aria-label for the regex pattern input */
			patternAria: "정규식 패턴",
			/** Section heading above flag badges */
			flagsLabel: "플래그",
			/** Flag badge label: g flag */
			flagGlobal: "g (전역)",
			/** Flag badge label: i flag */
			flagCaseInsensitive: "i (대소문자 구분 안 함)",
			/** Flag badge label: m flag */
			flagMultiline: "m (여러 줄)",
			/** Placeholder for the test string textarea */
			testPlaceholder: "테스트할 문자열을 입력하세요",
			/** aria-label for the test string textarea */
			testAria: "테스트 문자열",
			/** Empty-state badge when pattern matches nothing; keep brackets */
			noMatch: "[ 일치 항목 없음 ]",
			/** Match count badge; {count} = number of matches; keep brackets */
			matchesCount: "[ {count}개 일치 ]",
			/** Section heading for highlighted output; keep brackets */
			highlightedMatches: "[ 강조된 일치 항목 ]",
			/** Section heading for the match table; keep brackets */
			matchDetails: "[ 일치 세부정보 ]",
			/** Empty-state message below the match table */
			noMatchesFound: "일치하는 항목이 없습니다.",
			/** Table column header for matched text */
			matchHeader: "일치 항목",
			/** Table column header for match index */
			indexHeader: "인덱스",
			/** Fallback error when catch block receives non-Error */
			unknownError: "알 수 없는 오류가 발생했습니다",
		},
		// ─── Text Case Converter (/converters-parsers/text-case) ──
		textCase: {
			/** Sidebar, homepage card, and page header title */
			title: "텍스트 케이스 변환기",
			/** Placeholder for the input textarea */
			inputPlaceholder: "여기에 텍스트를 입력하세요...",
			/** Button label for uppercase conversion */
			uppercaseBtn: "대문자",
			/** Button label for lowercase conversion */
			lowercaseBtn: "소문자",
			/** Button label for title case conversion */
			titleCaseBtn: "타이틀 케이스",
			/** Button label for camelCase conversion */
			camelCaseBtn: "카멜 케이스",
			/** Button label for snake_case conversion */
			snakeCaseBtn: "스네이크_케이스",
			/** Button label for kebab-case conversion */
			kebabCaseBtn: "케밥-케이스",
			/** Output section heading; keep brackets */
			outputLabel: "[ 출력 ]",
			/** Placeholder text when no output yet */
			outputEmpty: "변환된 텍스트가 여기에 표시됩니다...",
		},
		// ─── Timestamp Converter (/converters-parsers/timestamp-converter) ──
		timestampConverter: {
			/** Sidebar, homepage card, and page header title */
			title: "타임스탬프 변환기",
			/** Section heading for unix→human conversion; keep brackets */
			unixToHumanLabel: "[ UNIX → 사람이 읽는 형식 ]",
			/** Label above both expression inputs */
			expressionLabel: "표현식",
			/** Placeholder for the unix timestamp input; shows example format */
			unixPlaceholder: "예: 1678886400 또는 1678886400000",
			/** Section heading for human→unix conversion; keep brackets */
			humanToUnixLabel: "[ 사람이 읽는 형식 → UNIX ]",
			/** Placeholder for the human-readable date input; shows example format */
			humanPlaceholder: "예: 2023-03-15 00:00:00",
			/** Section heading for the date picker; keep brackets */
			datePickerLabel: "[ 날짜 선택 ]",
			/** Placeholder text in the date picker button when no date selected */
			pickDate: "날짜 선택",
			/** Section heading for the readout results; keep brackets */
			readoutsLabel: "[ 결과 ]",
			/** Label above the unix timestamp readout */
			unixTimestampLabel: "UNIX 타임스탬프",
			/** Label above the ISO 8601 readout; ISO 8601 is a technical token, kept literal */
			iso8601Label: "ISO 8601",
			/** aria-label for the copy-unix-timestamp button */
			copyUnixAria: "UNIX 타임스탬프 복사",
			/** aria-label for the copy-human-readable button */
			copyHumanAria: "사람이 읽는 형식 복사",
			/** Error message when unix timestamp input is invalid */
			invalidTimestamp: "잘못된 타임스탬프",
			/** Error message when human-readable date input is invalid; format hint included */
			invalidDateFormat: "잘못된 날짜 형식 (예: YYYY-MM-DD HH:mm:ss)",
		},
		// ─── Timezone Converter (/converters-parsers/timezone-converter) ──
		timezoneConverter: {
			/** Sidebar, homepage card, and page header title */
			title: "시간대 변환기",
			/** Section heading above the two-column conversion panel; keep brackets */
			conversionLabel: "[ 변환 ]",
			/** Column heading for the source timezone panel; keep brackets */
			sourceLabel: "[ 원본 ]",
			/** Column heading for the target timezone panel; keep brackets */
			targetLabel: "[ 대상 ]",
			/** Label above the date picker */
			dateLabel: "날짜",
			/** Label above timezone selects */
			timezoneLabel: "시간대",
			/** Placeholder in the date picker button when no date selected */
			pickDate: "날짜 선택",
			/** Placeholder in the timezone combobox search input */
			searchTimezonePlaceholder: "시간대 검색...",
			/** Empty state in timezone search results */
			noTimezoneFound: "시간대를 찾을 수 없습니다.",
			/** Fallback label in the timezone combobox when nothing selected */
			selectTimezone: "시간대 선택...",
			/** Label above the converted time readout */
			convertedTimeLabel: "변환된 시간",
			/** aria-label for the copy-converted-time button */
			copyConvertedAria: "변환된 시간 복사",
			/** Error message shown when conversion fails (bad timezone/date) */
			invalidTimezone: "잘못된 시간대 또는 날짜",
		},
		// ─── Unit Converter (/converters-parsers/unit-converter) ──
		unitConverter: {
			/** Sidebar, homepage card, and page header title */
			title: "단위 변환기",
			/** Label above the category select */
			categoryLabel: "카테고리",
			/** Placeholder in the category select dropdown */
			selectCategoryPlaceholder: "단위 유형 선택",
			/** Section heading for the conversion rig; keep brackets */
			conversionRigLabel: "[ 변환기 ]",
			/** Label above the FROM unit select */
			fromLabel: "원본",
			/** Label above the TO unit select */
			toLabel: "대상",
			/** Placeholder in the from/to unit select dropdowns */
			selectUnitPlaceholder: "단위 선택",
			/** Label above the numeric value input */
			valueLabel: "값",
			/** Placeholder for the numeric value input */
			valuePlaceholder: "값을 입력하세요",
			/** Section heading for the result readout; keep brackets */
			resultLabel: "[ 결과 ]",
			/** aria-label for the copy-result button */
			copyResultAria: "변환된 값 복사",
			/** Error prefix when conversion throws; followed by the library error message */
			errorPrefix: "오류:",
			/** Fallback error when a non-Error is thrown */
			unknownError: "변환 중 알 수 없는 오류가 발생했습니다.",
			/** Category display name */
			catLength: "길이",
			catArea: "면적",
			catMass: "질량",
			catVolume: "부피",
			catEach: "개수",
			catTemperature: "온도",
			catTime: "시간",
			catDigital: "디지털",
			catPartsPer: "농도",
			catSpeed: "속도",
			catPace: "페이스",
			catPressure: "압력",
			catCurrent: "전류",
			catVoltage: "전압",
			catPower: "전력",
			catReactivePower: "무효 전력",
			catApparentPower: "피상 전력",
			catEnergy: "에너지",
			catReactiveEnergy: "무효 에너지",
			catVolumeFlowRate: "체적 유량",
			catIlluminance: "조도",
			catFrequency: "주파수",
			catAngle: "각도",
		},
		// ─── URL Encoder/Decoder (/converters-parsers/url-encoder-decoder) ──
		urlEncoderDecoder: {
			/** Sidebar, homepage card, and page header title */
			title: "URL 인코더/디코더",
			/** Encode tab label */
			encodeTab: "URL 인코딩",
			/** Decode tab label */
			decodeTab: "URL 디코딩",
			/** Placeholder in the encode textarea */
			encodePlaceholder: "인코딩할 텍스트를 입력하세요...",
			/** Placeholder in the decode textarea */
			decodePlaceholder: "디코딩할 텍스트를 입력하세요...",
			/** Section heading for encoded result; keep brackets */
			encodedOutputLabel: "인코딩된 출력",
			/** Section heading for decoded result; keep brackets */
			decodedOutputLabel: "디코딩된 출력",
			/** Empty-state text when no encoded output yet */
			encodedOutputEmpty: "인코딩된 출력",
			/** Empty-state text when no decoded output yet */
			decodedOutputEmpty: "디코딩된 출력",
			/** aria-label on the copy button for encoded output */
			copyEncodedAria: "인코딩된 출력 복사",
			/** aria-label on the copy button for decoded output */
			copyDecodedAria: "디코딩된 출력 복사",
		},
		// ─── URL Parser (/converters-parsers/url-parser) ──
		urlParser: {
			/** Sidebar, homepage card, and page header title */
			title: "URL 파서",
			/** Placeholder in the URL input field */
			placeholder: "파싱할 URL을 입력하세요",
			/** aria-label on the URL input field */
			inputAria: "파싱할 URL",
			/** Button text to trigger parsing */
			parseButton: "URL 파싱",
			/** Fallback error when caught exception is not an Error instance */
			unknownError: "알 수 없는 오류가 발생했습니다.",
			/** Section heading for parsed URL components; keep brackets */
			parsedComponents: "파싱된 구성 요소",
			/** Field label for the protocol component */
			protocol: "프로토콜",
			/** Field label for the hostname component */
			hostname: "호스트명",
			/** Field label for the port component */
			port: "포트",
			/** Field label for the path component */
			path: "경로",
			/** Field label for the fragment component */
			fragment: "프래그먼트",
			/** aria-label: copy protocol value */
			copyProtocol: "프로토콜 복사",
			/** aria-label: copy hostname value */
			copyHostname: "호스트명 복사",
			/** aria-label: copy port value */
			copyPort: "포트 복사",
			/** aria-label: copy path value */
			copyPath: "경로 복사",
			/** aria-label: copy fragment value */
			copyFragment: "프래그먼트 복사",
			/** Section heading for query parameter table; keep brackets */
			queryParameters: "쿼리 매개변수",
			/** Table column header for parameter keys */
			tableKey: "키",
			/** Table column header for parameter values */
			tableValue: "값",
			/** aria-label: copy value for a specific query param; {key} = param name */
			copyValueFor: "{key}의 값 복사",
		},
		// ─── Barcode Generator (/generators/barcode-generator) ──
		barcodeGenerator: {
			/** Sidebar, homepage card, and page header title */
			title: "바코드 생성기",
			/** Label above the format selector */
			formatLabel: "형식",
			/** Label above the barcode value input */
			valueLabel: "값",
			/** Slider label for bar width; {width} = current numeric value */
			widthLabel: "너비 — {width}",
			/** Slider label for bar height; {height} = current numeric value */
			heightLabel: "높이 — {height}",
			/** Switch label to toggle text below barcode */
			showTextLabel: "텍스트 표시",
			/** Download button text */
			downloadSvg: "SVG 다운로드",
		},
		// ─── Gradient Generator (/generators/gradient) ──
		gradient: {
			/** Sidebar, homepage card, and page header title */
			title: "그라디언트 생성기",
			/** Label above the type toggle (linear/radial) */
			typeLabel: "유형",
			/** Linear gradient type option */
			linear: "선형",
			/** Radial gradient type option */
			radial: "방사형",
			/** Angle slider label for linear gradients; {angle} = current degree value */
			angleLabel: "각도 — {angle}도",
			/** Position label for radial gradients; {x} and {y} = percentage values */
			positionLabel: "위치 — X: {x}% / Y: {y}%",
			/** Section heading for color stops; keep brackets */
			colorStops: "색상 정지점",
			/** aria-label: remove a specific color stop; {id} = stop index */
			removeStopAria: "정지점 {id} 제거",
			/** Button text to add a new color stop */
			addStop: "정지점 추가",
			/** Section heading for the preview area; keep brackets */
			preview: "미리보기",
			/** Section heading for the CSS output; keep brackets */
			cssOutput: "CSS 출력",
			/** Toast title shown after copying CSS to clipboard */
			copied: "복사됨",
			/** aria-label on the copy CSS button */
			copyCssAria: "CSS 복사",
		},
		// ─── Hash Generator (/generators/hash) ──
		hash: {
			/** Sidebar, homepage card, and page header title */
			title: "해시 생성기",
			/** Input section heading; keep brackets */
			inputLabel: "입력",
			/** Placeholder in the input textarea */
			inputPlaceholder: "여기에 텍스트를 입력하세요...",
			/** Algorithm section heading; keep brackets */
			algorithmLabel: "알고리즘",
			/** Placeholder in the algorithm selector */
			selectAlgorithm: "알고리즘 선택",
			/** Digest result section heading; keep brackets */
			digestLabel: "다이제스트",
		},
		// ─── HMAC Generator (/generators/hmac-generator) ──
		hmacGenerator: {
			/** Sidebar, homepage card, and page header title */
			title: "HMAC 생성기",
			/** Input panel heading; keep brackets */
			messageLabel: "[ 메시지 ]",
			/** Textarea placeholder for the message to sign */
			messagePlaceholder: "서명할 메시지를 입력하세요...",
			/** Secret key field label */
			secretLabel: "비밀 키",
			/** Toggle label to show/hide the secret key */
			showLabel: "표시",
			/** Input placeholder for the secret key */
			secretPlaceholder: "비밀 키를 입력하세요...",
			/** Algorithm selector label */
			algorithmLabel: "알고리즘",
			/** Output section heading; keep brackets */
			outputLabel: "[ 출력 ]",
			/** Empty state shown before both inputs are filled; keep brackets */
			awaitingInput: "[ 입력 대기 중 ]",
			/** Hex output sub-heading; keep brackets */
			hexLabel: "[ HEX ]",
			/** Button to copy hex output */
			copyHex: "HEX 복사",
			/** Base64 output sub-heading; keep brackets */
			base64Label: "[ BASE64 ]",
			/** Button to copy base64 output */
			copyBase64: "BASE64 복사",
		},
		// ─── ID Generator (/generators/id-generator) ──
		idGenerator: {
			/** Sidebar, homepage card, and page header title */
			title: "ID 생성기",
			/** Uppercase toggle label for UUID V4, V7, and ULID tabs */
			uppercaseLabel: "대문자",
			/** Hyphens toggle label for UUID V4 and V7 tabs */
			hyphensLabel: "하이픈",
			/** Size input label for the nanoid tab */
			sizeLabel: "크기",
			/** Number of IDs to generate */
			countLabel: "개수",
			/** Button to generate IDs */
			generateButton: "생성",
			/** Button to copy all generated IDs */
			copyAll: "모두 복사",
			/** Output section heading; keep brackets */
			outputLabel: "[ 출력 ]",
		},
		// ─── Lorem Generator (/generators/lorem-generator) ──
		loremGenerator: {
			/** Sidebar, homepage card, and page header title */
			title: "Lorem 생성기",
			/** Character sets section heading; keep brackets */
			characterSetsLabel: "[ 문자 집합 ]",
			/** Checkbox label for alphabetic words */
			alphabeticalLabel: "알파벳",
			/** Checkbox label for Korean (Hangul) words */
			koreanLabel: "한국어",
			/** Checkbox label for numeric words */
			numericalLabel: "숫자",
			/** Error shown when no character set is selected; keep brackets */
			selectAtLeastOne: "[ 하나 이상의 집합을 선택하세요 ]",
			/** Structure section heading; keep brackets */
			structureLabel: "[ 구조 ]",
			/** Label for words-per-sentence input */
			wordsPerSentence: "단어 / 문장",
			/** Label for sentences-per-paragraph input */
			sentencesPerParagraph: "문장 / 단락",
			/** Label for paragraph count input */
			paragraphsLabel: "단락",
			/** Main generate button text */
			generateButton: "생성",
			/** Output section heading; keep brackets */
			outputLabel: "[ 출력 ]",
			/** Stats strip showing counts; {paragraphs}, {sentences}, {words} are numbers */
			statsFormat: "[ {paragraphs} P / {sentences} S / {words} W ]",
			/** Button to regenerate output */
			regenerateButton: "다시 생성",
		},
		// ─── Password Generator (/generators/password) ──
		password: {
			/** Sidebar, homepage card, and page header title */
			title: "비밀번호 생성기",
			/** Slider label showing current length; {length} is the numeric value */
			lengthLabel: "길이: {length}",
			/** Character sets section heading; keep brackets */
			characterSetsLabel: "[ 문자 집합 ]",
			/** Checkbox label for uppercase letters */
			uppercaseLabel: "대문자 (A-Z)",
			/** Checkbox label for lowercase letters */
			lowercaseLabel: "소문자 (a-z)",
			/** Checkbox label for digits */
			numbersLabel: "숫자 (0-9)",
			/** Checkbox label for special characters */
			symbolsLabel: "기호 (!@#$)",
			/** Generated password output section heading; keep brackets */
			generatedPasswordLabel: "[ 생성된 비밀번호 ]",
			/** Strength meter section heading; keep brackets */
			strengthLabel: "[ 강도 ]",
			/** Strength level: 0–29 */
			veryWeak: "매우 약함",
			/** Strength level: 30–59 */
			weak: "약함",
			/** Strength level: 60–79 */
			good: "좋음",
			/** Strength level: 80–100 */
			strong: "강함",
			/** Button to generate a new password */
			generateButton: "새 비밀번호 생성",
			/** Button that sets length to 12 */
			sampleButton: "샘플",
			/** Toast shown after copying password */
			copiedToast: "비밀번호가 클립보드에 복사되었습니다!",
			/** Error shown in output when no character set is selected */
			noCharSetError: "하나 이상의 문자 유형을 선택하세요.",
			/** aria-label on the copy button */
			copyAriaLabel: "비밀번호 복사",
			/** aria-label on the clear button */
			clearAriaLabel: "비밀번호 출력 지우기",
		},
		// ─── Port Number Generator (/generators/port) ──
		port: {
			/** Sidebar, homepage card, and page header title */
			title: "포트 번호 생성기",
			/** Label for the number-of-ports input */
			countLabel: "개수",
			/** Label for the minimum port input */
			minPortLabel: "최소 포트",
			/** Label for the maximum port input */
			maxPortLabel: "최대 포트",
			/** Toggle label to exclude well-known ports; keep range notation */
			avoidReservedLabel: "예약된 포트 제외 (0–1023)",
			/** Button to generate ports */
			generateButton: "생성",
			/** Generated ports output section heading; keep brackets */
			generatedPortsLabel: "[ 생성된 포트 ]",
			/** aria-label on the copy button */
			copyAriaLabel: "생성된 포트 복사",
			/** Note shown below output when reserved ports are excluded */
			reservedNote: "예약된 포트(0–1023)는 생성 범위에서 제외됩니다.",
		},
		// ─── QR Code Generator (/generators/qr-code) ──
		qrCode: {
			/** Sidebar, homepage card, and page header title */
			title: "QR 코드 생성기",
			/** Micro label above the encode section; keep brackets */
			encodeLabel: "[ 인코딩 ]",
			/** Label for the text input that gets encoded into a QR */
			contentLabel: "콘텐츠",
			/** Placeholder for the content input */
			contentPlaceholder: "텍스트 또는 URL을 입력하세요",
			/** Primary action button */
			generate: "생성",
			/** Button that copies the input text (not the QR image) */
			copyText: "텍스트 복사",
			/** Micro label above the rendered QR preview; keep brackets */
			outputLabel: "[ 출력 ]",
			/** Empty state shown before any QR is generated */
			emptyOutput: "아직 QR이 없습니다. 생성해보세요.",
			/** Micro label above the decode/upload section; keep brackets */
			decodeLabel: "[ 디코딩 ]",
			/** Label above the image upload dropzone */
			uploadLabel: "이미지 업로드",
			/** Hint inside the dashed upload dropzone */
			uploadHint: "클릭하여 QR 이미지 업로드",
			/** Micro label above the decoded text result; keep brackets */
			decodedLabel: "[ 디코딩됨 ]",
			/** Error message when decoding finds no QR; also used as an internal sentinel value compared against decodedText — keep exact punctuation */
			noQrCodeFound: "QR 코드를 찾을 수 없습니다.",
			/** Toast when QR generation throws */
			errorGenerate: "QR 코드 생성 오류: 다시 시도해주세요.",
			/** Toast after download; {format} = "PNG" or "SVG" (uppercase) */
			downloaded: "QR 코드가 {format}(으)로 다운로드되었습니다",
			/** Toast after copying the input text */
			textCopied: "텍스트가 클립보드에 복사되었습니다",
			/** Toast when copying the input text fails */
			copyFailed: "텍스트 복사 실패: 다시 시도해주세요.",
			/** Toast when an uploaded image decodes successfully */
			decodeSuccess: "QR 코드가 성공적으로 디코딩되었습니다",
			/** Toast when an uploaded image contains no readable QR */
			notFoundToast: "QR 코드를 찾을 수 없습니다: 다른 이미지를 시도해주세요.",
			/** Toast after copying the decoded text */
			decodedCopied: "디코딩된 텍스트가 클립보드에 복사되었습니다",
			/** Toast when copying the decoded text fails */
			decodedCopyFailed: "디코딩된 텍스트 복사 실패: 다시 시도해주세요.",
			/** Button copying the text read from an uploaded QR image */
			copyDecoded: "디코딩된 텍스트 복사",
		},
		// ─── SVG Placeholder Generator (/generators/svg-placeholder-generator) ──
		svgPlaceholderGenerator: {
			/** Sidebar, homepage card, and page header title */
			title: "SVG 플레이스홀더 생성기",
			/** Slider label; {width} = current width in px */
			widthLabel: "너비 — {width}px",
			/** Slider label; {height} = current height in px */
			heightLabel: "높이 — {height}px",
			/** Label for the background color select */
			bgColorLabel: "배경색",
			/** Toggle label controlling whether dimensions render inside the SVG */
			showDimensionsLabel: "크기 표시",
			/** Output tab showing the rendered SVG preview */
			previewTab: "미리보기",
			/** Output tab showing the raw SVG source */
			codeTab: "SVG 코드",
			/** Button copying the SVG markup */
			copySvg: "SVG 복사",
			/** Button copying a base64 data:image/svg+xml URI */
			copyDataUri: "DATA URI 복사",
			/** Button downloading the .svg file */
			download: "다운로드",
			/** Short toast after any copy succeeds */
			copied: "복사됨",
		},
		// ─── TOTP Generator (/generators/totp-generator) ──
		totpGenerator: {
			/** Sidebar, homepage card, and page header title */
			title: "TOTP 생성기",
			/** Micro label above the secret/URI textarea; keep brackets, keep "otpauth" latin */
			secretLabel: "[ 비밀 키 / otpauth URI ]",
			/** Select label for code length (6/8); shown only in raw-secret mode */
			digitsLabel: "자릿수",
			/** Select label for rotation interval in seconds (15/30/60); shown only in raw-secret mode */
			periodLabel: "주기",
			/** Inline error shown in brackets when the pasted URI is valid otpauth but not TOTP */
			errorNotTotpUri: "TOTP URI가 아님",
			/** Inline error shown in brackets when URI parsing fails */
			errorInvalidUri: "잘못된 URI",
			/** Inline error shown in brackets when the secret is not valid Base32 */
			errorInvalidBase32: "잘못된 BASE32",
			/** Micro label above the live 6/8-digit code; keep brackets */
			currentLabel: "[ 현재 코드 ]",
			/** Micro label above the upcoming code; keep brackets */
			nextLabel: "[ 다음 ]",
			/** Countdown under the progress bar; {seconds} = seconds remaining */
			remainingLabel: "T-{seconds}초",
			/** Micro label above the parsed otpauth URI metadata table; keep brackets */
			metadataLabel: "[ URI 메타데이터 ]",
			/** Metadata row: issuer from the URI */
			metaIssuer: "발급자",
			/** Metadata row: account/label from the URI */
			metaAccount: "계정",
			/** Metadata row: hash algorithm (SHA-1 etc.) */
			metaAlgorithm: "알고리즘",
			/** Metadata row: digits parsed from the URI */
			metaDigits: "자릿수",
			/** Metadata row: period in seconds parsed from the URI */
			metaPeriod: "주기",
			/** Short toast after copying the current code */
			copied: "복사됨",
		},
		// ─── UUID Generator (/generators/uuid) ──
		uuid: {
			/** Sidebar, homepage card, and page header title */
			title: "UUID 생성기",
			/** Label for the count input (how many UUIDs to generate) */
			countLabel: "개수",
			/** Primary action button */
			generate: "생성",
			/** Copy button resting state — keep short */
			copy: "복사",
			/** aria-label on the copy button */
			ariaCopyGenerated: "생성된 UUID 복사",
			/** Micro label above the generated UUID list; keep brackets */
			outputLabel: "[ 출력 ]",
		},
		// ─── API Directory (/viewers-miscellaneous/api-directory) ──
		apiDirectory: {
			/** Sidebar, homepage card, and page header title */
			title: "API 디렉터리",
			/** Label above the filter input */
			searchLabel: "검색",
			/** Placeholder for the filter input */
			searchPlaceholder: "이름 또는 설명으로 필터링...",
			/** Table header column listing API names/descriptions */
			nameHeader: "이름",
			/** Table header column for auth requirement; cell values ("No", "API Key", "OAuth") render verbatim from JSON — do not translate those */
			authHeader: "인증",
			/** Table header column for documentation/base URLs */
			endpointHeader: "엔드포인트",
			/** Empty state when the filter matches nothing; keep brackets */
			noMatch: "[ 일치 항목 없음 ]",
			items: {
				publicApis: {
					/** Table row name for api.publicapis.org entry */
					name: "Public APIs",
					/** Table row description shown under the name */
					description: "소프트웨어 및 웹 개발에 사용할 수 있는 무료 API 모음입니다.",
				},
				openWeatherMap: {
					/** Table row name for OpenWeatherMap entry; keep brand spelling */
					name: "OpenWeatherMap",
					/** Table row description shown under the name */
					description: "날씨 데이터 API입니다.",
				},
				github: {
					/** Table row name for GitHub REST docs entry */
					name: "GitHub API",
					/** Table row description shown under the name */
					description: "GitHub 데이터에 접근합니다.",
				},
				nasa: {
					/** Table row name for api.nasa.gov entry */
					name: "NASA APIs",
					/** Table row description shown under the name */
					description: "천체 사진 등 NASA 데이터를 위한 API입니다.",
				},
				randomUser: {
					/** Table row name for randomuser.me entry */
					name: "Random User Generator",
					/** Table row description shown under the name */
					description: "무작위 사용자 데이터를 생성합니다.",
				},
			},
		},
		// ─── Diff Viewer (/viewers-miscellaneous/diff-viewer) ──
		diffViewer: {
			/** Page header and sidebar title */
			title: "Diff 뷰어",
			/** Left textarea label */
			sourceLabel: "원본",
			/** Left textarea placeholder */
			sourcePlaceholder: "원본 텍스트를 붙여넣으세요...",
			/** Right textarea label */
			targetLabel: "대상",
			/** Right textarea placeholder */
			targetPlaceholder: "대상 텍스트를 붙여넣으세요...",
			/** Options row heading */
			optionsLabel: "옵션",
			/** Switch label — case-insensitive comparison */
			ignoreCase: "대소문자 무시",
			/** Switch label — trim leading/trailing whitespace per line */
			trimWhitespace: "공백 제거",
			/** Shown when source and target are identical */
			identical: "[ 동일함 ]",
		},
		// ─── HTTP Status Codes (/viewers-miscellaneous/http-status-codes) ──
		httpStatusCodes: {
			/** Page header and sidebar title */
			title: "HTTP 상태 코드",
			/** Search input placeholder */
			filterPlaceholder: "코드 필터",
			/** Category heading for 1xx codes */
			class1xx: "1XX 정보",
			/** Category heading for 2xx codes */
			class2xx: "2XX 성공",
			/** Category heading for 3xx codes */
			class3xx: "3XX 리다이렉션",
			/** Category heading for 4xx codes */
			class4xx: "4XX 클라이언트 오류",
			/** Category heading for 5xx codes */
			class5xx: "5XX 서버 오류",
			/** Table column header — numeric code */
			headerCode: "코드",
			/** Table column header — short reason phrase */
			headerName: "이름",
			/** Table column header — longer explanation */
			headerDescription: "설명",
			/** Shown when search yields no results; keep brackets */
			noMatch: "[ 일치 항목 없음 ]",
		},
		// ─── Image Metadata Viewer (/viewers-miscellaneous/image-metadata-viewer) ──
		imageMetadataViewer: {
			/** Page header and sidebar title */
			title: "이미지 메타데이터 뷰어",
			/** Dropzone section heading; keep brackets */
			uploadLabel: "[ 업로드 ]",
			/** Dropzone text when file is being dragged over */
			dropHere: "이미지를 여기에 놓으세요...",
			/** Dropzone text in idle state */
			dropOrClick: "이미지를 여기에 끌어다 놓거나 클릭하여 선택하세요",
			/** Error shown when image has no EXIF data */
			noExif: "이 이미지에서 EXIF 데이터를 찾을 수 없습니다.",
			/** Error shown when uploaded file is not an image */
			invalidFile: "유효한 이미지 파일을 업로드해주세요.",
			/** Section heading above the EXIF table; keep brackets */
			exifDataLabel: "[ EXIF 데이터 ]",
			/** EXIF table column header — tag key */
			headerTag: "태그",
			/** EXIF table column header — tag value */
			headerValue: "값",
			/** Alt text for the uploaded image preview */
			imageAlt: "업로드됨",
			/** Hint text when no image is uploaded yet */
			emptyHint: "메타데이터를 보려면 이미지를 업로드하세요.",
		},
		// ─── Token Counter (/viewers-miscellaneous/token-counter) ──
		tokenCounter: {
			/** Page header and sidebar title */
			title: "토큰 카운터",
			/** Model selector label */
			modelLabel: "모델",
			/** Textarea label */
			inputLabel: "입력",
			/** Textarea placeholder */
			inputPlaceholder: "텍스트를 붙여넣으세요...",
			/** Stat card label — token count */
			tokensLabel: "토큰",
			/** Stat card label — character count */
			charsLabel: "문자",
			/** Stat card label — word count */
			wordsLabel: "단어",
			/** Stat card label — characters per token ratio */
			charsPerTokenLabel: "문자 / 토큰",
			/** Footer note; {model} = e.g. "gpt-4o", {encoding} = e.g. "o200k_base" */
			estimateNote: "[ 표시된 수치는 로컬 추정값입니다 — {model} / {encoding} ]",
		},
		// ─── Unicode Inspector (/viewers-miscellaneous/unicode-inspector) ──
		unicodeInspector: {
			/** Page header and sidebar title */
			title: "유니코드 인스펙터",
			/** Textarea label */
			inputLabel: "입력",
			/** Shown when input is empty; keep brackets */
			awaitingInput: "[ 입력 대기 중 ]",
			/** Section heading above the character table; keep brackets */
			breakdownLabel: "[ 문자 분석 ]",
			/** Table column header — the character itself */
			headerChar: "문자",
			/** Table column header — Unicode code point (U+XXXX) */
			headerCode: "U+코드",
			/** Table column header — decimal value */
			headerDec: "10진수",
			/** Table column header — UTF-8 byte sequence */
			headerUtf8: "UTF-8 바이트",
			/** Table column header — JavaScript escape sequence */
			headerJsEscape: "JS 이스케이프",
			/** Table column header — HTML entity */
			headerHtml: "HTML",
			/** Section heading above transform buttons; keep brackets */
			transformLabel: "[ 변환 ]",
			/** Button — escape all characters to \uXXXX */
			escapeAll: "모두 이스케이프",
			/** Button — unescape \uXXXX sequences */
			unescape: "이스케이프 해제",
			/** Output section label */
			outputLabel: "출력",
		},
		// ─── Discord Timestamp (/discord/timestamp) ──
		discordTimestamp: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "디스코드 타임스탬프",
			/** Placeholder text inside the natural-language input */
			naturalPlaceholder: "in 2 hours · tomorrow 9am · next friday",
			/** Note below timezone select explaining output renders per-reader */
			timezoneNote: "타임스탬프 태그는 각 읽는 사람의 로컬 시간대로 렌더링됩니다.",
			/** Label prefix for the relative-distance badge, followed by the offset value */
			targetLabel: "TARGET: {offset}",
			/** Hazard error shown when natural-language input cannot be parsed */
			parseError: "파싱 실패",
			/** Hazard error shown when unix input is NaN or negative */
			invalidUnix: "잘못된 UNIX 타임스탬프",
			/** {what} param for common.copiedType toast when copying a timestamp tag */
			copiedTag: "타임스탬프 태그",
			/** Quick chip: set date to now */
			chipNow: "NOW",
			/** Quick chip: add 1 hour */
			chipPlus1h: "+1H",
			/** Quick chip: add 1 day */
			chipPlus1d: "+1D",
			/** Quick chip: set to tomorrow 9:00 */
			chipTomorrow9: "내일 9:00",
			/** Table column header: style letter */
			colStyle: "STYLE",
			/** Table column header: syntax output */
			colSyntax: "SYNTAX",
			/** Table column header: rendered preview */
			colPreview: "RENDERED PREVIEW",
			/** Display name for style 't' — short time e.g. 16:20 */
			styleShortTime: "짧은 시간",
			/** Display name for style 'T' — long time e.g. 16:20:30 */
			styleLongTime: "긴 시간",
			/** Display name for style 'd' — short date e.g. 20/01/2024 */
			styleShortDate: "짧은 날짜",
			/** Display name for style 'D' — long date e.g. 20 January 2024 */
			styleLongDate: "긴 날짜",
			/** Display name for style 'f' — short date+time e.g. 20 January 2024 16:20 */
			styleShortDateTime: "짧은 날짜/시간",
			/** Display name for style 'F' — full date+time e.g. Saturday, 20 January 2024 16:20 */
			styleFull: "전체",
			/** Display name for style 'R' — relative e.g. in 2 hours */
			styleRelative: "상대적",
			/** sr-only aria-label on the per-row copy button */
			copyRowAria: "Copy {style} syntax",
		},
		// ─── Snowflake Decoder (/discord/snowflake) ──
		discordSnowflake: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "스노우플레이크 디코더",
			/** First tab trigger */
			decodeTab: "DECODE",
			/** Second tab trigger */
			buildTab: "BUILD",
			/** Third tab trigger */
			bulkTab: "BULK",
			/** Placeholder in the Decode tab's snowflake ID input */
			decodePlaceholder: "스노우플레이크 ID를 입력하세요...",
			/** Hazard error when input fails isValidSnowflake */
			invalidSnowflake: "잘못된 스노우플레이크",
			/** Hazard text in bulk table for an invalid row */
			invalidRow: "잘못됨",
			/** Label for the computed snowflake output on the Build tab */
			computedIdLabel: "SNOWFLAKE ID",
			/** Button label to copy the computed snowflake ID */
			copyId: "COPY",
			/** Button label to generate a random snowflake */
			randomButton: "RANDOM",
			/** {what} param for common.copiedType toast when copying a snowflake ID */
			copiedId: "스노우플레이크 ID",
			/** {what} param for common.copiedType toast when copying bulk JSON */
			copiedJson: "JSON 결과",
			/** Button label to copy bulk results as JSON */
			copyAsJson: "COPY AS JSON",
			/** Placeholder in the Bulk tab's textarea */
			bulkPlaceholder: "스노우플레이크 ID를 여기에 붙여넣기 (줄바꿈 또는 쉼표로 구분)...",
			/** Results table column header: snowflake ID */
			colId: "ID",
			/** Results table column header: local creation datetime */
			colCreatedLocal: "CREATED (LOCAL)",
			/** Results table column header: UTC creation datetime */
			colCreatedUtc: "CREATED (UTC)",
			/** Results table column header: relative age */
			colAge: "AGE",
			/** Results table column header: worker ID */
			colWorker: "WORKER",
			/** Results table column header: process ID */
			colProcess: "PROCESS",
			/** Results table column header: increment */
			colIncrement: "INCREMENT",
			/** Legend label: timestamp bits 63–22 */
			legendTimestamp: "Timestamp",
			/** Legend label: worker bits 21–17 */
			legendWorker: "Worker",
			/** Legend label: process bits 16–12 */
			legendProcess: "Process",
			/** Legend label: increment bits 11–0 */
			legendIncrement: "Increment",
			/** Label for the worker number input on the Build tab */
			workerLabel: "Worker",
			/** Label for the process number input on the Build tab */
			processLabel: "Process",
			/** Label for the increment number input on the Build tab */
			incrementLabel: "Increment",
			/** Tooltip on binary grid cell hover; {index} = bit position */
			bitTooltip: "Bit {index}",
			/** sr-only aria-label on a per-row copy button */
			copyRowAria: "Copy {field}",
		},
		// ─── Permissions Calculator (/discord/permissions) ──
		discordPermissions: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "권한 계산기",
			/** Placeholder in the bitfield input */
			bitfieldPlaceholder: "10진수 또는 0x 16진수...",
			/** Preset option: Administrator */
			presetAdministrator: "Administrator",
			/** Preset option: Basic Member */
			presetBasicMember: "Basic Member",
			/** Preset option: Moderator */
			presetModerator: "Moderator",
			/** Preset option: Read Only */
			presetReadOnly: "Read Only",
			/** {what} param for common.copiedType toast when copying bitfield */
			copiedBitfield: "비트필드",
			/** Label for the output readout section */
			outputLabel: "OUTPUT",
			/** Label for the decimal value in the output readout */
			decimalLabel: "DEC",
			/** Label for the hex value in the output readout */
			hexLabel: "HEX",
			/** Banner shown when Administrator bit is set */
			adminBanner: "ADMINISTRATOR는 모든 권한을 포함합니다",
			/** Hazard row for unknown bits; {hex} is the hex string of unknown bits */
			unknownBits: "알 수 없는 비트: {hex}",
			/** Placeholder in the search/filter input */
			searchPlaceholder: "권한 필터...",
			/** Collapsible group header: general */
			groupGeneral: "GENERAL",
			/** Collapsible group header: membership */
			groupMembership: "MEMBERSHIP",
			/** Collapsible group header: text */
			groupText: "TEXT",
			/** Collapsible group header: voice */
			groupVoice: "VOICE",
			/** Collapsible group header: advanced */
			groupAdvanced: "ADVANCED",
			/** Label for the presets dropdown */
			presetsLabel: "PRESETS",
			/** Footer hint text linking to the Invite URL Builder tool */
			footerHint: "권한이 포함된 초대 URL 생성 → Invite URL Builder",
			/** sr-only aria-label on a copy button */
			copyAria: "Copy {value}",
		},
		// ─── Intents Calculator (/discord/intents) ──
		discordIntents: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "인텐트 계산기",
			/** Placeholder in the bitfield input */
			bitfieldPlaceholder: "10진수 또는 0x 16진수...",
			/** {what} param for common.copiedType toast when copying bitfield */
			copiedBitfield: "비트필드",
			/** {what} param for common.copiedType toast when copying code snippet */
			copiedSnippet: "코드 스니펫",
			/** Label for the output readout section */
			outputLabel: "OUTPUT",
			/** Label for the decimal value in the output readout */
			decimalLabel: "DEC",
			/** Label for the hex value in the output readout */
			hexLabel: "HEX",
			/** Badge text shown next to privileged intents */
			privilegedBadge: "PRIVILEGED — 개발 포털에서 활성화 필요",
			/** Tab trigger for discord.js code snippet */
			discordJsTab: "DISCORD.JS",
			/** Tab trigger for discord.py code snippet */
			discordPyTab: "DISCORD.PY",
			/** Group header: guild-related intents */
			groupGuild: "GUILD",
			/** Group header: message-related intents */
			groupMessages: "MESSAGES & REACTIONS",
			/** Group header: direct message intents */
			groupDirectMessages: "DIRECT MESSAGES",
			/** Group header: scheduling and automod intents */
			groupScheduling: "SCHEDULING & AUTOMOD",
			/** sr-only aria-label on a copy button */
			copyAria: "Copy {value}",
		},
		// ─── Embed Builder (/discord/embed) ──
		discordEmbed: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "임베드 빌더",
			/** sr-only description of the tab group */
			srTabsDescription: "임베드 미리보기, JSON 출력, 가져오기",
			/** First tab trigger */
			previewTab: "PREVIEW",
			/** Second tab trigger */
			jsonTab: "JSON",
			/** Third tab trigger */
			importTab: "IMPORT",
			/** Label for the Title input */
			titleLabel: "TITLE",
			/** Label for the Description textarea */
			descriptionLabel: "DESCRIPTION",
			/** Label for the URL input */
			urlLabel: "URL",
			/** Label for the COLOR controls row */
			colorLabel: "COLOR",
			/** Label for the AUTHOR section */
			authorLabel: "AUTHOR",
			/** Label for the Author name input */
			authorNameLabel: "NAME",
			/** Label for the Author URL input */
			authorUrlLabel: "URL",
			/** Label for the Author icon URL input */
			authorIconLabel: "ICON URL",
			/** Label for the FIELDS section */
			fieldsLabel: "FIELDS",
			/** Label for the field name input inside a field row */
			fieldNameLabel: "NAME",
			/** Label for the field value textarea inside a field row */
			fieldValueLabel: "VALUE",
			/** Label for the field inline switch */
			fieldInlineLabel: "INLINE",
			/** Button to add a new embed field */
			addFieldButton: "ADD FIELD",
			/** sr-only aria-label on the remove-field button */
			removeFieldAria: "필드 제거",
			/** sr-only aria-label on the move-field-up button */
			moveFieldUpAria: "필드 위로 이동",
			/** sr-only aria-label on the move-field-down button */
			moveFieldDownAria: "필드 아래로 이동",
			/** Label for the IMAGE url input */
			imageLabel: "IMAGE",
			/** Label for the THUMBNAIL url input */
			thumbnailLabel: "THUMBNAIL",
			/** Label for the FOOTER section */
			footerLabel: "FOOTER",
			/** Label for the footer text input */
			footerTextLabel: "TEXT",
			/** Label for the footer icon URL input */
			footerIconLabel: "ICON URL",
			/** Label for the TIMESTAMP switch */
			timestampLabel: "TIMESTAMP",
			/** Label for the COPY button on the JSON tab */
			copyJsonButton: "COPY",
			/** Label for the MINIFIED toggle button on the JSON tab */
			minifiedButton: "MINIFIED",
			/** Label for the VALIDATION panel heading */
			validationLabel: "VALIDATION",
			/** Validation message when a field exceeds its limit; {field} and {current}/{max} */
			overBudget: "{field}: {current}/{max}",
			/** Validation message when fields count exceeds 25; {count} */
			tooManyFields: "{count}개 필드 (최대 25)",
			/** Validation message for total embed budget; {current}/{max} */
			totalBudget: "합계: {current}/{max}",
			/** Label for the IMPORT button on the Import tab */
			importButton: "IMPORT",
			/** Placeholder in the import textarea */
			importPlaceholder: "임베드 JSON을 여기에 붙여넣기...",
			/** Muted text shown when the preview has no content */
			emptyPreview: "미리보기를 보려면 필드를 채우세요",
			/** Footer link text pointing to the webhook sender */
			footerSendIt: "SEND IT → WEBHOOK SENDER",
			/** {what} for common.copiedType toast after copying JSON */
			jsonOutput: "임베드 JSON",
		},
		// ─── Invite URL Builder (/discord/invite) ──
		discordInvite: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "초대 URL 빌더",
			/** sr-only description of the tab group */
			srTabsDescription: "디스코드 OAuth2 초대 URL 빌드 또는 파싱",
			/** First tab trigger */
			buildTab: "BUILD",
			/** Second tab trigger */
			parseTab: "PARSE",
			/** Label for the CLIENT ID input */
			clientIdLabel: "CLIENT ID",
			/** Muted hint when client ID is a valid snowflake; {date} is formatted creation date */
			snowflakeCreated: "CREATED {date}",
			/** Hazard warning when client ID is not a valid snowflake */
			invalidSnowflake: "잘못된 스노우플레이크 ID",
			/** Label for the SCOPES checkbox group */
			scopesLabel: "SCOPES",
			/** Label for the PERMISSIONS input */
			permissionsLabel: "PERMISSIONS",
			/** Placeholder for the permissions preset select */
			presetPlaceholder: "Presets",
			/** Inline link text to open the permissions calculator */
			openPermissionsCalc: "OPEN PERMISSIONS CALCULATOR →",
			/** Label for the GUILD ID input */
			guildIdLabel: "GUILD ID",
			/** Label for the DISABLE GUILD SELECT switch */
			disableGuildSelectLabel: "DISABLE GUILD SELECT",
			/** Label for the REDIRECT URI input */
			redirectUriLabel: "REDIRECT URI",
			/** Label for the RESPONSE TYPE select */
			responseTypeLabel: "RESPONSE TYPE",
			/** Label for the COPY button */
			copyButton: "COPY",
			/** Label for the OPEN button */
			openButton: "OPEN",
			/** Label for the PARSE button on the Parse tab */
			parseButton: "PARSE",
			/** Placeholder in the parse textarea */
			parsePlaceholder: "디스코드 OAuth2 authorize URL을 여기에 붙여넣기...",
			/** Heading for unknown query params found during parse */
			unknownParamsLabel: "UNKNOWN PARAMS",
			/** {what} for common.copiedType toast after copying URL */
			inviteUrl: "초대 URL",
		},
		// ─── Webhook Sender (/discord/webhook) ──
		discordWebhook: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "웹훅 전송",
			/** Label for the webhook URL input */
			urlLabel: "WEBHOOK URL",
			/** Hazard error when webhook URL does not match the expected pattern */
			invalidWebhookUrl: "잘못된 웹훅 URL 형식",
			/** Explicit notice that the URL is not stored; rendered as mono uppercase */
			urlNotice: "URL은 이 탭에만 유지됩니다 — 아무것도 저장되지 않습니다",
			/** Label for the INSPECT button */
			inspectButton: "INSPECT",
			/** Label for the CONTENT textarea */
			contentLabel: "CONTENT",
			/** Label for the USERNAME input */
			usernameLabel: "USERNAME",
			/** Label for the AVATAR URL input */
			avatarUrlLabel: "AVATAR URL",
			/** Label for the EMBEDS JSON textarea */
			embedsLabel: "EMBEDS JSON",
			/** Validation error: embeds textarea does not contain valid JSON */
			embedsInvalidJson: "잘못된 JSON",
			/** Validation error: parsed JSON is not an array */
			embedsNotArray: "임베드는 JSON 배열이어야 합니다",
			/** Validation error: too many embeds; {count} is the actual number */
			embedsTooMany: "{count}개 임베드 (최대 10)",
			/** Label for the SEND button */
			sendButton: "SEND",
			/** AlertDialog title before sending */
			confirmTitle: "웹훅으로 전송",
			/** AlertDialog description before sending */
			confirmDescription: "위 웹훅 URL로 메시지를 전송합니다. 계속하시겠습니까?",
			/** AlertDialog cancel button next to the send confirmation */
			cancelButton: "취소",
			/** Sonner success toast after 204 response */
			sent: "전송됨",
			/** Error row when rate-limited; {seconds} is retry_after from Discord */
			rateLimited: "RATE LIMITED — {seconds}초 후 재시도",
			/** Error row prefix for non-429 errors; {code} and {message} from Discord response */
			errorResponse: "{code}: {message}",
			/** Label shown next to the webhook name in the inspect result */
			inspectName: "NAME",
			/** Label shown next to the channel ID in the inspect result */
			inspectChannel: "CHANNEL ID",
			/** Label shown next to the avatar URL in the inspect result */
			inspectAvatar: "AVATAR",
		},
		// ─── Mention Builder (/discord/mentions) ──
		discordMentions: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "멘션 빌더",
			/** sr-only description of the tab group */
			srTabsDescription: "디스코드 멘션 문자열 빌드 또는 추출",
			/** First tab trigger */
			buildTab: "BUILD",
			/** Second tab trigger */
			extractTab: "EXTRACT",
			/** Label for the TYPE radio group */
			typeLabel: "TYPE",
			/** Radio option label for User mention */
			typeUser: "User",
			/** Radio option label for Role mention */
			typeRole: "Role",
			/** Radio option label for Channel mention */
			typeChannel: "Channel",
			/** Radio option label for Slash command mention */
			typeSlash: "Slash command",
			/** Radio option label for Custom emoji mention */
			typeEmoji: "Custom emoji",
			/** Label for timestamp-type rows in the extract table */
			typeTimestamp: "타임스탬프",
			/** Label for the ID input */
			idLabel: "ID",
			/** Label for the NAME input (visible for slash + emoji) */
			nameLabel: "NAME",
			/** Label for the ANIMATED switch (visible for emoji) */
			animatedLabel: "ANIMATED",
			/** Label for the COPY button on the Build tab */
			copyButton: "COPY",
			/** Placeholder in the extract textarea */
			extractPlaceholder: "멘션이 포함된 텍스트를 여기에 붙여넣기...",
			/** Table column header: mention type */
			colType: "TYPE",
			/** Table column header: raw mention string */
			colRaw: "RAW",
			/** Table column header: snowflake ID */
			colId: "ID",
			/** Table column header: display name (when present) */
			colName: "NAME",
			/** Table column header: creation date from snowflake */
			colCreated: "CREATED",
			/** sr-only aria-label on the per-row COPY ID button */
			copyIdAria: "ID 복사",
			/** Inline link text per row linking to snowflake decoder */
			decodeLink: "DECODE →",
			/** Muted text shown when no mentions are found in the extract textarea */
			noMentionsFound: "멘션을 찾을 수 없습니다",
			/** {what} for common.copiedType toast after copying mention string */
			mentionString: "멘션 문자열",
			/** {what} for common.copiedType toast after copying an ID */
			mentionId: "멘션 ID",
		},
		// ─── CDN Link Builder (/discord/cdn) ──
		discordCdn: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "CDN 링크 빌더",
			/** EMOJI tab trigger label */
			tabEmoji: "Emoji",
			/** AVATAR tab trigger label */
			tabAvatar: "Avatar",
			/** DEFAULT AVATAR tab trigger label */
			tabDefaultAvatar: "Default Avatar",
			/** BANNER tab trigger label */
			tabBanner: "Banner",
			/** GUILD ICON tab trigger label */
			tabGuildIcon: "Guild Icon",
			/** STICKER tab trigger label */
			tabSticker: "Sticker",
			/** Label above the primary emoji input */
			emojiInputLabel: "Emoji",
			/** Placeholder in the primary emoji input */
			emojiInputPlaceholder: "<:name:id> 또는 emoji ID",
			/** Label above the NAME input (editable fallback when plain ID given) */
			emojiNameLabel: "Name",
			/** Label above the FORMAT select (emoji tab) */
			formatLabel: "Format",
			/** Label above the SIZE select */
			sizeLabel: "Size",
			/** Error shown when emoji input is not a valid mention or numeric ID */
			emojiParseError: "유효한 이모지 멘션 (<:name:id>) 또는 숫자 ID를 입력하세요",
			/** Label above USER ID input (avatar, banner, default avatar tabs) */
			userIdLabel: "User ID",
			/** Label above AVATAR HASH input */
			avatarHashLabel: "Avatar Hash",
			/** Error shown when user ID is empty */
			userIdRequired: "User ID가 필요합니다",
			/** Error shown when hash is empty */
			hashRequired: "Hash가 필요합니다",
			/** Generic error for invalid input producing empty URL */
			invalidInput: "잘못된 입력",
			/** Note below default avatar output warning it changes */
			defaultAvatarNote: "아바타 변경 시 함께 변경됩니다",
			/** Label above GUILD ID input */
			guildIdLabel: "Guild ID",
			/** Label above HASH input (banner, guild icon tabs) */
			hashLabel: "Hash",
			/** Label above STICKER ID input */
			stickerIdLabel: "Sticker ID",
			/** aria-label on the COPY button */
			copyAria: "CDN URL 복사",
			/** aria-label on the OPEN link */
			openAria: "새 탭에서 CDN URL 열기",
			/** Hint label above the chat-usable markdown badge (emoji tab) */
			chatMarkdownHint: "채팅에서 사용",
		},
		// ─── Message Link Parser (/discord/message-link) ──
		discordMessageLink: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "메시지 링크 파서",
			/** PARSE tab trigger label */
			tabParse: "Parse",
			/** BUILD tab trigger label */
			tabBuild: "Build",
			/** Placeholder in the parse input */
			parsePlaceholder: "디스코드 메시지 또는 초대 URL을 여기에 붙여넣기...",
			/** Error shown when input matches neither message nor invite pattern */
			parseError: "유효한 디스코드 메시지 또는 초대 URL이 아닙니다",
			/** Row label for the guild ID in parse results */
			guildLabel: "GUILD",
			/** Row label for the channel ID in parse results */
			channelLabel: "CHANNEL",
			/** Row label for the message ID in parse results */
			messageLabel: "MESSAGE",
			/** Row label for the decoded creation date */
			createdLabel: "CREATED",
			/** Row label for the canonical URL */
			canonicalUrlLabel: "CANONICAL URL",
			/** Text shown when guild is @me (DM) in parse results */
			dmLabel: "DM — @me",
			/** Link text to navigate to Snowflake Decoder */
			decodeLink: "DECODE →",
			/** Row label for invite code */
			codeLabel: "CODE",
			/** Label above GUILD ID input in build tab */
			buildGuildLabel: "Guild ID",
			/** Placeholder for guild ID input */
			buildGuildPlaceholder: "선택사항 — 기본값 @me",
			/** Label above CHANNEL ID input in build tab */
			buildChannelLabel: "Channel ID",
			/** Label above MESSAGE ID input in build tab */
			buildMessageLabel: "Message ID",
			/** Error when channel ID is empty in build tab */
			channelIdRequired: "Channel ID가 필요합니다",
			/** Error when message ID is non-numeric in build tab */
			messageIdNumeric: "Message ID는 숫자여야 합니다",
			/** aria-label on COPY button in parse results */
			copyAria: "값 복사",
			/** aria-label on OPEN link */
			openAria: "새 탭에서 링크 열기",
		},
		// ─── Discord Markdown (/discord/markdown) ──
		discordMarkdown: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "디스코드 마크다운",
			/** PREVIEW tab trigger label */
			tabPreview: "Preview",
			/** ESCAPED tab trigger label */
			tabEscaped: "Escaped",
			/** Placeholder text in the editor textarea */
			editorPlaceholder: "디스코드 마크다운을 입력하세요...",
			/** aria-label on Bold toolbar button */
			boldAria: "Bold",
			/** aria-label on Italic toolbar button */
			italicAria: "Italic",
			/** aria-label on Underline toolbar button */
			underlineAria: "Underline",
			/** aria-label on Strikethrough toolbar button */
			strikeAria: "Strikethrough",
			/** aria-label on Spoiler toolbar button */
			spoilerAria: "Spoiler",
			/** aria-label on Inline Code toolbar button */
			inlineCodeAria: "Inline Code",
			/** aria-label on Code Block toolbar button */
			codeBlockAria: "Code Block",
			/** aria-label on Quote toolbar button */
			quoteAria: "Block Quote",
			/** aria-label on List toolbar button */
			listAria: "List",
			/** aria-label on Link toolbar button */
			linkAria: "Link",
			/** aria-label on COPY button in escaped tab */
			copyEscapedAria: "이스케이프된 텍스트 복사",
			/** Hint text shown at the bottom of the editor zone */
			syntaxHint: "Bold, italic, underline, strikethrough, spoiler, inline code, code blocks, headings, block quotes, lists, links 지원",
		},
		// ─── ANSI Colors (/discord/ansi) ──
		discordAnsi: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "ANSI 색상",
			/** BUILD tab trigger label */
			tabBuild: "Build",
			/** PARSE tab trigger label */
			tabParse: "Parse",
			/** Placeholder in segment text input */
			segmentTextPlaceholder: "Text",
			/** Label for the BOLD switch */
			boldLabel: "B",
			/** Label for the UNDERLINE switch */
			underlineLabel: "U",
			/** aria-label on the REMOVE segment button */
			removeSegmentAria: "세그먼트 제거",
			/** Label on the ADD SEGMENT button */
			addSegmentButton: "세그먼트 추가",
			/** aria-label on the COPY button in the output panel */
			copyOutputAria: "ANSI 블록 복사",
			/** Placeholder in the parse textarea */
			parsePlaceholder: "ANSI 코드 블록을 여기에 붙여넣기...",
			/** Label on the parse button */
			parseButton: "Parse",
			/** Error shown when parsed ANSI content yields no segments */
			parseError: "입력에서 ANSI 시퀀스를 찾을 수 없습니다",
			/** Label for the PREVIEW section heading */
			previewLabel: "Preview",
			/** Label for the OUTPUT section heading */
			outputLabel: "Output",
			/** Label for the FG select */
			fgLabel: "FG",
			/** Label for the BG select */
			bgLabel: "BG",
		},
		// ─── Message Splitter (/discord/splitter) ──
		discordSplitter: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "메시지 분할기",
			/** Bracketed micro label above the input textarea; keep brackets */
			inputLabel: "[ INPUT ]",
			/** Textarea placeholder */
			inputPlaceholder: "분할할 긴 메시지를 여기에 붙여넣기...",
			/** Bracketed micro label above the options row; keep brackets */
			optionsLabel: "[ OPTIONS ]",
			/** Mono label in front of the limit select */
			limitLabel: "LIMIT",
			/** Select option — regular 2000-char message limit */
			limit2000: "2000",
			/** Select option — Nitro 4000-char message limit */
			limit4000: "4000",
			/** Select option revealing the custom numeric input */
			limitCustom: "CUSTOM",
			/** Placeholder + aria-label of the numeric custom-limit input */
			customLimitPlaceholder: "100 – 3800",
			/** Mono label in front of the NUMBER PARTS switch */
			numberPartsLabel: "NUMBER PARTS",
			/** sr-only aria-label on the NUMBER PARTS switch */
			numberPartsAria: "각 파트에 n/N 위치 접두어 추가",
			/** Stats line under options; {n} = part count, {x} = longest part length, {limit} = active limit */
			statsLine: "{n} PARTS · LONGEST {x}/{limit}",
			/** Bracketed micro label above the output list; keep brackets */
			outputLabel: "[ OUTPUT ]",
			/** Chunk card header; {n} = part index, {total} = part count, {len} = length incl. prefix, {limit} = active limit */
			partHeader: "PART {n}/{total} · {len}/{limit}",
			/** Hazard badge in a card header when that part came from a mid-line hard split */
			longLineChip: "LONG LINE SPLIT",
			/** Button expanding a truncated chunk body */
			expandButton: "EXPAND",
			/** Button collapsing an expanded chunk body */
			collapseButton: "COLLAPSE",
			/** Label on the per-chunk Copy button */
			copyButton: "COPY",
			/** sr-only aria-label on the per-chunk Copy button; {n} = part index */
			copyAria: "Copy part {n}",
			/** {what} for common.copiedType toast after copying a part; {n} = part index */
			partName: "Part {n}",
			/** Empty-state hint in the output zone when there is nothing to split */
			emptyHint: "텍스트를 붙여넣으면 파트가 여기에 나타납니다...",
		},
		// ─── Character Counter (/discord/char-counter) ──
		discordCharCounter: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "문자 수 계산기",
			/** Bracketed micro label above the input textarea; keep brackets */
			inputLabel: "[ INPUT ]",
			/** Textarea placeholder */
			inputPlaceholder: "측정할 텍스트를 입력하거나 붙여넣기...",
			/** Summary chip showing the Unicode code-point count; {n} = count */
			codePointsChip: "CODE POINTS {n}",
			/** Summary chip showing the UTF-16 code-unit count; {n} = count */
			utf16Chip: "UTF-16 UNITS {n}",
			/** title tooltip on the UTF-16 chip explaining the divergence */
			unitsTitle: "Astral 문자 (대부분의 이모지, 스타일 문자)는 1개의 코드 포인트에 2개의 UTF-16 유닛을 사용합니다. 디스코드는 대략 UTF-16 유닛 단위로 계산합니다.",
			/** First filter tab — show all meter groups */
			tabAll: "ALL",
			/** Second filter tab — message-length meters */
			tabMessages: "MESSAGES",
			/** Third filter tab — embed meters */
			tabEmbeds: "EMBEDS",
			/** Fourth filter tab — name/profile meters */
			tabNames: "NAMES",
			/** Muted chip shown on a meter row whose count is within the limit */
			fitsChip: "FITS",
			/** sr-only aria-label describing a meter row; {name} = English limit name, {n} = count, {limit} = display limit */
			meterAria: "{name}: {n} / {limit}",
			/** Muted footnote under the meters about counting semantics */
			footnote: "미터는 코드 포인트를 사용합니다. 디스코드는 대략 UTF-16 유닛 단위로 계산합니다 — 이모지가 많은 텍스트의 경우 UTF-16 UNITS 칩을 비교하세요.",
		},
		// ─── Fancy Text (/generators/fancy-text) ──
		fancyText: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "팬시 텍스트",
			/** Label shown above the text input */
			inputLabel: "[ INPUT ]",
			/** Placeholder inside the text input */
			inputPlaceholder: "텍스트를 입력하세요...",
			/** Sample text shown in style previews when input is empty */
			sampleText: "Kit Devkit",
			/** Toast {what} value after copying a styled text; {style} = style name */
			copiedStyle: "{style} 텍스트",
			/** sr-only aria-label on each card's Copy button; {style} = style name */
			copyStyleAria: "Copy {style} text",
			/** Footer accessibility warning about screen readers */
			accessibilityNote: "스크린 리더가 스타일 텍스트를 개별 기호로 읽을 수 있습니다",
		},
		// ─── Invisible Text (/generators/invisible-text) ──
		invisibleText: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "보이지 않는 텍스트",
			/** COPY tab trigger label */
			copyTab: "COPY",
			/** INSPECT tab trigger label */
			inspectTab: "INSPECT",
			/** Placeholder inside the inspect textarea */
			inspectPlaceholder: "보이지 않는 문자를 검사할 텍스트를 여기에 붙여넣기...",
			/** Label above the found-characters list in inspect results */
			foundLabel: "[ FOUND ]",
			/** {what} for toast after copying a single invisible char; {name} = char name */
			copiedChar: "{name}",
			/** sr-only aria-label on the Copy ×1 button; {name} = char name */
			copyCharAria: "Copy {name}",
			/** sr-only aria-label on the Copy ×5 button; {name} = char name */
			copyChar5Aria: "Copy {name} ×5",
			/** Label on the STRIP button in inspect results */
			stripButton: "STRIP",
			/** Label above the cleaned output panel */
			cleanedLabel: "[ CLEANED OUTPUT ]",
			/** {what} for toast after copying cleaned text */
			cleanedText: "정리된 텍스트",
			/** sr-only aria-label on the copy-cleaned button */
			copyCleanedAria: "정리된 텍스트 복사",
			/** Muted message when no invisible characters are found in inspect */
			noneFound: "보이지 않는 문자를 찾을 수 없습니다",
			/** Footer moderation/accessibility warning */
			footerWarning: "보이지 않는 텍스트는 스크린 리더와 모더레이션 도구를 중단시킬 수 있습니다 — 신중하게 사용하세요",
		},
		// ─── Emoji Resizer (/generators/emoji-resizer) ──
		emojiResizer: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "이모지 리사이저",
			/** Bracketed micro label above the drop zone; keep brackets */
			uploadLabel: "[ UPLOAD ]",
			/** Bracketed micro label above the resize options row; keep brackets */
			optionsLabel: "[ 옵션 ]",
			/** Dropzone text in idle state */
			dropOrClick: "이미지를 드래그 앤 드롭하거나 클릭하여 선택",
			/** Dropzone text while a file is dragged over */
			dropHere: "이미지를 여기에 드롭...",
			/** sr-only aria-label on the clickable drop zone */
			uploadFileAria: "리사이즈할 이미지 업로드",
			/** Hazard toast when the dropped file is not an image */
			invalidFile: "유효한 이미지 파일을 드롭하세요.",
			/** Mono label in front of the mode tabs */
			modeLabel: "MODE",
			/** First mode tab — emoji constraints */
			modeEmoji: "EMOJI",
			/** Second mode tab — sticker constraints */
			modeSticker: "STICKER",
			/** Mono label in front of the FIT select */
			fitLabel: "FIT",
			/** FIT option — fit whole image inside the square (letterbox) */
			fitContain: "CONTAIN",
			/** FIT option — fill the square, cropping overflow */
			fitCover: "COVER",
			/** Mono label in front of the FORMAT select */
			formatLabel: "FORMAT",
			/** sr-only aria-label describing the FIT select */
			fitAria: "이미지가 정사각형을 채우는 방식",
			/** sr-only aria-label describing the FORMAT select */
			formatAria: "출력 인코딩 형식",
			/** Mono label in front of the quality slider */
			qualityLabel: "QUALITY",
			/** sr-only aria-label on the quality slider */
			qualityAria: "인코딩 품질, 50에서 100",
			/** Bracketed micro label above the preview area; keep brackets */
			previewLabel: "[ PREVIEW ]",
			/** Verdict chip when the output meets the size budget */
			withinLimit: "WITHIN LIMIT",
			/** Hazard verdict chip when the output exceeds the size budget */
			overBudget: "OVER BUDGET — 품질을 낮춰보세요",
			/** Muted note under the preview explaining JPEG transparency handling */
			jpegNote: "JPEG에는 투명도가 없습니다 — 투명한 영역은 흰색으로 채워집니다.",
			/** Label on the download button */
			downloadButton: "DOWNLOAD",
			/** sr-only aria-label on the download button; {filename} = generated file name */
			downloadAria: "Download resized image as {filename}",
		},
		// ─── Discord Limits (/viewers-miscellaneous/discord-limits) ──
		discordLimits: {
			/** ToolHeader title; sidebar + homepage card use the same key */
			title: "디스코드 제한",
			/** Search input placeholder */
			filterPlaceholder: "FILTER LIMITS",
			/** sr-only aria-label on the search input */
			filterAria: "이름 또는 그룹으로 제한 필터",
		},
	},
};
