/**
 * Installs custom attribute policies for the attributes provided in the list.
 * This can be used either on non-whitelisted attributes, effectively extending
 * the attribute whitelist, or on attributes that are whitelisted and already
 * have a policy, to override their policies.
 *
 * IMPORTANT: Uses of this method must be carefully security-reviewed to ensure
 * that the new tags do not introduce untrusted code execution or unsanctioned
 * network activity.
 *
 * @param {!Const} justification A constant string explaining why
 *     the addition of these attributes to the whitelist is safe. May include a
 *     security review ticket number.
 * @param {!Builder} builder The builder
 *     whose attribute whitelist should be extended.
 * @param {!Array<(string|!HtmlSanitizerAttributePolicy)>}
 *     attrs A list of attributes whose policy should be overridden. Attributes
 *     can come in of two forms:
 *     - string: allow all values and just trim whitespaces for this attribute
 *         on all tags.
 *     - HtmlSanitizerAttributePolicy: allows specifying a policy for a
 *         particular tag. The tagName can be '*', which means all tags. If no
 *         policy is passed, the default is allow all values and just trim
 *         whitespaces.
 *     The tag and attribute names are case-insensitive.
 * @return {!Builder}
 */
export function alsoAllowAttributes(justification: Const, builder: Builder, attrs: Array<(string | HtmlSanitizerAttributePolicy)>): Builder;
/**
 * @fileoverview Potentially unsafe API for the HTML sanitizer.
 *
 * The HTML sanitizer enforces a default a safe policy, and also limits how the
 * policy can be relaxed, so that developers cannot misconfigure it and
 * introduce vulnerabilities.
 *
 * This file extends the HTML sanitizer's capabilities with potentially unsafe
 * configuration options, such as the ability to extend the tag whitelist (e.g.
 * to support web components).
 *
 * @supported IE 10+, Chrome 26+, Firefox 22+, Safari 7.1+, Opera 15+
 */
/**
 * Extends the tag whitelist with the list of tags provided. If the tag is
 * blacklisted, this method also removes it from the blacklist.
 *
 * IMPORTANT: Uses of this method must be carefully security-reviewed to ensure
 * that the new tags do not introduce untrusted code execution or unsanctioned
 * network activity.
 *
 * @param {!Const} justification A constant string explaining why
 *     the addition of these tags to the whitelist is safe. May include a
 *     security review ticket number.
 * @param {!Builder} builder The builder
 *     whose tag whitelist should be extended.
 * @param {!Array<string>} tags A list of additional tags to allow through the
 *     sanitizer. The tag names are case-insensitive.
 * @return {!Builder}
 */
export function alsoAllowTags(justification: Const, builder: Builder, tags: Array<string>): Builder;
import { Const } from "../../string/const.js";
import { Builder } from "./htmlsanitizer.js";
import { HtmlSanitizerAttributePolicy } from "./htmlsanitizer.js";
