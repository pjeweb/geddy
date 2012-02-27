/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

/*
 * Basic validators -- name is the field name, params is the entire params
 * collection (needed for stuff like password confirmation so it's possible
 * to compare with other field values, and the rule is the data for this
 * particular validation
 * Rules can look like this:
 * present: {qualifier: true, {message: 'Gotta be here'}}
 * length: {qualifier: {min: 2, max: 12}}
 * withFunction: {qualifier: function (s) { return true },
 *    message: 'Something is wrong'}
 */
var validators = {
  present: function (name, val, params, rule) {
    if (!val) {
      // Field 'name' is required
      return rule.message || {name: name};
    }
  },

  absent: function (name, val, params, rule) {
    if (val) {
      // Field 'name' must not be filled in
      return rule.message || {name: name};
    }
  },

  confirmed: function (name, val, params, rule) {
    var qual = rule.qualifier;
    if (val != params[qual]) {
      // Field 'name' and field 'qual' must match
      return rule.message || {name: name, qual: qual};
    }
  },

  format: function (name, val, params, rule) {
    if (!rule.qualifier.test(val)) {
      // Field 'name' is not correctly formatted
      return rule.message || {name: name};
    }
  },

  length: function (name, val, params, rule) {
    var qual = rule.qualifier;
    if (!val) {
      return rule.message || {name: name};
    }
    if (typeof qual == 'number') {
      if (val.length != qual) {
        // Field 'name' must be 'qual' characters long
        return rule.message || {name: name};
      }
    }
    else {
      if (typeof qual.min == 'number' && val.length < qual.min) {
        // Field 'name' must be at least 'min' characters long
        return rule.message || {name: name, min: qual.min};
      }
      if (typeof qual.max == 'number' && val.length > qual.max) {
        // Field 'name' may not be more than 'qual.max' characters long
        return rule.message || {name: name, max: qual.max};
      }
    }
  },

  withFunction: function (name, val, params, rule) {
    var func = rule.qualifier;
    if (typeof func != 'function') {
      throw new Error('withFunction validator for field "' + name +
          '" must be a function.');
    }
    if (!func(val, params)) {
      // Field 'name' is not valid
      return rule.message || {name: name};
    }
  }
};

module.exports = validators;
