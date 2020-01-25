/**
 * A whitelist for attributes that are not safe to allow unrestricted, but are
 * made safe by default policies installed by the sanitizer in
 * goog.html.sanitizer.HtmlSanitizer.Builder.prototype.build, and thus allowed
 * by default under these policies.
 * @const @dict {boolean}
 */
export let AttributeSanitizedWhitelist: {
    '* USEMAP': boolean;
    '* ACTION': boolean;
    '* CITE': boolean;
    '* HREF': boolean;
    '* LONGDESC': boolean;
    '* SRC': boolean;
    'LINK HREF': boolean;
    '* FOR': boolean;
    '* HEADERS': boolean;
    '* NAME': boolean;
    'A TARGET': boolean;
    '* CLASS': boolean;
    '* ID': boolean;
    '* STYLE': boolean;
};
/**
 * @fileoverview Contains the attribute whitelists for use in the Html
 * sanitizer.
 */
/**
 * A whitelist for attributes that are always safe and allowed by default.
 * The sanitizer only applies whitespace trimming to these.
 * @const @dict {boolean}
 */
export let AttributeWhitelist: {
    '* ARIA-CHECKED': boolean;
    '* ARIA-COLCOUNT': boolean;
    '* ARIA-COLINDEX': boolean;
    '* ARIA-DESCRIBEDBY': boolean;
    '* ARIA-DISABLED': boolean;
    '* ARIA-GOOG-EDITABLE': boolean;
    '* ARIA-LABEL': boolean;
    '* ARIA-LABELLEDBY': boolean;
    '* ARIA-MULTILINE': boolean;
    '* ARIA-MULTISELECTABLE': boolean;
    '* ARIA-ORIENTATION': boolean;
    '* ARIA-PLACEHOLDER': boolean;
    '* ARIA-READONLY': boolean;
    '* ARIA-REQUIRED': boolean;
    '* ARIA-ROLEDESCRIPTION': boolean;
    '* ARIA-ROWCOUNT': boolean;
    '* ARIA-ROWINDEX': boolean;
    '* ARIA-SELECTED': boolean;
    '* ABBR': boolean;
    '* ACCEPT': boolean;
    '* ACCESSKEY': boolean;
    '* ALIGN': boolean;
    '* ALT': boolean;
    '* AUTOCOMPLETE': boolean;
    '* AXIS': boolean;
    '* BGCOLOR': boolean;
    '* BORDER': boolean;
    '* CELLPADDING': boolean;
    '* CELLSPACING': boolean;
    '* CHAROFF': boolean;
    '* CHAR': boolean;
    '* CHECKED': boolean;
    '* CLEAR': boolean;
    '* COLOR': boolean;
    '* COLSPAN': boolean;
    '* COLS': boolean;
    '* COMPACT': boolean;
    '* COORDS': boolean;
    '* DATETIME': boolean;
    '* DIR': boolean;
    '* DISABLED': boolean;
    '* ENCTYPE': boolean;
    '* FACE': boolean;
    '* FRAME': boolean;
    '* HEIGHT': boolean;
    '* HREFLANG': boolean;
    '* HSPACE': boolean;
    '* ISMAP': boolean;
    '* LABEL': boolean;
    '* LANG': boolean;
    '* MAX': boolean;
    '* MAXLENGTH': boolean;
    '* METHOD': boolean;
    '* MULTIPLE': boolean;
    '* NOHREF': boolean;
    '* NOSHADE': boolean;
    '* NOWRAP': boolean;
    '* OPEN': boolean;
    '* READONLY': boolean;
    '* REQUIRED': boolean;
    '* REL': boolean;
    '* REV': boolean;
    '* ROLE': boolean;
    '* ROWSPAN': boolean;
    '* ROWS': boolean;
    '* RULES': boolean;
    '* SCOPE': boolean;
    '* SELECTED': boolean;
    '* SHAPE': boolean;
    '* SIZE': boolean;
    '* SPAN': boolean;
    '* START': boolean;
    '* SUMMARY': boolean;
    '* TABINDEX': boolean;
    '* TITLE': boolean;
    '* TYPE': boolean;
    '* VALIGN': boolean;
    '* VALUE': boolean;
    '* VSPACE': boolean;
    '* WIDTH': boolean;
};
