'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/use-brace-expansion');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
eslintTester.run('use-brace-expansion', rule, {
  valid: [
    { code: '{ test: computed("a", "b", function() {}) }' },
    { code: '{ test: computed(function() {}) }' },
    { code: '{ test: computed("a.test", "b.test", function() {}) }' },
    { code: '{ test: computed("a.{test,test2}", "b", function() {}) }' },
  ],
  invalid: [
    {
      code: '{ test: computed("a.test", "a.test2", function() {}) }',
      errors: [{
        message: 'Use brace expansion',
      }],
    },
    {
      code: '{ test: computed("a.{test,test2}", "a.test3", function() {}) }',
      errors: [{
        message: 'Use brace expansion',
      }],
    }
  ]
});