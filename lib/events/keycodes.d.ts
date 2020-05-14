/**
 * @fileoverview Constant declarations for common key codes.
 *
 * @see ../demos/keyhandler.html
 */
/**
 * Key codes for common characters.
 *
 * This list is not localized and therefore some of the key codes are not
 * correct for non US keyboard layouts. See comments below.
 *
 *
 */
export class KeyCodes {
    static WIN_KEY_FF_LINUX: number;
    static MAC_ENTER: number;
    static BACKSPACE: number;
    static TAB: number;
    static NUM_CENTER: number;
    static ENTER: number;
    static SHIFT: number;
    static CTRL: number;
    static ALT: number;
    static PAUSE: number;
    static CAPS_LOCK: number;
    static ESC: number;
    static SPACE: number;
    static PAGE_UP: number;
    static PAGE_DOWN: number;
    static END: number;
    static HOME: number;
    static LEFT: number;
    static UP: number;
    static RIGHT: number;
    static DOWN: number;
    static PLUS_SIGN: number;
    static PRINT_SCREEN: number;
    static INSERT: number;
    static DELETE: number;
    static ZERO: number;
    static ONE: number;
    static TWO: number;
    static THREE: number;
    static FOUR: number;
    static FIVE: number;
    static SIX: number;
    static SEVEN: number;
    static EIGHT: number;
    static NINE: number;
    static FF_SEMICOLON: number;
    static FF_EQUALS: number;
    static FF_DASH: number;
    static FF_HASH: number;
    static FF_JP_QUOTE: number;
    static QUESTION_MARK: number;
    static AT_SIGN: number;
    static A: number;
    static B: number;
    static C: number;
    static D: number;
    static E: number;
    static F: number;
    static G: number;
    static H: number;
    static I: number;
    static J: number;
    static K: number;
    static L: number;
    static M: number;
    static N: number;
    static O: number;
    static P: number;
    static Q: number;
    static R: number;
    static S: number;
    static T: number;
    static U: number;
    static V: number;
    static W: number;
    static X: number;
    static Y: number;
    static Z: number;
    static META: number;
    static WIN_KEY_RIGHT: number;
    static CONTEXT_MENU: number;
    static NUM_ZERO: number;
    static NUM_ONE: number;
    static NUM_TWO: number;
    static NUM_THREE: number;
    static NUM_FOUR: number;
    static NUM_FIVE: number;
    static NUM_SIX: number;
    static NUM_SEVEN: number;
    static NUM_EIGHT: number;
    static NUM_NINE: number;
    static NUM_MULTIPLY: number;
    static NUM_PLUS: number;
    static NUM_MINUS: number;
    static NUM_PERIOD: number;
    static NUM_DIVISION: number;
    static F1: number;
    static F2: number;
    static F3: number;
    static F4: number;
    static F5: number;
    static F6: number;
    static F7: number;
    static F8: number;
    static F9: number;
    static F10: number;
    static F11: number;
    static F12: number;
    static NUMLOCK: number;
    static SCROLL_LOCK: number;
    static FIRST_MEDIA_KEY: number;
    static LAST_MEDIA_KEY: number;
    static SEMICOLON: number;
    static DASH: number;
    static EQUALS: number;
    static COMMA: number;
    static PERIOD: number;
    static SLASH: number;
    static APOSTROPHE: number;
    static TILDE: number;
    static SINGLE_QUOTE: number;
    static OPEN_SQUARE_BRACKET: number;
    static BACKSLASH: number;
    static CLOSE_SQUARE_BRACKET: number;
    static WIN_KEY: number;
    static MAC_FF_META: number;
    static MAC_WK_CMD_LEFT: number;
    static MAC_WK_CMD_RIGHT: number;
    static WIN_IME: number;
    static VK_NONAME: number;
    static PHANTOM: number;
}
export namespace KeyCodes {
    export function isTextModifyingKeyEvent(e: EventsBrowserEvent | null): boolean;
    export function firesKeyPressEvent(keyCode: number, opt_heldKeyCode?: number | undefined, opt_shiftKey?: boolean | undefined, opt_ctrlKey?: boolean | undefined, opt_altKey?: boolean | undefined, opt_metaKey?: boolean | undefined): boolean;
    export function isCharacterKey(keyCode: number): boolean;
    export function normalizeKeyCode(keyCode: number): number;
    export function normalizeGeckoKeyCode(keyCode: number): number;
    export function normalizeMacWebKitKeyCode(keyCode: number): number;
}
import { BrowserEvent as EventsBrowserEvent } from "./browserevent.js";
