import * as legacyconversions from './../html/legacyconversions.js';
import * as userAgent from './../useragent/useragent.js';
import * as dom from './dom.js';
import {NodeType} from './nodetype.js';
import * as safe from './safe.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview
 * XML utilities.
 */

/**
 * Max XML size for MSXML2.  Used to prevent potential DoS attacks.
 * @type {number}
 */
let MAX_XML_SIZE_KB = 2 * 1024;  // In kB

/**
 * Max XML size for MSXML2.  Used to prevent potential DoS attacks.
 * @type {number}
 */
let MAX_ELEMENT_DEPTH = 256;  // Same default as MSXML6.

/**
 * Check for ActiveXObject support by the browser.
 * @return {boolean} true if browser has ActiveXObject support.
 * @private
 */
function hasActiveXObjectSupport_() {
  if (!userAgent.IE) {
    // Avoid raising useless exception in case code is not compiled
    // and browser is not MSIE.
    return false;
  }
  try {
    // Due to lot of changes in IE 9, 10 & 11 behaviour and ActiveX being
    // totally disableable using MSIE's security level, trying to create the
    // ActiveXOjbect is a lot more reliable than testing for the existence of
    // window.ActiveXObject
    new ActiveXObject('MSXML2.DOMDocument');
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * True if browser has ActiveXObject support.
 * Possible override if this test become wrong in coming IE versions.
 * @type {boolean}
 */
let ACTIVEX_SUPPORT =
    userAgent.IE && hasActiveXObjectSupport_();

/**
 * Creates an XML document appropriate for the current JS runtime
 * @param {string=} opt_rootTagName The root tag name.
 * @param {string=} opt_namespaceUri Namespace URI of the document element.
 * @param {boolean=} opt_preferActiveX Whether to default to ActiveXObject to
 * create Document in IE. Use this if you need xpath support in IE (e.g.,
 * selectSingleNode or selectNodes), but be aware that the ActiveXObject does
 * not support various DOM-specific Document methods and attributes.
 * @return {Document} The new document.
 * @throws {Error} if browser does not support creating new documents or
 * namespace is provided without a root tag name.
 */
function createDocument(
    opt_rootTagName, opt_namespaceUri, opt_preferActiveX) {
  if (opt_namespaceUri && !opt_rootTagName) {
    throw new Error('Can\'t create document with namespace and no root tag');
  }
  // If document.implementation.createDocument is available and they haven't
  // explicitly opted to use ActiveXObject when possible.
  if (document.implementation && document.implementation.createDocument &&
      !(ACTIVEX_SUPPORT && opt_preferActiveX)) {
    return document.implementation.createDocument(
        opt_namespaceUri || '', opt_rootTagName || '', null);
  } else if (ACTIVEX_SUPPORT) {
    var doc = createMsXmlDocument_();
    if (doc) {
      if (opt_rootTagName) {
        doc.appendChild(
            /** @type {!Node} */ (doc.createNode(
                NodeType.ELEMENT, opt_rootTagName,
                opt_namespaceUri || '')));
      }
      return doc;
    }
  }
  throw new Error('Your browser does not support creating new documents');
};

/**
 * Creates an XML document from a string
 * @param {string} xml The text.
 * @param {boolean=} opt_preferActiveX Whether to default to ActiveXObject to
 * create Document in IE. Use this if you need xpath support in IE (e.g.,
 * selectSingleNode or selectNodes), but be aware that the ActiveXObject does
 * not support various DOM-specific Document methods and attributes.
 * @return {Document} XML document from the text.
 * @throws {Error} if browser does not support loading XML documents.
 */
function loadXml(xml, opt_preferActiveX) {
  if (typeof DOMParser != 'undefined' &&
      !(ACTIVEX_SUPPORT && opt_preferActiveX)) {
    return safe.parseFromString(
        new DOMParser(), legacyconversions.safeHtmlFromString(xml),
        'application/xml');
  } else if (ACTIVEX_SUPPORT) {
    var doc = createMsXmlDocument_();
    doc.loadXML(xml);
    return doc;
  }
  throw new Error('Your browser does not support loading xml documents');
};

/**
 * Serializes an XML document or subtree to string.
 * @param {Document|Element} xml The document or the root node of the subtree.
 * @return {string} The serialized XML.
 * @throws {Error} if browser does not support XML serialization.
 */
function serialize(xml) {
  // Compatible with IE/ActiveXObject.
  var text = xml.xml;
  if (text) {
    return text;
  }
  // Compatible with Firefox, Opera and WebKit.
  if (typeof XMLSerializer != 'undefined') {
    return new XMLSerializer().serializeToString(xml);
  }
  throw new Error('Your browser does not support serializing XML documents');
};

/**
 * Selects a single node using an Xpath expression and a root node
 * @param {Node} node The root node.
 * @param {string} path Xpath selector.
 * @return {Node} The selected node, or null if no matching node.
 */
function selectSingleNode(node, path) {
  if (typeof node.selectSingleNode != 'undefined') {
    var doc = dom.getOwnerDocument(node);
    if (typeof doc.setProperty != 'undefined') {
      doc.setProperty('SelectionLanguage', 'XPath');
    }
    return node.selectSingleNode(path);
  } else if (document.implementation.hasFeature('XPath', '3.0')) {
    var doc = dom.getOwnerDocument(node);
    var resolver = doc.createNSResolver(doc.documentElement);
    var result = doc.evaluate(
        path, node, resolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue;
  }
  // This browser does not support xpath for the given node. If IE, ensure XML
  // Document was created using ActiveXObject
  // TODO(joeltine): This should throw instead of return null.
  return null;
};

/**
 * Selects multiple nodes using an Xpath expression and a root node
 * @param {Node} node The root node.
 * @param {string} path Xpath selector.
 * @return {(!NodeList<!Node>|!Array<!Node>)} The selected nodes, or empty array
 *     if no matching nodes.
 */
function selectNodes(node, path) {
  if (typeof node.selectNodes != 'undefined') {
    var doc = dom.getOwnerDocument(node);
    if (typeof doc.setProperty != 'undefined') {
      doc.setProperty('SelectionLanguage', 'XPath');
    }
    return node.selectNodes(path);
  } else if (document.implementation.hasFeature('XPath', '3.0')) {
    var doc = dom.getOwnerDocument(node);
    var resolver = doc.createNSResolver(doc.documentElement);
    var nodes = doc.evaluate(
        path, node, resolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var results = [];
    var count = nodes.snapshotLength;
    for (var i = 0; i < count; i++) {
      results.push(nodes.snapshotItem(i));
    }
    return results;
  } else {
    // This browser does not support xpath for the given node. If IE, ensure XML
    // Document was created using ActiveXObject.
    // TODO(joeltine): This should throw instead of return empty array.
    return [];
  }
};

/**
 * Sets multiple attributes on an element. Differs from dom.setProperties
 * in that it exclusively uses the element's setAttributes method. Use this
 * when you need to ensure that the exact property is available as an attribute
 * and can be read later by the native getAttribute method.
 * @param {!Element} element XML or DOM element to set attributes on.
 * @param {!Object<string, string>} attributes Map of property:value pairs.
 */
function setAttributes(element, attributes) {
  for (var key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      element.setAttribute(key, attributes[key]);
    }
  }
};

/**
 * Creates an instance of the MSXML2.DOMDocument.
 * @return {!XMLDOMDocument} The new document.
 * @private
 */
function createMsXmlDocument_() {
  var doc = new ActiveXObject('MSXML2.DOMDocument');
  if (doc) {
    // Prevent potential vulnerabilities exposed by MSXML2, see
    // http://b/1707300 and http://go/xxe-attacks for details.
    doc.resolveExternals = false;
    doc.validateOnParse = false;
    // Add a try catch block because accessing these properties will throw an
    // error on unsupported MSXML versions. This affects Windows machines
    // running IE6 or IE7 that are on XP SP2 or earlier without MSXML updates.
    // See http://msdn.microsoft.com/en-us/library/ms766391(VS.85).aspx for
    // specific details on which MSXML versions support these properties.
    try {
      doc.setProperty('ProhibitDTD', true);
      doc.setProperty('MaxXMLSize', MAX_XML_SIZE_KB);
      doc.setProperty('MaxElementDepth', MAX_ELEMENT_DEPTH);
    } catch (e) {
      // No-op.
    }
  }
  return doc;
};

export {ACTIVEX_SUPPORT, MAX_ELEMENT_DEPTH, MAX_XML_SIZE_KB, createDocument, loadXml, selectNodes, selectSingleNode, serialize, setAttributes};