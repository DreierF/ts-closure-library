/**
 * ARIA state values for AutoCompleteValues.
 */
export type AutoCompleteValues = string;
export namespace AutoCompleteValues {
    const INLINE: string;
    const LIST: string;
    const BOTH: string;
    const NONE: string;
}
/**
 * ARIA state values for CheckedValues.
 */
export type CheckedValues = string;
export namespace CheckedValues {
    const TRUE: string;
    const FALSE: string;
    const MIXED: string;
    const UNDEFINED: string;
}
/**
 * ARIA state values for DropEffectValues.
 */
export type DropEffectValues = string;
export namespace DropEffectValues {
    export const COPY: string;
    export const MOVE: string;
    export const LINK: string;
    export const EXECUTE: string;
    export const POPUP: string;
    const NONE_1: string;
    export { NONE_1 as NONE };
}
/**
 * ARIA state values for ExpandedValues.
 */
export type ExpandedValues = string;
export namespace ExpandedValues {
    const TRUE_1: string;
    export { TRUE_1 as TRUE };
    const FALSE_1: string;
    export { FALSE_1 as FALSE };
    const UNDEFINED_1: string;
    export { UNDEFINED_1 as UNDEFINED };
}
/**
 * ARIA state values for GrabbedValues.
 */
export type GrabbedValues = string;
export namespace GrabbedValues {
    const TRUE_2: string;
    export { TRUE_2 as TRUE };
    const FALSE_2: string;
    export { FALSE_2 as FALSE };
    const UNDEFINED_2: string;
    export { UNDEFINED_2 as UNDEFINED };
}
/**
 * ARIA state values for InvalidValues.
 */
export type InvalidValues = string;
export namespace InvalidValues {
    const FALSE_3: string;
    export { FALSE_3 as FALSE };
    const TRUE_3: string;
    export { TRUE_3 as TRUE };
    export const GRAMMAR: string;
    export const SPELLING: string;
}
/**
 * ARIA state values for LivePriority.
 */
export type LivePriority = string;
export namespace LivePriority {
    const OFF: string;
    const POLITE: string;
    const ASSERTIVE: string;
}
/**
 * ARIA state values for OrientationValues.
 */
export type OrientationValues = string;
export namespace OrientationValues {
    const VERTICAL: string;
    const HORIZONTAL: string;
}
/**
 * ARIA state values for PressedValues.
 */
export type PressedValues = string;
export namespace PressedValues {
    const TRUE_4: string;
    export { TRUE_4 as TRUE };
    const FALSE_4: string;
    export { FALSE_4 as FALSE };
    const MIXED_1: string;
    export { MIXED_1 as MIXED };
    const UNDEFINED_3: string;
    export { UNDEFINED_3 as UNDEFINED };
}
/**
 * ARIA state values for RelevantValues.
 */
export type RelevantValues = string;
export namespace RelevantValues {
    const ADDITIONS: string;
    const REMOVALS: string;
    const TEXT: string;
    const ALL: string;
}
/**
 * ARIA state values for SelectedValues.
 */
export type SelectedValues = string;
export namespace SelectedValues {
    const TRUE_5: string;
    export { TRUE_5 as TRUE };
    const FALSE_5: string;
    export { FALSE_5 as FALSE };
    const UNDEFINED_4: string;
    export { UNDEFINED_4 as UNDEFINED };
}
/**
 * ARIA state values for SortValues.
 */
export type SortValues = string;
export namespace SortValues {
    export const ASCENDING: string;
    export const DESCENDING: string;
    const NONE_2: string;
    export { NONE_2 as NONE };
    export const OTHER: string;
}
/**
 * ARIA states and properties.
 */
export type State = string;
export namespace State {
    const ACTIVEDESCENDANT: string;
    const ATOMIC: string;
    const AUTOCOMPLETE: string;
    const BUSY: string;
    const CHECKED: string;
    const COLINDEX: string;
    const CONTROLS: string;
    const CURRENT: string;
    const DESCRIBEDBY: string;
    const DISABLED: string;
    const DROPEFFECT: string;
    const EXPANDED: string;
    const FLOWTO: string;
    const GRABBED: string;
    const HASPOPUP: string;
    const HIDDEN: string;
    const INVALID: string;
    const LABEL: string;
    const LABELLEDBY: string;
    const LEVEL: string;
    const LIVE: string;
    const MULTILINE: string;
    const MULTISELECTABLE: string;
    const ORIENTATION: string;
    const OWNS: string;
    const POSINSET: string;
    const PRESSED: string;
    const READONLY: string;
    const RELEVANT: string;
    const REQUIRED: string;
    const ROWINDEX: string;
    const SELECTED: string;
    const SETSIZE: string;
    const SORT: string;
    const VALUEMAX: string;
    const VALUEMIN: string;
    const VALUENOW: string;
    const VALUETEXT: string;
}
