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
		/** Button text shown briefly after successful copy */
		copiedStatus: "Copied!",
		/** Button text shown on copy failure */
		copyFailed: "Failed to copy!",
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
		/** Copy button resting state; doubles as the legacy copyStatus value — keep short */
		copy: "Copy",
		/** Copy button state right after success */
		copied: "Copied!",
		/** Copy button state after a failed copy */
		copyFailed: "Failed to copy!",
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
	}
	},
};
export type Dictionary = typeof en;
