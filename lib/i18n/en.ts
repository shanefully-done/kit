// Kit. — English dictionary (source of truth).
// ko.ts must define every key defined here (type-checked).
// Comments are written for a translator who sees only this file:
// they describe where each string renders and its constraints.
// `{var}` placeholders are interpolated at runtime — keep them verbatim.
export const en = {
	common: {
		/** Generic copy-to-clipboard button */
		copy: "Copy",
		/** Toast title after copying; {what} = e.g. "Password", "JSON" */
		copiedType: "{what} copied to clipboard!",
		/** Toast title after copying, no object named */
		copied: "Copied to clipboard!",
		/** Toast title when a copy to the clipboard fails */
		copyFailed: "Failed to copy to clipboard.",
		/** Resets a tool's inputs/outputs */
		clear: "Clear",
	},
	ui: {
		/** sr-only label on × close buttons (Dialog, Sheet) */
		close: "Close",
		/** Mobile header button that opens the navigation Sheet */
		openNavigation: "Open navigation",
		/** Pagination — previous page link text */
		previous: "Previous",
		/** Pagination — next page link text */
		next: "Next",
		/** Pagination — aria-label on the previous page link */
		goToPreviousPage: "Go to previous page",
		/** Pagination — aria-label on the next page link */
		goToNextPage: "Go to next page",
		/** Pagination — sr-only text on the … ellipsis */
		morePages: "More pages",
		/** Command dialog sr-only title (default) */
		commandTitle: "Command Palette",
		/** Command dialog sr-only description (default) */
		commandDesc: "Search for a command to run...",
	},
	nav: {
		/** Sidebar search box placeholder; mono uppercase micro label, keep short */
		filterPlaceholder: "FILTER UNITS",
		/** Sidebar search box aria-label */
		filterAria: "Filter tools",
		/** Sidebar filter empty state; keep the brackets */
		noMatch: "[ NO MATCH ]",
		/** aria-label of the theme radio row (System/Light/Dark) */
		themeAria: "Color theme",
		/** aria-label of the language radio row (EN/한국어) */
		languageAria: "Language",
		/** Sidebar footer, line 1; © IXTJ stays literal */
		footerLine1: "© IXTJ / ALL PROCESSING LOCAL",
		/** Sidebar footer, line 2; UNIT D-01 stays literal */
		footerLine2: "NO ACCOUNTS · NO TELEMETRY · UNIT D-01",
		/** Sidebar + homepage section headings */
		categories: {
			/** Route group /converters-parsers */
			converters: "Converters & Parsers",
			/** Route group /generators */
			generators: "Generators",
			/** Route group /viewers-miscellaneous */
			viewers: "Viewers & Misc",
			/** Sidebar + homepage section heading for Discord message tools */
			discordMessages: "Discord · Messages",
			/** Sidebar + homepage section heading for Discord developer tools */
			discordDevelopers: "Discord · Developers",
		},
	},
	home: {
		/** Homepage top strip, left; KIT® and REV 2.6 stay literal */
		topStrip: "KIT® DEV TOOLKIT / REV 2.6",
		/** Homepage top strip GitHub button */
		sourceButton: "SOURCE / GITHUB",
		/** Hero stats line; {units} and {sections} are zero-padded numbers */
		statsUnits: "{units} UNITS / {sections} SECTIONS",
		/** Hero stats line — processing tagline */
		allLocal: "ALL PROCESSING LOCAL",
		/** Hero stats line — privacy tagline; keep ™ */
		noTelemetry: "NO ACCOUNTS / NO TELEMETRY™",
		/** Per-section counter; {count} zero-padded */
		unitsCount: "{count} UNITS",
		/** Homepage footer font credit — keep exactly in sync with fonts in use; font names stay Latin */
		setIn: "SET IN INTER + IBM PLEX MONO + PRETENDARD ®",
	},
	tools: {
	// ─── Base64 Encoder/Decoder (/converters-parsers/base64-encoder-decoder) ──
	base64EncoderDecoder: {
		/** ToolHeader title; sidebar + homepage card use the same key */
		title: "Base64 Encoder/Decoder",
		/** sr-only paragraph above the tab group */
		srTabsDescription: "Inputs and outputs organized in tabs below",
		/** Label next to the URL-safe switch */
		urlSafeModeLabel: "URL-SAFE MODE",
		/** Status text shown when the URL-safe switch is on */
		on: "ON",
		/** Status text shown when the URL-safe switch is off */
		off: "OFF",
		/** sr-only aria-label on the URL-safe switch */
		urlSafeToggleAria: "Toggle URL-safe encoding",
		/** First tab trigger (encode direction) */
		encodeTab: "Encode",
		/** Second tab trigger (decode direction) */
		decodeTab: "Decode",
		/** Bracketed micro label above both input areas; keep brackets */
		inputLabel: "[ INPUT ]",
		/** Bracketed micro label above both output areas; keep brackets */
		outputLabel: "[ OUTPUT ]",
		/** Textarea placeholder in the Encode tab */
		encodePlaceholder: "Enter text to encode...",
		/** Textarea placeholder in the Decode tab */
		decodePlaceholder: "Enter Base64 string to decode...",
		/** Drag & drop zone caption in the Encode tab */
		dropzoneLabel: "Drag & drop a file here, or click to select",
		/** aria-label on the clickable drop zone in the Encode tab */
		uploadFileAria: "Upload file to encode",
		/** Primary button in the Encode tab */
		encodeButton: "Encode",
		/** Primary button in the Decode tab */
		decodeButton: "Decode",
		/** Empty-state hint in the Encode output box */
		encodedEmptyHint: "Encoded output will appear here...",
		/** Empty-state hint in the Decode output box */
		decodedEmptyHint: "Decoded output will appear here...",
		/** {what} for common.copiedType toast after copying encoded text */
		encodedText: "Encoded text",
		/** {what} for common.copiedType toast after copying decoded text */
		decodedText: "Decoded text",
		/** aria-label on the Copy button in the Encode tab */
		copyEncodedAria: "Copy encoded output",
		/** aria-label on the Copy button in the Decode tab */
		copyDecodedAria: "Copy decoded output",
		/** Error line shown when encoding/decoding fails; {message} = library error text */
		errorPrefix: "Error: {message}",
	},
	// ─── Base64 Image Converter (/converters-parsers/base64-image-converter) ──
	base64ImageConverter: {
		/** ToolHeader title; sidebar + homepage card use the same key */
		title: "Base64 Image Converter",
		/** sr-only paragraph above the tab group */
		srTabsDescription: "Inputs and outputs organized in tabs below",
		/** Label next to the data-URI-prefix switch */
		dataUriPrefixLabel: "DATA URI PREFIX",
		/** Status text shown when the switch is on */
		on: "ON",
		/** Status text shown when the switch is off */
		off: "OFF",
		/** aria-label on the data-URI-prefix switch */
		dataUriToggleAria: "Toggle data URI prefix",
		/** First tab trigger (image encodes to Base64); keep the arrow */
		imgToBase64Tab: "Image → Base64",
		/** Second tab trigger (Base64 decodes to image); keep the arrow */
		base64ToImgTab: "Base64 → Image",
		/** Drag & drop zone caption in the Image → Base64 tab */
		dropzoneLabel: "Drag & drop an image here, or click to select",
		/** aria-label on the clickable drop zone */
		uploadImageAria: "Upload image to convert",
		/** Bracketed heading of the uploaded-file info panel; keep brackets */
		fileInfoLabel: "[ FILE INFO ]",
		/** File info row label followed by a colon in JSX */
		nameLabel: "Name",
		/** File info row label followed by a colon in JSX; value renders as "NN.NN KB" */
		sizeLabel: "Size",
		/** File info row label followed by a colon in JSX; value = MIME type */
		typeLabel: "Type",
		/** Button that runs image → Base64 conversion */
		convertButton: "Convert to Base64",
		/** aria-label on the convert button */
		convertButtonAria: "Convert image to Base64",
		/** alt text for the uploaded-image preview thumbnail */
		uploadPreviewAlt: "Uploaded image preview",
		/** Bracketed micro label above the Base64 result box; keep brackets */
		base64OutputLabel: "[ BASE64 OUTPUT ]",
		/** {what} for common.copiedType toast after copying the Base64 string */
		base64StringType: "Base64 string",
		/** aria-label on the Copy button under the Base64 output */
		copyOutputAria: "Copy Base64 output",
		/** Error shown when FileReader fails */
		readFileError: "Failed to read file",
		/** Error shown when a non-image file is uploaded or dropped */
		notImageError: "Please upload an image file",
		/** Error shown when decoding with an empty textarea */
		emptyInputError: "Please enter a Base64 string",
		/** Error shown when atob() throws; {message} = browser error text */
		invalidBase64Error: "Invalid Base64 string: {message}",
		/** Bracketed micro label above the Base64 textarea; keep brackets */
		base64InputLabel: "[ BASE64 INPUT ]",
		/** Textarea placeholder in the Base64 → Image tab */
		pastePlaceholder: "Paste Base64 string here...",
		/** Button that decodes Base64 into an image */
		decodeButton: "Decode to Image",
		/** aria-label on the decode button */
		decodeButtonAria: "Decode Base64 to image",
		/** alt text for the decoded image preview */
		decodedPreviewAlt: "Decoded image preview",
		/** Button that downloads the decoded image */
		downloadButton: "Download Image",
		/** aria-label on the download button */
		downloadButtonAria: "Download decoded image",
	},
	// ─── chmod Calculator (/converters-parsers/chmod-calculator) ──
	chmodCalculator: {
		/** ToolHeader title; sidebar + homepage card use the same key. "chmod" stays literal (technical token) */
		title: "chmod Calculator",
		/** Bracketed heading above the permission checkbox grid; keep brackets */
		permissionMatrixLabel: "[ PERMISSION MATRIX ]",
		/** Column-row label in the permission matrix (file owner class) */
		owner: "OWNER",
		/** Permission matrix row label (group class) */
		group: "GROUP",
		/** Permission matrix row label (others class) */
		other: "OTHER",
		/** Permission matrix column header; checkbox column for read bit */
		read: "READ",
		/** Permission matrix column header; checkbox column for write bit */
		write: "WRITE",
		/** Permission matrix column header; checkbox column for execute bit */
		execute: "EXECUTE",
		/** Bracketed heading above the result panel; keep brackets */
		resultLabel: "[ RESULT ]",
		/** Micro label above the octal number output */
		octalLabel: "OCTAL",
		/** Micro label above the symbolic (rwx-style) output */
		symbolicLabel: "SYMBOLIC",
		/** Micro label above the generated chmod command line */
		commandLabel: "COMMAND",
		/** Bracketed heading above the octal input field; keep brackets */
		octalInputLabel: "[ OCTAL INPUT ]",
		/** Error shown when the octal input doesn't match /^[0-7]{3,4}$/; keep brackets */
		invalidOctalError: "[ INVALID OCTAL ]",
	},
	// ─── Color Converter (/converters-parsers/color-converter) ──
	colorConverter: {
		/** ToolHeader title; sidebar + homepage card use the same key */
		title: "Color Converter",
		/** Bracketed heading above the hex input and format rows; keep brackets. Format tokens (HEX/RGB/HSL/OKLCH) stay literal and are NOT keys */
		conversionLabel: "[ CONVERSION ]",
		/** aria-label on the native color picker input */
		pickColorAria: "Pick color",
		/** Inline error shown when the hex input is invalid; keep brackets */
		invalidHexError: "[ INVALID HEX ]",
		/** Bracketed heading above the contrast section; keep brackets */
		contrastCheckLabel: "[ CONTRAST CHECK ]",
		/** Label above the foreground color controls */
		foregroundLabel: "FOREGROUND",
		/** Label above the background color controls */
		backgroundLabel: "BACKGROUND",
		/** aria-label on the foreground color picker input */
		foregroundAria: "Foreground color",
		/** aria-label on the background color picker input */
		backgroundAria: "Background color",
		/** Micro label above the numeric contrast ratio */
		contrastRatioLabel: "CONTRAST RATIO",
		/** WCAG check card label; ratio threshold (≥4.5) is appended in JSX */
		aaNormal: "AA NORMAL",
		/** WCAG check card label; ratio threshold (≥3) appended in JSX */
		aaLarge: "AA LARGE",
		/** WCAG check card label; ratio threshold (≥7) appended in JSX */
		aaaNormal: "AAA NORMAL",
		/** WCAG check card label; ratio threshold (≥4.5) appended in JSX */
		aaaLarge: "AAA LARGE",
		/** Badge shown when a WCAG check passes */
		pass: "PASS",
		/** Badge shown when a WCAG check fails */
		fail: "FAIL",
	},
	// ─── CRON Parser (/converters-parsers/cron-parser) ──
	cronParser: {
		/** ToolHeader title; sidebar + homepage card use the same key. CRON stays uppercase (technical token) */
		title: "CRON Parser",
		/** Bracketed micro label above the expression input; keep brackets */
		inputLabel: "[ INPUT ]",
		/** Visible label for the cron expression text field */
		expressionLabel: "EXPRESSION",
		/** Placeholder on the cron input; the "* * * * *" part is an example expression — keep it verbatim */
		examplePlaceholder: "e.g., * * * * *",
		/** Label above the presets dropdown */
		presetsLabel: "PRESETS",
		/** Placeholder on the closed Select trigger */
		selectExamplePlaceholder: "Select an example",
		/** Preset option for "* * * * *" */
		presetEveryMinute: "Every minute",
		/** Preset option for "0 0 * * *" */
		presetDailyMidnight: "Every day at midnight",
		/** Preset option for "0 0 1 * *" */
		presetMonthlyFirstMidnight: "First day of every month at midnight",
		/** Preset option for "0 0 * * 0" */
		presetSundayMidnight: "Every Sunday at midnight",
		/** Bracketed heading above the human-readable description (generated by cronstrue, not from this dictionary); keep brackets */
		humanReadableLabel: "[ HUMAN READABLE ]",
		/** Bracketed heading above the parse-error message; keep brackets. The message body comes from cronstrue */
		errorLabel: "[ ERROR ]",
	},
	// ─── curl to fetch (/converters-parsers/curl-converter) ──
	curlConverter: {
		/** Sidebar, homepage card, and page header title */
		title: "curl to fetch",
		/** Input panel heading; keep brackets */
		curlCommandLabel: "[ CURL COMMAND ]",
		/** Empty state when no curl input provided; keep brackets */
		awaitingInput: "[ AWAITING INPUT ]",
		/** Output panel heading; keep brackets */
		fetchSnippetLabel: "[ FETCH SNIPPET ]",
		/** Toast after successful copy */
		copied: "COPIED",
		/** Toast when copy to clipboard fails */
		copyFailed: "COPY FAILED",
		/** Parsed request summary bar; {method}=HTTP method, {count}=header count, {headers}=translated label, {body}=translated label, {status}=YES/NO */
		requestInfo: "[ {method} / {count} {headers} / {body}: {status} ]",
		/** Label in request info bar */
		headersLabel: "HEADERS",
		/** Label in request info bar */
		bodyLabel: "BODY",
		/** Status in request info bar */
		yes: "YES",
		/** Status in request info bar */
		no: "NO",
	},
	// ─── Data Converter (/converters-parsers/data-converter) ──
	dataConverter: {
		/** Sidebar, homepage card, and page header title */
		title: "Data Converter",
		/** Section heading above the two format panels; keep brackets */
		formatConversionLabel: "[ FORMAT CONVERSION ]",
		/** Source format label above the FROM dropdown */
		fromLabel: "FROM",
		/** Destination format label above the TO dropdown */
		toLabel: "TO",
		/** Textarea placeholder for input data */
		placeholder: "Paste data here...",
		/** Error banner shown when parsing fails; keep brackets */
		parseError: "[ PARSE ERROR ]",
		/** Toast after copying output */
		copied: "COPIED",
	},
	// ─── JSON Parser (/converters-parsers/json-parser) ──
	jsonParser: {
		/** Sidebar, homepage card, and page header title */
		title: "JSON Parser",
		/** Input panel heading; keep brackets */
		inputLabel: "[ INPUT ]",
		/** Textarea placeholder with example JSON */
		placeholder: 'Enter JSON here, e.g., {"name": "Kilo Code", "age": 30}',
		/** Status bar when JSON is valid; keep brackets */
		validJson: "[ VALID JSON ]",
		/** Status bar when JSON is invalid; keep brackets */
		parseError: "[ PARSE ERROR ]",
		/** Output panel heading; keep brackets */
		formattedOutputLabel: "[ FORMATTED OUTPUT ]",
		/** Fallback text when JSON is invalid and no tree is shown */
		invalidJson: "Invalid JSON",
		/** Error boundary heading when the JSON viewer crashes; keep brackets */
		renderError: "[ RENDER ERROR ]",
		/** Expandable details label inside the error boundary */
		errorDetails: "Error Details",
		/** Toast after copying formatted JSON */
		formattedCopied: "Formatted JSON copied to clipboard!",
		/** Toast when copy fails because JSON is invalid */
		copyFailed: "Failed to copy JSON. Please ensure it's valid.",
		/** Button text for the copy-formatted action */
		copyFormatted: "Copy Formatted JSON",
		/** aria-label on the copy-formatted button */
		copyFormattedAria: "Copy formatted JSON to clipboard",
	},
	// ─── JWT Decoder (/converters-parsers/jwt-decoder) ──
	jwtDecoder: {
		/** Sidebar, homepage card, and page header title */
		title: "JWT Decoder",
		/** Label above the token input; keep brackets */
		encodedTokenLabel: "[ ENCODED TOKEN ]",
		/** Textarea placeholder */
		placeholder: "Enter JWT token here",
		/** Error banner when token is malformed; keep brackets */
		malformedToken: "[ MALFORMED JWT TOKEN ]",
		/** Card title for the header segment */
		header: "Header",
		/** Card title for the payload segment */
		payload: "Payload",
		/** Card title for the signature segment */
		signature: "Signature",
		/** aria-label on the header copy button */
		copyHeaderAria: "Copy header",
		/** aria-label on the payload copy button */
		copyPayloadAria: "Copy payload",
		/** aria-label on the signature copy button */
		copySignatureAria: "Copy signature",
		/** Note below the payload card */
		verificationNote: "Note: Signature verification status is not checked by this decoder.",
		/** Error text set in all three cards when JWT has wrong segment count */
		invalidJwtFormat: "Invalid JWT format",
		/** Error text when header segment cannot be decoded */
		invalidHeader: "Invalid Header",
		/** Error text when payload segment cannot be decoded */
		invalidPayload: "Invalid Payload",
		/** Error text when signature segment is empty */
		invalidSignature: "Invalid Signature",
	},
	// ─── Number Base Converter (/converters-parsers/number-base-converter) ──
	numberBaseConverter: {
		/** Sidebar, homepage card, and page header title */
		title: "Number Base Converter",
		/** Input section heading; keep brackets */
		inputLabel: "[ INPUT ]",
		/** Short label for the decimal row */
		decLabel: "DEC",
		/** Short label for the hexadecimal row */
		hexLabel: "HEX",
		/** Short label for the octal row */
		octLabel: "OCT",
		/** Short label for the binary row */
		binLabel: "BIN",
		/** Placeholder for the decimal input */
		decPlaceholder: "Enter decimal number",
		/** Placeholder for the hexadecimal input */
		hexPlaceholder: "Enter hexadecimal number",
		/** Placeholder for the octal input */
		octPlaceholder: "Enter octal number",
		/** Placeholder for the binary input */
		binPlaceholder: "Enter binary number",
		/** aria-label on the decimal copy button */
		copyDecAria: "Copy decimal",
		/** aria-label on the hexadecimal copy button */
		copyHexAria: "Copy hexadecimal",
		/** aria-label on the octal copy button */
		copyOctAria: "Copy octal",
		/** aria-label on the binary copy button */
		copyBinAria: "Copy binary",
		/** Toast when nothing to copy */
		nothingToCopy: "Nothing to copy!",
		/** Toast for unexpected conversion errors */
		unknownError: "An unknown error occurred.",
		/** Validation error for decimal input */
		invalidDecimal: "Invalid decimal input",
		/** Validation error for hexadecimal input */
		invalidHexadecimal: "Invalid hexadecimal input",
		/** Validation error for octal input */
		invalidOctal: "Invalid octal input",
		/** Validation error for binary input */
		invalidBinary: "Invalid binary input",
	},
	// ─── Regex Tester (/converters-parsers/regex-tester) ──
	regexTester: {
		/** Sidebar, homepage card, and page header title */
		title: "Regex Tester",
		/** Placeholder for the regex pattern input */
		patternPlaceholder: "Enter regex pattern",
		/** aria-label for the regex pattern input */
		patternAria: "Regex pattern",
		/** Section heading above flag badges */
		flagsLabel: "FLAGS",
		/** Flag badge label: g flag */
		flagGlobal: "g (global)",
		/** Flag badge label: i flag */
		flagCaseInsensitive: "i (case-insensitive)",
		/** Flag badge label: m flag */
		flagMultiline: "m (multiline)",
		/** Placeholder for the test string textarea */
		testPlaceholder: "Enter string to test against",
		/** aria-label for the test string textarea */
		testAria: "Test string",
		/** Empty-state badge when pattern matches nothing; keep brackets */
		noMatch: "[ NO MATCH ]",
		/** Match count badge; {count} = number of matches; keep brackets */
		matchesCount: "[ {count} MATCHES ]",
		/** Section heading for highlighted output; keep brackets */
		highlightedMatches: "[ HIGHLIGHTED MATCHES ]",
		/** Section heading for the match table; keep brackets */
		matchDetails: "[ MATCH DETAILS ]",
		/** Empty-state message below the match table */
		noMatchesFound: "No matches found.",
		/** Table column header for matched text */
		matchHeader: "Match",
		/** Table column header for match index */
		indexHeader: "Index",
		/** Fallback error when catch block receives non-Error */
		unknownError: "An unknown error occurred",
	},
	// ─── Text Case Converter (/converters-parsers/text-case) ──
	textCase: {
		/** Sidebar, homepage card, and page header title */
		title: "Text Case Converter",
		/** Placeholder for the input textarea */
		inputPlaceholder: "Enter your text here...",
		/** Button label for uppercase conversion */
		uppercaseBtn: "UPPERCASE",
		/** Button label for lowercase conversion */
		lowercaseBtn: "LOWERCASE",
		/** Button label for title case conversion */
		titleCaseBtn: "TITLE CASE",
		/** Button label for camelCase conversion */
		camelCaseBtn: "CAMELCASE",
		/** Button label for snake_case conversion */
		snakeCaseBtn: "SNAKE_CASE",
		/** Button label for kebab-case conversion */
		kebabCaseBtn: "KEBAB-CASE",
		/** Output section heading; keep brackets */
		outputLabel: "[ OUTPUT ]",
		/** Placeholder text when no output yet */
		outputEmpty: "Converted text will appear here...",
	},
	// ─── Timestamp Converter (/converters-parsers/timestamp-converter) ──
	timestampConverter: {
		/** Sidebar, homepage card, and page header title */
		title: "Timestamp Converter",
		/** Section heading for unix→human conversion; keep brackets */
		unixToHumanLabel: "[ UNIX → HUMAN ]",
		/** Label above both expression inputs */
		expressionLabel: "EXPRESSION",
		/** Placeholder for the unix timestamp input; shows example format */
		unixPlaceholder: "e.g., 1678886400 or 1678886400000",
		/** Section heading for human→unix conversion; keep brackets */
		humanToUnixLabel: "[ HUMAN → UNIX ]",
		/** Placeholder for the human-readable date input; shows example format */
		humanPlaceholder: "e.g., 2023-03-15 00:00:00",
		/** Section heading for the date picker; keep brackets */
		datePickerLabel: "[ DATE PICKER ]",
		/** Placeholder text in the date picker button when no date selected */
		pickDate: "Pick a date",
		/** Section heading for the readout results; keep brackets */
		readoutsLabel: "[ READOUTS ]",
		/** Label above the unix timestamp readout */
		unixTimestampLabel: "UNIX TIMESTAMP",
		/** Label above the ISO 8601 readout; ISO 8601 is a technical token, kept literal */
		iso8601Label: "ISO 8601",
		/** aria-label for the copy-unix-timestamp button */
		copyUnixAria: "Copy unix timestamp",
		/** aria-label for the copy-human-readable button */
		copyHumanAria: "Copy human readable",
		/** Error message when unix timestamp input is invalid */
		invalidTimestamp: "Invalid timestamp",
		/** Error message when human-readable date input is invalid; format hint included */
		invalidDateFormat: "Invalid date format (e.g., YYYY-MM-DD HH:mm:ss)",
	},
	// ─── Timezone Converter (/converters-parsers/timezone-converter) ──
	timezoneConverter: {
		/** Sidebar, homepage card, and page header title */
		title: "Timezone Converter",
		/** Section heading above the two-column conversion panel; keep brackets */
		conversionLabel: "[ CONVERSION ]",
		/** Column heading for the source timezone panel; keep brackets */
		sourceLabel: "[ SOURCE ]",
		/** Column heading for the target timezone panel; keep brackets */
		targetLabel: "[ TARGET ]",
		/** Label above the date picker */
		dateLabel: "DATE",
		/** Label above timezone selects */
		timezoneLabel: "TIMEZONE",
		/** Placeholder in the date picker button when no date selected */
		pickDate: "Pick a date",
		/** Placeholder in the timezone combobox search input */
		searchTimezonePlaceholder: "Search timezone...",
		/** Empty state in timezone search results */
		noTimezoneFound: "No timezone found.",
		/** Fallback label in the timezone combobox when nothing selected */
		selectTimezone: "Select timezone...",
		/** Label above the converted time readout */
		convertedTimeLabel: "CONVERTED TIME",
		/** aria-label for the copy-converted-time button */
		copyConvertedAria: "Copy converted time",
		/** Error message shown when conversion fails (bad timezone/date) */
		invalidTimezone: "Invalid Timezone or Date",
	},
	// ─── Unit Converter (/converters-parsers/unit-converter) ──
	unitConverter: {
		/** Sidebar, homepage card, and page header title */
		title: "Unit Converter",
		/** Label above the category select */
		categoryLabel: "CATEGORY",
		/** Placeholder in the category select dropdown */
		selectCategoryPlaceholder: "Select a unit type",
		/** Section heading for the conversion rig; keep brackets */
		conversionRigLabel: "[ CONVERSION RIG ]",
		/** Label above the FROM unit select */
		fromLabel: "FROM",
		/** Label above the TO unit select */
		toLabel: "TO",
		/** Placeholder in the from/to unit select dropdowns */
		selectUnitPlaceholder: "Select unit",
		/** Label above the numeric value input */
		valueLabel: "VALUE",
		/** Placeholder for the numeric value input */
		valuePlaceholder: "Enter value",
		/** Section heading for the result readout; keep brackets */
		resultLabel: "[ RESULT ]",
		/** aria-label for the copy-result button */
		copyResultAria: "Copy converted value",
		/** Error prefix when conversion throws; followed by the library error message */
		errorPrefix: "Error:",
		/** Fallback error when a non-Error is thrown */
		unknownError: "An unknown error occurred during conversion.",
		/** Category display name */
		catLength: "Length",
		catArea: "Area",
		catMass: "Mass",
		catVolume: "Volume",
		catEach: "Each",
		catTemperature: "Temperature",
		catTime: "Time",
		catDigital: "Digital",
		catPartsPer: "Parts Per",
		catSpeed: "Speed",
		catPace: "Pace",
		catPressure: "Pressure",
		catCurrent: "Current",
		catVoltage: "Voltage",
		catPower: "Power",
		catReactivePower: "Reactive Power",
		catApparentPower: "Apparent Power",
		catEnergy: "Energy",
		catReactiveEnergy: "Reactive Energy",
		catVolumeFlowRate: "Volume Flow Rate",
		catIlluminance: "Illuminance",
		catFrequency: "Frequency",
		catAngle: "Angle",
	},
	// ─── URL Encoder/Decoder (/converters-parsers/url-encoder-decoder) ──
	urlEncoderDecoder: {
		/** Sidebar, homepage card, and page header title */
		title: "URL Encoder/Decoder",
		/** Encode tab label */
		encodeTab: "Encode URL",
		/** Decode tab label */
		decodeTab: "Decode URL",
		/** Placeholder in the encode textarea */
		encodePlaceholder: "Enter text to encode...",
		/** Placeholder in the decode textarea */
		decodePlaceholder: "Enter text to decode...",
		/** Section heading for encoded result; keep brackets */
		encodedOutputLabel: "ENCODED OUTPUT",
		/** Section heading for decoded result; keep brackets */
		decodedOutputLabel: "DECODED OUTPUT",
		/** Empty-state text when no encoded output yet */
		encodedOutputEmpty: "Encoded output",
		/** Empty-state text when no decoded output yet */
		decodedOutputEmpty: "Decoded output",
		/** aria-label on the copy button for encoded output */
		copyEncodedAria: "Copy encoded output",
		/** aria-label on the copy button for decoded output */
		copyDecodedAria: "Copy decoded output",
	},
	// ─── URL Parser (/converters-parsers/url-parser) ──
	urlParser: {
		/** Sidebar, homepage card, and page header title */
		title: "URL Parser",
		/** Placeholder in the URL input field */
		placeholder: "Enter URL to parse",
		/** aria-label on the URL input field */
		inputAria: "URL to parse",
		/** Button text to trigger parsing */
		parseButton: "Parse URL",
		/** Fallback error when caught exception is not an Error instance */
		unknownError: "An unknown error occurred.",
		/** Section heading for parsed URL components; keep brackets */
		parsedComponents: "PARSED COMPONENTS",
		/** Field label for the protocol component */
		protocol: "Protocol",
		/** Field label for the hostname component */
		hostname: "Hostname",
		/** Field label for the port component */
		port: "Port",
		/** Field label for the path component */
		path: "Path",
		/** Field label for the fragment component */
		fragment: "Fragment",
		/** aria-label: copy protocol value */
		copyProtocol: "Copy protocol",
		/** aria-label: copy hostname value */
		copyHostname: "Copy hostname",
		/** aria-label: copy port value */
		copyPort: "Copy port",
		/** aria-label: copy path value */
		copyPath: "Copy path",
		/** aria-label: copy fragment value */
		copyFragment: "Copy fragment",
		/** Section heading for query parameter table; keep brackets */
		queryParameters: "QUERY PARAMETERS",
		/** Table column header for parameter keys */
		tableKey: "Key",
		/** Table column header for parameter values */
		tableValue: "Value",
		/** aria-label: copy value for a specific query param; {key} = param name */
		copyValueFor: "Copy value for {key}",
	},
	// ─── Barcode Generator (/generators/barcode-generator) ──
	barcodeGenerator: {
		/** Sidebar, homepage card, and page header title */
		title: "Barcode Generator",
		/** Label above the format selector */
		formatLabel: "FORMAT",
		/** Label above the barcode value input */
		valueLabel: "VALUE",
		/** Slider label for bar width; {width} = current numeric value */
		widthLabel: "WIDTH — {width}",
		/** Slider label for bar height; {height} = current numeric value */
		heightLabel: "HEIGHT — {height}",
		/** Switch label to toggle text below barcode */
		showTextLabel: "SHOW TEXT",
		/** Download button text */
		downloadSvg: "DOWNLOAD SVG",
	},
	// ─── Gradient Generator (/generators/gradient) ──
	gradient: {
		/** Sidebar, homepage card, and page header title */
		title: "Gradient Generator",
		/** Label above the type toggle (linear/radial) */
		typeLabel: "TYPE",
		/** Linear gradient type option */
		linear: "LINEAR",
		/** Radial gradient type option */
		radial: "RADIAL",
		/** Angle slider label for linear gradients; {angle} = current degree value */
		angleLabel: "ANGLE — {angle}DEG",
		/** Position label for radial gradients; {x} and {y} = percentage values */
		positionLabel: "POSITION — X: {x}% / Y: {y}%",
		/** Section heading for color stops; keep brackets */
		colorStops: "COLOR STOPS",
		/** aria-label: remove a specific color stop; {id} = stop index */
		removeStopAria: "Remove stop {id}",
		/** Button text to add a new color stop */
		addStop: "Add Stop",
		/** Section heading for the preview area; keep brackets */
		preview: "PREVIEW",
		/** Section heading for the CSS output; keep brackets */
		cssOutput: "CSS OUTPUT",
		/** Toast title shown after copying CSS to clipboard */
		copied: "COPIED",
		/** aria-label on the copy CSS button */
		copyCssAria: "Copy CSS",
	},
	// ─── Hash Generator (/generators/hash) ──
	hash: {
		/** Sidebar, homepage card, and page header title */
		title: "Hash Generator",
		/** Input section heading; keep brackets */
		inputLabel: "Input",
		/** Placeholder in the input textarea */
		inputPlaceholder: "Enter text here...",
		/** Algorithm section heading; keep brackets */
		algorithmLabel: "Algorithm",
		/** Placeholder in the algorithm selector */
		selectAlgorithm: "Select an algorithm",
		/** Digest result section heading; keep brackets */
		digestLabel: "Digest",
	},
	// ─── HMAC Generator (/generators/hmac-generator) ──
	hmacGenerator: {
		/** Sidebar, homepage card, and page header title */
		title: "HMAC Generator",
		/** Input panel heading; keep brackets */
		messageLabel: "[ MESSAGE ]",
		/** Textarea placeholder for the message to sign */
		messagePlaceholder: "Enter message to sign...",
		/** Secret key field label */
		secretLabel: "SECRET",
		/** Toggle label to show/hide the secret key */
		showLabel: "SHOW",
		/** Input placeholder for the secret key */
		secretPlaceholder: "Enter secret key...",
		/** Algorithm selector label */
		algorithmLabel: "ALGORITHM",
		/** Output section heading; keep brackets */
		outputLabel: "[ Output ]",
		/** Empty state shown before both inputs are filled; keep brackets */
		awaitingInput: "[ AWAITING INPUT ]",
		/** Hex output sub-heading; keep brackets */
		hexLabel: "[ HEX ]",
		/** Button to copy hex output */
		copyHex: "COPY HEX",
		/** Base64 output sub-heading; keep brackets */
		base64Label: "[ BASE64 ]",
		/** Button to copy base64 output */
		copyBase64: "COPY BASE64",
	},
	// ─── ID Generator (/generators/id-generator) ──
	idGenerator: {
		/** Sidebar, homepage card, and page header title */
		title: "ID Generator",
		/** Uppercase toggle label for UUID V4, V7, and ULID tabs */
		uppercaseLabel: "UPPERCASE",
		/** Hyphens toggle label for UUID V4 and V7 tabs */
		hyphensLabel: "HYPHENS",
		/** Size input label for the nanoid tab */
		sizeLabel: "SIZE",
		/** Number of IDs to generate */
		countLabel: "Count",
		/** Button to generate IDs */
		generateButton: "GENERATE",
		/** Button to copy all generated IDs */
		copyAll: "COPY ALL",
		/** Output section heading; keep brackets */
		outputLabel: "[ Output ]",
	},
	// ─── Lorem Generator (/generators/lorem-generator) ──
	loremGenerator: {
		/** Sidebar, homepage card, and page header title */
		title: "Lorem Generator",
		/** Character sets section heading; keep brackets */
		characterSetsLabel: "[ CHARACTER SETS ]",
		/** Checkbox label for alphabetic words */
		alphabeticalLabel: "ALPHABETICAL",
		/** Checkbox label for Korean (Hangul) words */
		koreanLabel: "KOREAN",
		/** Checkbox label for numeric words */
		numericalLabel: "NUMERICAL",
		/** Error shown when no character set is selected; keep brackets */
		selectAtLeastOne: "[ SELECT AT LEAST ONE SET ]",
		/** Structure section heading; keep brackets */
		structureLabel: "[ STRUCTURE ]",
		/** Label for words-per-sentence input */
		wordsPerSentence: "WORDS / SENTENCE",
		/** Label for sentences-per-paragraph input */
		sentencesPerParagraph: "SENTENCES / PARAGRAPH",
		/** Label for paragraph count input */
		paragraphsLabel: "PARAGRAPHS",
		/** Main generate button text */
		generateButton: "GENERATE",
		/** Output section heading; keep brackets */
		outputLabel: "[ OUTPUT ]",
		/** Stats strip showing counts; {paragraphs}, {sentences}, {words} are numbers */
		statsFormat: "[ {paragraphs} P / {sentences} S / {words} W ]",
		/** Button to regenerate output */
		regenerateButton: "REGENERATE",
	},
	// ─── Password Generator (/generators/password) ──
	password: {
		/** Sidebar, homepage card, and page header title */
		title: "Password Generator",
		/** Slider label showing current length; {length} is the numeric value */
		lengthLabel: "Length: {length}",
		/** Character sets section heading; keep brackets */
		characterSetsLabel: "[ Character Sets ]",
		/** Checkbox label for uppercase letters */
		uppercaseLabel: "Uppercase (A-Z)",
		/** Checkbox label for lowercase letters */
		lowercaseLabel: "Lowercase (a-z)",
		/** Checkbox label for digits */
		numbersLabel: "Numbers (0-9)",
		/** Checkbox label for special characters */
		symbolsLabel: "Symbols (!@#$)",
		/** Generated password output section heading; keep brackets */
		generatedPasswordLabel: "[ Generated Password ]",
		/** Strength meter section heading; keep brackets */
		strengthLabel: "[ Strength ]",
		/** Strength level: 0–29 */
		veryWeak: "Very Weak",
		/** Strength level: 30–59 */
		weak: "Weak",
		/** Strength level: 60–79 */
		good: "Good",
		/** Strength level: 80–100 */
		strong: "Strong",
		/** Button to generate a new password */
		generateButton: "Generate New Password",
		/** Button that sets length to 12 */
		sampleButton: "Sample",
		/** Toast shown after copying password */
		copiedToast: "Password copied to clipboard!",
		/** Error shown in output when no character set is selected */
		noCharSetError: "Select at least one character type.",
		/** aria-label on the copy button */
		copyAriaLabel: "Copy password",
		/** aria-label on the clear button */
		clearAriaLabel: "Clear password output",
	},
	// ─── Port Number Generator (/generators/port) ──
	port: {
		/** Sidebar, homepage card, and page header title */
		title: "Port Number Generator",
		/** Label for the number-of-ports input */
		countLabel: "Count",
		/** Label for the minimum port input */
		minPortLabel: "Min Port",
		/** Label for the maximum port input */
		maxPortLabel: "Max Port",
		/** Toggle label to exclude well-known ports; keep range notation */
		avoidReservedLabel: "Avoid Reserved (0–1023)",
		/** Button to generate ports */
		generateButton: "Generate",
		/** Generated ports output section heading; keep brackets */
		generatedPortsLabel: "[ Generated Ports ]",
		/** aria-label on the copy button */
		copyAriaLabel: "Copy generated ports",
		/** Note shown below output when reserved ports are excluded */
		reservedNote: "Reserved ports (0–1023) excluded from generation range.",
	},
	// ─── QR Code Generator (/generators/qr-code) ──
	qrCode: {
		/** Sidebar, homepage card, and page header title */
		title: "QR Code Generator",
		/** Micro label above the encode section; keep brackets */
		encodeLabel: "[ ENCODE ]",
		/** Label for the text input that gets encoded into a QR */
		contentLabel: "Content",
		/** Placeholder for the content input */
		contentPlaceholder: "Enter text or URL",
		/** Primary action button */
		generate: "Generate",
		/** Button that copies the input text (not the QR image) */
		copyText: "Copy Text",
		/** Micro label above the rendered QR preview; keep brackets */
		outputLabel: "[ OUTPUT ]",
		/** Empty state shown before any QR is generated */
		emptyOutput: "No QR yet. Generate one.",
		/** Micro label above the decode/upload section; keep brackets */
		decodeLabel: "[ DECODE ]",
		/** Label above the image upload dropzone */
		uploadLabel: "Upload Image",
		/** Hint inside the dashed upload dropzone */
		uploadHint: "Click to upload QR image",
		/** Micro label above the decoded text result; keep brackets */
		decodedLabel: "[ DECODED ]",
		/** Error message when decoding finds no QR; also used as an internal sentinel value compared against decodedText — keep exact punctuation */
		noQrCodeFound: "No QR code found.",
		/** Toast when QR generation throws */
		errorGenerate: "Error generating QR code: Please try again.",
		/** Toast after download; {format} = "PNG" or "SVG" (uppercase) */
		downloaded: "QR code downloaded as {format}",
		/** Toast after copying the input text */
		textCopied: "Text copied to clipboard",
		/** Toast when copying the input text fails */
		copyFailed: "Failed to copy text: Please try again.",
		/** Toast when an uploaded image decodes successfully */
		decodeSuccess: "QR code decoded successfully",
		/** Toast when an uploaded image contains no readable QR */
		notFoundToast: "No QR code found: Please try another image.",
		/** Toast after copying the decoded text */
		decodedCopied: "Decoded text copied to clipboard",
		/** Toast when copying the decoded text fails */
		decodedCopyFailed: "Failed to copy decoded text: Please try again.",
		/** Button copying the text read from an uploaded QR image */
		copyDecoded: "Copy Decoded",
	},
	// ─── SVG Placeholder Generator (/generators/svg-placeholder-generator) ──
	svgPlaceholderGenerator: {
		/** Sidebar, homepage card, and page header title */
		title: "SVG Placeholder Generator",
		/** Slider label; {width} = current width in px */
		widthLabel: "WIDTH — {width}px",
		/** Slider label; {height} = current height in px */
		heightLabel: "HEIGHT — {height}px",
		/** Label for the background color select */
		bgColorLabel: "BG COLOR",
		/** Toggle label controlling whether dimensions render inside the SVG */
		showDimensionsLabel: "SHOW DIMENSIONS",
		/** Output tab showing the rendered SVG preview */
		previewTab: "PREVIEW",
		/** Output tab showing the raw SVG source */
		codeTab: "SVG CODE",
		/** Button copying the SVG markup */
		copySvg: "COPY SVG",
		/** Button copying a base64 data:image/svg+xml URI */
		copyDataUri: "COPY DATA URI",
		/** Button downloading the .svg file */
		download: "DOWNLOAD",
		/** Short toast after any copy succeeds */
		copied: "COPIED",
	},
	// ─── TOTP Generator (/generators/totp-generator) ──
	totpGenerator: {
		/** Sidebar, homepage card, and page header title */
		title: "TOTP Generator",
		/** Micro label above the secret/URI textarea; keep brackets, keep "otpauth" latin */
		secretLabel: "[ SECRET / otpauth URI ]",
		/** Select label for code length (6/8); shown only in raw-secret mode */
		digitsLabel: "DIGITS",
		/** Select label for rotation interval in seconds (15/30/60); shown only in raw-secret mode */
		periodLabel: "PERIOD",
		/** Inline error shown in brackets when the pasted URI is valid otpauth but not TOTP */
		errorNotTotpUri: "NOT A TOTP URI",
		/** Inline error shown in brackets when URI parsing fails */
		errorInvalidUri: "INVALID URI",
		/** Inline error shown in brackets when the secret is not valid Base32 */
		errorInvalidBase32: "INVALID BASE32",
		/** Micro label above the live 6/8-digit code; keep brackets */
		currentLabel: "[ CURRENT CODE ]",
		/** Micro label above the upcoming code; keep brackets */
		nextLabel: "[ NEXT ]",
		/** Countdown under the progress bar; {seconds} = seconds remaining */
		remainingLabel: "T-{seconds}s",
		/** Micro label above the parsed otpauth URI metadata table; keep brackets */
		metadataLabel: "[ URI METADATA ]",
		/** Metadata row: issuer from the URI */
		metaIssuer: "ISSUER",
		/** Metadata row: account/label from the URI */
		metaAccount: "ACCOUNT",
		/** Metadata row: hash algorithm (SHA-1 etc.) */
		metaAlgorithm: "ALGORITHM",
		/** Metadata row: digits parsed from the URI */
		metaDigits: "DIGITS",
		/** Metadata row: period in seconds parsed from the URI */
		metaPeriod: "PERIOD",
		/** Short toast after copying the current code */
		copied: "COPIED",
	},
	// ─── UUID Generator (/generators/uuid) ──
	uuid: {
		/** Sidebar, homepage card, and page header title */
		title: "UUID Generator",
		/** Label for the count input (how many UUIDs to generate) */
		countLabel: "Count",
		/** Primary action button */
		generate: "Generate",
		/** Copy button resting state — keep short */
		copy: "Copy",
		/** aria-label on the copy button */
		ariaCopyGenerated: "Copy generated UUIDs",
		/** Micro label above the generated UUID list; keep brackets */
		outputLabel: "[ Output ]",
	},
	// ─── API Directory (/viewers-miscellaneous/api-directory) ──
	apiDirectory: {
		/** Sidebar, homepage card, and page header title */
		title: "API Directory",
		/** Label above the filter input */
		searchLabel: "Search",
		/** Placeholder for the filter input */
		searchPlaceholder: "Filter by name or description...",
		/** Table header column listing API names/descriptions */
		nameHeader: "Name",
		/** Table header column for auth requirement; cell values ("No", "API Key", "OAuth") render verbatim from JSON — do not translate those */
		authHeader: "Auth",
		/** Table header column for documentation/base URLs */
		endpointHeader: "Endpoint",
		/** Empty state when the filter matches nothing; keep brackets */
		noMatch: "[ NO MATCH ]",
		items: {
			publicApis: {
				/** Table row name for api.publicapis.org entry */
				name: "Public APIs",
				/** Table row description shown under the name */
				description: "A collective list of free APIs for use in software and web development.",
			},
			openWeatherMap: {
				/** Table row name for OpenWeatherMap entry; keep brand spelling */
				name: "OpenWeatherMap",
				/** Table row description shown under the name */
				description: "Weather data APIs.",
			},
			github: {
				/** Table row name for GitHub REST docs entry */
				name: "GitHub API",
				/** Table row description shown under the name */
				description: "Access GitHub data.",
			},
			nasa: {
				/** Table row name for api.nasa.gov entry */
				name: "NASA APIs",
				/** Table row description shown under the name */
				description: "APIs for NASA's data, including Astronomy Picture of the Day.",
			},
			randomUser: {
				/** Table row name for randomuser.me entry */
				name: "Random User Generator",
				/** Table row description shown under the name */
				description: "Generate random user data.",
			},
		},
	},
	// ─── Diff Viewer (/viewers-miscellaneous/diff-viewer) ──
	diffViewer: {
		/** Page header and sidebar title */
		title: "Diff Viewer",
		/** Left textarea label */
		sourceLabel: "Source",
		/** Left textarea placeholder */
		sourcePlaceholder: "Paste source text...",
		/** Right textarea label */
		targetLabel: "Target",
		/** Right textarea placeholder */
		targetPlaceholder: "Paste target text...",
		/** Options row heading */
		optionsLabel: "Options",
		/** Switch label — case-insensitive comparison */
		ignoreCase: "Ignore Case",
		/** Switch label — trim leading/trailing whitespace per line */
		trimWhitespace: "Trim Whitespace",
		/** Shown when source and target are identical */
		identical: "[ IDENTICAL ]",
	},
	// ─── HTTP Status Codes (/viewers-miscellaneous/http-status-codes) ──
	httpStatusCodes: {
		/** Page header and sidebar title */
		title: "HTTP Status Codes",
		/** Search input placeholder */
		filterPlaceholder: "FILTER CODES",
		/** Category heading for 1xx codes */
		class1xx: "1XX INFORMATIONAL",
		/** Category heading for 2xx codes */
		class2xx: "2XX SUCCESS",
		/** Category heading for 3xx codes */
		class3xx: "3XX REDIRECTION",
		/** Category heading for 4xx codes */
		class4xx: "4XX CLIENT ERROR",
		/** Category heading for 5xx codes */
		class5xx: "5XX SERVER ERROR",
		/** Table column header — numeric code */
		headerCode: "Code",
		/** Table column header — short reason phrase */
		headerName: "Name",
		/** Table column header — longer explanation */
		headerDescription: "Description",
		/** Shown when search yields no results; keep brackets */
		noMatch: "[ NO MATCH ]",
	},
	// ─── Image Metadata Viewer (/viewers-miscellaneous/image-metadata-viewer) ──
	imageMetadataViewer: {
		/** Page header and sidebar title */
		title: "Image Metadata Viewer",
		/** Dropzone section heading; keep brackets */
		uploadLabel: "[ UPLOAD ]",
		/** Dropzone text when file is being dragged over */
		dropHere: "Drop the image here ...",
		/** Dropzone text in idle state */
		dropOrClick: "Drag 'n' drop an image here, or click to select",
		/** Error shown when image has no EXIF data */
		noExif: "No EXIF data found in this image.",
		/** Error shown when uploaded file is not an image */
		invalidFile: "Please upload a valid image file.",
		/** Section heading above the EXIF table; keep brackets */
		exifDataLabel: "[ EXIF DATA ]",
		/** EXIF table column header — tag key */
		headerTag: "Tag",
		/** EXIF table column header — tag value */
		headerValue: "Value",
	/** Alt text for the uploaded image preview */
	imageAlt: "Uploaded",
		/** Hint text when no image is uploaded yet */
		emptyHint: "Upload an image to view its metadata.",
	},
	// ─── Token Counter (/viewers-miscellaneous/token-counter) ──
	tokenCounter: {
		/** Page header and sidebar title */
		title: "Token Counter",
		/** Model selector label */
		modelLabel: "Model",
		/** Textarea label */
		inputLabel: "Input",
		/** Textarea placeholder */
		inputPlaceholder: "Paste text...",
		/** Stat card label — token count */
		tokensLabel: "Tokens",
		/** Stat card label — character count */
		charsLabel: "Chars",
		/** Stat card label — word count */
		wordsLabel: "Words",
		/** Stat card label — characters per token ratio */
		charsPerTokenLabel: "Chars / Token",
		/** Footer note; {model} = e.g. "gpt-4o", {encoding} = e.g. "o200k_base" */
		estimateNote: "[ Counts are local estimates — {model} / {encoding} ]",
	},
	// ─── Unicode Inspector (/viewers-miscellaneous/unicode-inspector) ──
	unicodeInspector: {
		/** Page header and sidebar title */
		title: "Unicode Inspector",
		/** Textarea label */
		inputLabel: "Input",
		/** Shown when input is empty; keep brackets */
		awaitingInput: "[ AWAITING INPUT ]",
		/** Section heading above the character table; keep brackets */
		breakdownLabel: "[ Character Breakdown ]",
		/** Table column header — the character itself */
		headerChar: "Char",
		/** Table column header — Unicode code point (U+XXXX) */
		headerCode: "U+Code",
		/** Table column header — decimal value */
		headerDec: "Dec",
		/** Table column header — UTF-8 byte sequence */
		headerUtf8: "UTF-8 Bytes",
		/** Table column header — JavaScript escape sequence */
		headerJsEscape: "JS Escape",
		/** Table column header — HTML entity */
		headerHtml: "HTML",
		/** Section heading above transform buttons; keep brackets */
		transformLabel: "[ Transform ]",
		/** Button — escape all characters to \uXXXX */
		escapeAll: "Escape All",
		/** Button — unescape \uXXXX sequences */
		unescape: "Unescape",
		/** Output section label */
		outputLabel: "Output",
		},
	// ─── Discord Timestamp (/discord/timestamp) ──
	discordTimestamp: {
		/** ToolHeader title; sidebar + homepage card use the same key */
		title: "Discord Timestamp",
		/** Placeholder text inside the natural-language input */
		naturalPlaceholder: "in 2 hours · tomorrow 9am · next friday",
		/** Note below timezone select explaining output renders per-reader */
		timezoneNote: "The timestamp tag renders in every reader's local timezone.",
		/** Label prefix for the relative-distance badge, followed by the offset value */
		targetLabel: "TARGET: {offset}",
		/** Hazard error shown when natural-language input cannot be parsed */
		parseError: "COULD NOT PARSE",
		/** Hazard error shown when unix input is NaN or negative */
		invalidUnix: "INVALID UNIX TIMESTAMP",
		/** {what} param for common.copiedType toast when copying a timestamp tag */
		copiedTag: "timestamp tag",
		/** Quick chip: set date to now */
		chipNow: "NOW",
		/** Quick chip: add 1 hour */
		chipPlus1h: "+1H",
		/** Quick chip: add 1 day */
		chipPlus1d: "+1D",
		/** Quick chip: set to tomorrow 9:00 */
		chipTomorrow9: "TOMORROW 9:00",
		/** Table column header: style letter */
		colStyle: "STYLE",
		/** Table column header: syntax output */
		colSyntax: "SYNTAX",
		/** Table column header: rendered preview */
		colPreview: "RENDERED PREVIEW",
		/** Display name for style 't' — short time e.g. 16:20 */
		styleShortTime: "Short Time",
		/** Display name for style 'T' — long time e.g. 16:20:30 */
		styleLongTime: "Long Time",
		/** Display name for style 'd' — short date e.g. 20/01/2024 */
		styleShortDate: "Short Date",
		/** Display name for style 'D' — long date e.g. 20 January 2024 */
		styleLongDate: "Long Date",
		/** Display name for style 'f' — short date+time e.g. 20 January 2024 16:20 */
		styleShortDateTime: "Short Date/Time",
		/** Display name for style 'F' — full date+time e.g. Saturday, 20 January 2024 16:20 */
		styleFull: "Full",
		/** Display name for style 'R' — relative e.g. in 2 hours */
		styleRelative: "Relative",
		/** sr-only aria-label on the per-row copy button */
		copyRowAria: "Copy {style} syntax",
	},
	// ─── Snowflake Decoder (/discord/snowflake) ──
	discordSnowflake: {
		/** ToolHeader title; sidebar + homepage card use the same key */
		title: "Snowflake Decoder",
		/** First tab trigger */
		decodeTab: "DECODE",
		/** Second tab trigger */
		buildTab: "BUILD",
		/** Third tab trigger */
		bulkTab: "BULK",
		/** Placeholder in the Decode tab's snowflake ID input */
		decodePlaceholder: "Enter a snowflake ID...",
		/** Hazard error when input fails isValidSnowflake */
		invalidSnowflake: "INVALID SNOWFLAKE",
		/** Hazard text in bulk table for an invalid row */
		invalidRow: "INVALID",
		/** Label for the computed snowflake output on the Build tab */
		computedIdLabel: "SNOWFLAKE ID",
		/** Button label to copy the computed snowflake ID */
		copyId: "COPY",
		/** Button label to generate a random snowflake */
		randomButton: "RANDOM",
		/** {what} param for common.copiedType toast when copying a snowflake ID */
		copiedId: "snowflake ID",
		/** {what} param for common.copiedType toast when copying bulk JSON */
		copiedJson: "JSON results",
		/** Button label to copy bulk results as JSON */
		copyAsJson: "COPY AS JSON",
		/** Placeholder in the Bulk tab's textarea */
		bulkPlaceholder: "Paste snowflake IDs, one per line or comma-separated...",
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
		title: "Permissions Calculator",
		/** Placeholder in the bitfield input */
		bitfieldPlaceholder: "Decimal or 0x hex...",
		/** Preset option: Administrator */
		presetAdministrator: "Administrator",
		/** Preset option: Basic Member */
		presetBasicMember: "Basic Member",
		/** Preset option: Moderator */
		presetModerator: "Moderator",
		/** Preset option: Read Only */
		presetReadOnly: "Read Only",
		/** {what} param for common.copiedType toast when copying bitfield */
		copiedBitfield: "bitfield",
		/** Label for the output readout section */
		outputLabel: "OUTPUT",
		/** Label for the decimal value in the output readout */
		decimalLabel: "DEC",
		/** Label for the hex value in the output readout */
		hexLabel: "HEX",
		/** Banner shown when Administrator bit is set */
		adminBanner: "ADMINISTRATOR IMPLIES ALL PERMISSIONS",
		/** Hazard row for unknown bits; {hex} is the hex string of unknown bits */
		unknownBits: "UNKNOWN BITS: {hex}",
		/** Placeholder in the search/filter input */
		searchPlaceholder: "Filter permissions...",
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
		footerHint: "Build an invite URL with permissions → Invite URL Builder",
		/** sr-only aria-label on a copy button */
		copyAria: "Copy {value}",
	},
	// ─── Intents Calculator (/discord/intents) ──
	discordIntents: {
		/** ToolHeader title; sidebar + homepage card use the same key */
		title: "Intents Calculator",
		/** Placeholder in the bitfield input */
		bitfieldPlaceholder: "Decimal or 0x hex...",
		/** {what} param for common.copiedType toast when copying bitfield */
		copiedBitfield: "bitfield",
		/** {what} param for common.copiedType toast when copying code snippet */
		copiedSnippet: "code snippet",
		/** Label for the output readout section */
		outputLabel: "OUTPUT",
		/** Label for the decimal value in the output readout */
		decimalLabel: "DEC",
		/** Label for the hex value in the output readout */
		hexLabel: "HEX",
		/** Badge text shown next to privileged intents */
		privilegedBadge: "PRIVILEGED — ENABLE IN DEV PORTAL",
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
		title: "Embed Builder",
		/** sr-only description of the tab group */
		srTabsDescription: "Embed preview, JSON output, and import",
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
		removeFieldAria: "Remove field",
		/** sr-only aria-label on the move-field-up button */
		moveFieldUpAria: "Move field up",
		/** sr-only aria-label on the move-field-down button */
		moveFieldDownAria: "Move field down",
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
		tooManyFields: "{count} fields (max 25)",
		/** Validation message for total embed budget; {current}/{max} */
		totalBudget: "Total: {current}/{max}",
		/** Label for the IMPORT button on the Import tab */
		importButton: "IMPORT",
		/** Placeholder in the import textarea */
		importPlaceholder: "Paste embed JSON here...",
		/** Muted text shown when the preview has no content */
		emptyPreview: "Fill in fields to see a preview",
		/** Footer link text pointing to the webhook sender */
		footerSendIt: "SEND IT → WEBHOOK SENDER",
		/** {what} for common.copiedType toast after copying JSON */
		jsonOutput: "Embed JSON",
	},
	// ─── Invite URL Builder (/discord/invite) ──
	discordInvite: {
		/** ToolHeader title; sidebar + homepage card use the same key */
		title: "Invite URL Builder",
		/** sr-only description of the tab group */
		srTabsDescription: "Build or parse Discord OAuth2 invite URLs",
		/** First tab trigger */
		buildTab: "BUILD",
		/** Second tab trigger */
		parseTab: "PARSE",
		/** Label for the CLIENT ID input */
		clientIdLabel: "CLIENT ID",
		/** Muted hint when client ID is a valid snowflake; {date} is formatted creation date */
		snowflakeCreated: "CREATED {date}",
		/** Hazard warning when client ID is not a valid snowflake */
		invalidSnowflake: "Invalid snowflake ID",
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
		parsePlaceholder: "Paste a Discord OAuth2 authorize URL here...",
		/** Heading for unknown query params found during parse */
		unknownParamsLabel: "UNKNOWN PARAMS",
		/** {what} for common.copiedType toast after copying URL */
		inviteUrl: "Invite URL",
	},
	// ─── Webhook Sender (/discord/webhook) ──
	discordWebhook: {
		/** ToolHeader title; sidebar + homepage card use the same key */
		title: "Webhook Sender",
		/** Label for the webhook URL input */
		urlLabel: "WEBHOOK URL",
		/** Hazard error when webhook URL does not match the expected pattern */
		invalidWebhookUrl: "Invalid webhook URL format",
		/** Explicit notice that the URL is not stored; rendered as mono uppercase */
		urlNotice: "URL STAYS IN THIS TAB — NOTHING IS STORED",
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
		embedsInvalidJson: "Invalid JSON",
		/** Validation error: parsed JSON is not an array */
		embedsNotArray: "Embeds must be a JSON array",
		/** Validation error: too many embeds; {count} is the actual number */
		embedsTooMany: "{count} embeds (max 10)",
		/** Label for the SEND button */
		sendButton: "SEND",
		/** AlertDialog title before sending */
		confirmTitle: "Send to Webhook",
		/** AlertDialog description before sending */
		confirmDescription: "This will send a message to the webhook URL above. Continue?",
		/** AlertDialog cancel button next to the send confirmation */
		cancelButton: "Cancel",
		/** Sonner success toast after 204 response */
		sent: "SENT",
		/** Error row when rate-limited; {seconds} is retry_after from Discord */
		rateLimited: "RATE LIMITED — retry after {seconds}s",
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
		title: "Mention Builder",
		/** sr-only description of the tab group */
		srTabsDescription: "Build or extract Discord mention strings",
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
		typeTimestamp: "Timestamp",
		/** Label for the ID input */
		idLabel: "ID",
		/** Label for the NAME input (visible for slash + emoji) */
		nameLabel: "NAME",
		/** Label for the ANIMATED switch (visible for emoji) */
		animatedLabel: "ANIMATED",
		/** Label for the COPY button on the Build tab */
		copyButton: "COPY",
		/** Placeholder in the extract textarea */
		extractPlaceholder: "Paste text containing mentions here...",
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
		copyIdAria: "Copy ID",
		/** Inline link text per row linking to snowflake decoder */
		decodeLink: "DECODE →",
		/** Muted text shown when no mentions are found in the extract textarea */
		noMentionsFound: "NO MENTIONS FOUND",
		/** {what} for common.copiedType toast after copying mention string */
		mentionString: "Mention string",
		/** {what} for common.copiedType toast after copying an ID */
		mentionId: "Mention ID",
	},
	// ─── CDN Link Builder (/discord/cdn) ──
	discordCdn: {
		/** ToolHeader title; sidebar + homepage card use the same key */
		title: "CDN Link Builder",
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
		emojiInputPlaceholder: "<:name:id> or emoji ID",
		/** Label above the NAME input (editable fallback when plain ID given) */
		emojiNameLabel: "Name",
		/** Label above the FORMAT select (emoji tab) */
		formatLabel: "Format",
		/** Label above the SIZE select */
		sizeLabel: "Size",
		/** Error shown when emoji input is not a valid mention or numeric ID */
		emojiParseError: "Enter a valid emoji mention (<:name:id>) or numeric ID",
		/** Label above USER ID input (avatar, banner, default avatar tabs) */
		userIdLabel: "User ID",
		/** Label above AVATAR HASH input */
		avatarHashLabel: "Avatar Hash",
		/** Error shown when user ID is empty */
		userIdRequired: "User ID is required",
		/** Error shown when hash is empty */
		hashRequired: "Hash is required",
		/** Generic error for invalid input producing empty URL */
		invalidInput: "Invalid input",
		/** Note below default avatar output warning it changes */
		defaultAvatarNote: "CHANGES WHEN USER CHANGES AVATAR",
		/** Label above GUILD ID input */
		guildIdLabel: "Guild ID",
		/** Label above HASH input (banner, guild icon tabs) */
		hashLabel: "Hash",
		/** Label above STICKER ID input */
		stickerIdLabel: "Sticker ID",
		/** aria-label on the COPY button */
		copyAria: "Copy CDN URL",
		/** aria-label on the OPEN link */
		openAria: "Open CDN URL in new tab",
		/** Hint label above the chat-usable markdown badge (emoji tab) */
		chatMarkdownHint: "Use in chat",
	},
	// ─── Message Link Parser (/discord/message-link) ──
	discordMessageLink: {
		/** ToolHeader title; sidebar + homepage card use the same key */
		title: "Message Link Parser",
		/** PARSE tab trigger label */
		tabParse: "Parse",
		/** BUILD tab trigger label */
		tabBuild: "Build",
		/** Placeholder in the parse input */
		parsePlaceholder: "Paste a Discord message or invite URL...",
		/** Error shown when input matches neither message nor invite pattern */
		parseError: "Not a valid Discord message or invite URL",
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
		buildGuildPlaceholder: "Optional — defaults to @me",
		/** Label above CHANNEL ID input in build tab */
		buildChannelLabel: "Channel ID",
		/** Label above MESSAGE ID input in build tab */
		buildMessageLabel: "Message ID",
		/** Error when channel ID is empty in build tab */
		channelIdRequired: "Channel ID is required",
		/** Error when message ID is non-numeric in build tab */
		messageIdNumeric: "Message ID must be numeric",
		/** aria-label on COPY button in parse results */
		copyAria: "Copy value",
		/** aria-label on OPEN link */
		openAria: "Open link in new tab",
	},
	// ─── Discord Markdown (/discord/markdown) ──
	discordMarkdown: {
		/** ToolHeader title; sidebar + homepage card use the same key */
		title: "Discord Markdown",
		/** PREVIEW tab trigger label */
		tabPreview: "Preview",
		/** ESCAPED tab trigger label */
		tabEscaped: "Escaped",
		/** Placeholder text in the editor textarea */
		editorPlaceholder: "Type Discord markdown here...",
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
		copyEscapedAria: "Copy escaped text",
		/** Hint text shown at the bottom of the editor zone */
		syntaxHint: "Supports bold, italic, underline, strikethrough, spoiler, inline code, code blocks, headings, block quotes, lists, and links",
	},
	// ─── ANSI Colors (/discord/ansi) ──
	discordAnsi: {
		/** ToolHeader title; sidebar + homepage card use the same key */
		title: "ANSI Colors",
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
		removeSegmentAria: "Remove segment",
		/** Label on the ADD SEGMENT button */
		addSegmentButton: "Add Segment",
		/** aria-label on the COPY button in the output panel */
		copyOutputAria: "Copy ANSI block",
		/** Placeholder in the parse textarea */
		parsePlaceholder: "Paste an ANSI code block here...",
		/** Label on the parse button */
		parseButton: "Parse",
		/** Error shown when parsed ANSI content yields no segments */
		parseError: "No ANSI sequences found in the input",
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
		title: "Message Splitter",
		/** Bracketed micro label above the input textarea; keep brackets */
		inputLabel: "[ INPUT ]",
		/** Textarea placeholder */
		inputPlaceholder: "Paste the long message to split...",
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
		numberPartsAria: "Prefix each part with its position n/N",
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
		emptyHint: "Parts will appear here once you paste text...",
	},
	// ─── Character Counter (/discord/char-counter) ──
	discordCharCounter: {
		/** ToolHeader title; sidebar + homepage card use the same key */
		title: "Character Counter",
		/** Bracketed micro label above the input textarea; keep brackets */
		inputLabel: "[ INPUT ]",
		/** Textarea placeholder */
		inputPlaceholder: "Type or paste text to measure...",
		/** Summary chip showing the Unicode code-point count; {n} = count */
		codePointsChip: "CODE POINTS {n}",
		/** Summary chip showing the UTF-16 code-unit count; {n} = count */
		utf16Chip: "UTF-16 UNITS {n}",
		/** title tooltip on the UTF-16 chip explaining the divergence */
		unitsTitle: "Astral characters (most emoji, styled letters) cost 2 UTF-16 units but 1 code point. Discord counts roughly per UTF-16 unit.",
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
		meterAria: "{name}: {n} of {limit}",
		/** Muted footnote under the meters about counting semantics */
		footnote: "Meters use code points. Discord counts roughly per UTF-16 unit — compare the UTF-16 UNITS chip when your text is emoji-heavy.",
	},
	// ─── Fancy Text (/generators/fancy-text) ──
	fancyText: {
		/** ToolHeader title; sidebar + homepage card use the same key */
		title: "Fancy Text",
		/** Label shown above the text input */
		inputLabel: "[ INPUT ]",
		/** Placeholder inside the text input */
		inputPlaceholder: "Type something...",
		/** Sample text shown in style previews when input is empty */
		sampleText: "Kit Devkit",
		/** Toast {what} value after copying a styled text; {style} = style name */
		copiedStyle: "{style} text",
		/** sr-only aria-label on each card's Copy button; {style} = style name */
		copyStyleAria: "Copy {style} text",
		/** Footer accessibility warning about screen readers */
		accessibilityNote: "Screen readers may read styled text as individual symbols",
	},
	// ─── Invisible Text (/generators/invisible-text) ──
	invisibleText: {
		/** ToolHeader title; sidebar + homepage card use the same key */
		title: "Invisible Text",
		/** COPY tab trigger label */
		copyTab: "COPY",
		/** INSPECT tab trigger label */
		inspectTab: "INSPECT",
		/** Placeholder inside the inspect textarea */
		inspectPlaceholder: "Paste text here to inspect for invisible characters...",
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
		cleanedText: "Cleaned text",
		/** sr-only aria-label on the copy-cleaned button */
		copyCleanedAria: "Copy cleaned text",
		/** Muted message when no invisible characters are found in inspect */
		noneFound: "NO INVISIBLE CHARACTERS FOUND",
		/** Footer moderation/accessibility warning */
		footerWarning: "Invisible text can break screen readers and moderation tools — use sparingly",
	},
	// ─── Emoji Resizer (/generators/emoji-resizer) ──
	emojiResizer: {
		/** ToolHeader title; sidebar + homepage card use the same key */
		title: "Emoji Resizer",
		/** Bracketed micro label above the drop zone; keep brackets */
		uploadLabel: "[ UPLOAD ]",
		/** Bracketed micro label above the resize options row; keep brackets */
		optionsLabel: "[ OPTIONS ]",
		/** Dropzone text in idle state */
		dropOrClick: "Drag 'n' drop an image here, or click to select",
		/** Dropzone text while a file is dragged over */
		dropHere: "Drop the image here ...",
		/** sr-only aria-label on the clickable drop zone */
		uploadFileAria: "Upload an image to resize",
		/** Hazard toast when the dropped file is not an image */
		invalidFile: "Please drop a valid image file.",
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
		fitAria: "How the image fills the square",
		/** sr-only aria-label describing the FORMAT select */
		formatAria: "Output encoding format",
		/** Mono label in front of the quality slider */
		qualityLabel: "QUALITY",
		/** sr-only aria-label on the quality slider */
		qualityAria: "Encoding quality, 50 to 100",
		/** Bracketed micro label above the preview area; keep brackets */
		previewLabel: "[ PREVIEW ]",
		/** Verdict chip when the output meets the size budget */
		withinLimit: "WITHIN LIMIT",
		/** Hazard verdict chip when the output exceeds the size budget */
		overBudget: "OVER BUDGET — TRY LOWER QUALITY",
		/** Muted note under the preview explaining JPEG transparency handling */
		jpegNote: "JPEG has no transparency — transparent areas are filled white.",
		/** Label on the download button */
		downloadButton: "DOWNLOAD",
		/** sr-only aria-label on the download button; {filename} = generated file name */
		downloadAria: "Download resized image as {filename}",
	},
	// ─── Discord Limits (/viewers-miscellaneous/discord-limits) ──
	discordLimits: {
		/** ToolHeader title; sidebar + homepage card use the same key */
		title: "Discord Limits",
		/** Search input placeholder */
		filterPlaceholder: "FILTER LIMITS",
		/** sr-only aria-label on the search input */
		filterAria: "Filter limits by name or group",
	},
	},
};
export type Dictionary = typeof en;
