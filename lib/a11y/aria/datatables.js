import * as object from './../../object/object.js';
import {State} from './attributes.js';
// Copyright 2013 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview The file contains data tables generated from the ARIA
 * standard schema http://www.w3.org/TR/wai-aria/.
 *
 * This is auto-generated code. Do not manually edit!
 */

/**
 * A map that contains mapping between an ARIA state and the default value
 * for it. Note that not all ARIA states have default values.
 *
 * @type {Object<!(State|string), (string|boolean|number)>}
 */
let DefaultStateValueMap_;

/**
 * A method that creates a map that contains mapping between an ARIA state and
 * the default value for it. Note that not all ARIA states have default values.
 *
 * @return {!Object<!(State|string), (string|boolean|number)>}
 *      The names for each of the notification methods.
 */
function getDefaultValuesMap() {
  if (!DefaultStateValueMap_) {
    DefaultStateValueMap_ = object.create(
        State.ATOMIC, false, State.AUTOCOMPLETE,
        'none', State.DROPEFFECT, 'none',
        State.HASPOPUP, false, State.LIVE, 'off',
        State.MULTILINE, false,
        State.MULTISELECTABLE, false,
        State.ORIENTATION, 'vertical',
        State.READONLY, false, State.RELEVANT,
        'additions text', State.REQUIRED, false,
        State.SORT, 'none', State.BUSY, false,
        State.DISABLED, false, State.HIDDEN,
        false, State.INVALID, 'false');
  }

  return DefaultStateValueMap_;
};

export {getDefaultValuesMap};