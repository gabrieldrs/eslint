/**
 * @fileoverview Tests for array-callback-return rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/array-callback-return"),
    { RuleTester } = require("../../../lib/rule-tester");

const ruleTester = new RuleTester();

const allowImplicitOptions = [{ allowImplicit: true }];

const checkForEach = [{ checkForEach: true }];

ruleTester.run("array-callback-return", rule, {
    valid: [
        "foo.forEach(bar || function(x) { var a=0; })",
        "foo.forEach(bar || function(x) { return a; })",
        "foo.forEach(function() {return function() { var a = 0;}}())",
        "foo.forEach(function(x) { var a=0; })",
        "foo.forEach(function(x) {return;})",
        "foo.forEach(function(x) { if (a === b) { return;} var a=0; })",
        "foo.forEach(function(x) { if (a === b) { return x;} var a=0; })",
        "foo.forEach(function(x) { return x; })",
        "foo.bar().forEach(function(x) { return; })",
        "[\"foo\",\"bar\",\"baz\"].forEach(function(x) { return x; })",
        { code: "foo.forEach((x) => { var a=0; })", parserOptions: { ecmaVersion: 6 } },
        { code: "foo.forEach((x) => { if (a === b) { return;} var a=0; })", parserOptions: { ecmaVersion: 6 } },

        // options: { checkForEach: true }
        { code: "foo.forEach(function() {return function() { if (a == b) { return; }}}())", options: checkForEach },
        { code: "foo.forEach(function(x) { var a=0; })", options: checkForEach },
        { code: "foo.forEach(function(x) { if (a === b) { return;} var a=0; })", options: checkForEach },
        { code: "foo.forEach((x) => { var a=0; })", options: checkForEach, parserOptions: { ecmaVersion: 6 } },
        { code: "foo.forEach((x) => { if (a === b) { return;} var a=0; })", options: checkForEach, parserOptions: { ecmaVersion: 6 } },

        // options: { allowImplicit: false }
        "Array.from(x, function() { return true; })",
        "Int32Array.from(x, function() { return true; })",
        { code: "Array.from(x, function() { return true; })", options: [{ allowImplicit: false }] },
        { code: "Int32Array.from(x, function() { return true; })", options: [{ allowImplicit: false }] },

        // options: { allowImplicit: true }
        { code: "Array.from(x, function() { return; })", options: allowImplicitOptions },
        { code: "Int32Array.from(x, function() { return; })", options: allowImplicitOptions },

        "Arrow.from(x, function() {})",

        // options: { allowImplicit: false }
        "foo.every(function() { return true; })",
        "foo.filter(function() { return true; })",
        "foo.find(function() { return true; })",
        "foo.findIndex(function() { return true; })",
        "foo.map(function() { return true; })",
        "foo.reduce(function() { return true; })",
        "foo.reduceRight(function() { return true; })",
        "foo.some(function() { return true; })",
        "foo.sort(function() { return 0; })",

        // options: { allowImplicit: true }
        { code: "foo.every(function() { return; })", options: allowImplicitOptions },
        { code: "foo.filter(function() { return; })", options: allowImplicitOptions },
        { code: "foo.find(function() { return; })", options: allowImplicitOptions },
        { code: "foo.findIndex(function() { return; })", options: allowImplicitOptions },
        { code: "foo.map(function() { return; })", options: allowImplicitOptions },
        { code: "foo.reduce(function() { return; })", options: allowImplicitOptions },
        { code: "foo.reduceRight(function() { return; })", options: allowImplicitOptions },
        { code: "foo.some(function() { return; })", options: allowImplicitOptions },
        { code: "foo.sort(function() { return; })", options: allowImplicitOptions },

        "foo.abc(function() {})",
        "every(function() {})",
        "foo[every](function() {})",
        "var every = function() {}",
        { code: "foo[`${every}`](function() {})", parserOptions: { ecmaVersion: 6 } },
        { code: "foo.every(() => true)", parserOptions: { ecmaVersion: 6 } },

        // options: { allowImplicit: false }
        { code: "foo.every(() => { return true; })", parserOptions: { ecmaVersion: 6 } },
        "foo.every(function() { if (a) return true; else return false; })",
        "foo.every(function() { switch (a) { case 0: bar(); default: return true; } })",
        "foo.every(function() { try { bar(); return true; } catch (err) { return false; } })",
        "foo.every(function() { try { bar(); } finally { return true; } })",

        // options: { allowImplicit: true }
        { code: "foo.every(() => { return; })", options: allowImplicitOptions, parserOptions: { ecmaVersion: 6 } },
        { code: "foo.every(function() { if (a) return; else return a; })", options: allowImplicitOptions },
        { code: "foo.every(function() { switch (a) { case 0: bar(); default: return; } })", options: allowImplicitOptions },
        { code: "foo.every(function() { try { bar(); return; } catch (err) { return; } })", options: allowImplicitOptions },
        { code: "foo.every(function() { try { bar(); } finally { return; } })", options: allowImplicitOptions },

        "foo.every(function(){}())",
        "foo.every(function(){ return function() { return true; }; }())",
        "foo.every(function(){ return function() { return; }; })",
        { code: "foo.map(async function(){})", parserOptions: { ecmaVersion: 8 } },
        { code: "foo.map(async () => {})", parserOptions: { ecmaVersion: 8 } },
        { code: "foo.map(function* () {})", parserOptions: { ecmaVersion: 6 } }
    ],
    invalid: [
        { code: "foo.forEach(function() {return function() { if (a == b) { return a; }}}())", options: checkForEach, errors: [{ messageId: "expectedNoReturnValue", data: { name: "Function" } }] },
        { code: "foo.forEach(bar || function(x) { return; })", options: checkForEach, errors: [{ messageId: "noReturnExpected", data: { name: "function" } }] },
        { code: "foo.forEach(function(x) { if (a == b) {return x;}})", options: checkForEach, errors: [{ messageId: "expectedNoReturnValue", data: { name: "Function" } }] },
        { code: "foo.forEach(function(x) { if (a == b) {return undefined;}})", options: checkForEach, errors: [{ messageId: "expectedNoReturnValue", data: { name: "Function" } }] },
        { code: "foo.forEach(function(x) { return;})", options: checkForEach, errors: [{ messageId: "noReturnExpected", data: { name: "function" } }] },
        { code: "foo.forEach(function bar(x) { return x;})", options: checkForEach, errors: [{ messageId: "noReturnExpected", data: { name: "function 'bar'" } }, { messageId: "expectedNoReturnValue", data: { name: "Function 'bar'" } }] },
        { code: "foo.bar().forEach(function bar(x) { return x;})", options: checkForEach, errors: [{ messageId: "noReturnExpected", data: { name: "function 'bar'" } }, { messageId: "expectedNoReturnValue", data: { name: "Function 'bar'" } }] },
        { code: "[\"foo\",\"bar\"].forEach(function bar(x) { return x;})", options: checkForEach, errors: [{ messageId: "noReturnExpected", data: { name: "function 'bar'" } }, { messageId: "expectedNoReturnValue", data: { name: "Function 'bar'" } }] },
        { code: "foo.forEach((x) => { return x;})", options: checkForEach, parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "noReturnExpected", data: { name: "arrow function" } }, { messageId: "expectedNoReturnValue", data: { name: "Arrow function" } }] },
        { code: "Array.from(x, function() {})", errors: [{ messageId: "expectedInside", data: { name: "function" } }] },
        { code: "Array.from(x, function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'" } }] },
        { code: "Int32Array.from(x, function() {})", errors: [{ messageId: "expectedInside", data: { name: "function" } }] },
        { code: "Int32Array.from(x, function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'" } }] },
        { code: "foo.every(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function" } }] },
        { code: "foo.every(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'" } }] },
        { code: "foo.filter(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function" } }] },
        { code: "foo.filter(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'" } }] },
        { code: "foo.find(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function" } }] },
        { code: "foo.find(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'" } }] },
        { code: "foo.findIndex(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function" } }] },
        { code: "foo.findIndex(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'" } }] },
        { code: "foo.map(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function" } }] },
        { code: "foo.map(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'" } }] },
        { code: "foo.reduce(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function" } }] },
        { code: "foo.reduce(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'" } }] },
        { code: "foo.reduceRight(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function" } }] },
        { code: "foo.reduceRight(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'" } }] },
        { code: "foo.some(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function" } }] },
        { code: "foo.some(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'" } }] },
        { code: "foo.sort(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function" } }] },
        { code: "foo.sort(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'" } }] },
        { code: "foo.bar.baz.every(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function" } }] },
        { code: "foo.bar.baz.every(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'" } }] },
        { code: "foo[\"every\"](function() {})", errors: [{ messageId: "expectedInside", data: { name: "function" } }] },
        { code: "foo[\"every\"](function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'" } }] },
        { code: "foo[`every`](function() {})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "expectedInside", data: { name: "function" } }] },
        { code: "foo[`every`](function foo() {})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "expectedInside", data: { name: "function 'foo'" } }] },
        { code: "foo.every(() => {})", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected to return a value in arrow function.", column: 14 }] },
        { code: "foo.every(function() { if (a) return true; })", errors: [{ message: "Expected to return a value at the end of function.", column: 11 }] },
        { code: "foo.every(function cb() { if (a) return true; })", errors: [{ message: "Expected to return a value at the end of function 'cb'.", column: 20 }] },
        { code: "foo.every(function() { switch (a) { case 0: break; default: return true; } })", errors: [{ messageId: "expectedAtEnd", data: { name: "function" } }] },
        { code: "foo.every(function foo() { switch (a) { case 0: break; default: return true; } })", errors: [{ messageId: "expectedAtEnd", data: { name: "function 'foo'" } }] },
        { code: "foo.every(function() { try { bar(); } catch (err) { return true; } })", errors: [{ messageId: "expectedAtEnd", data: { name: "function" } }] },
        { code: "foo.every(function foo() { try { bar(); } catch (err) { return true; } })", errors: [{ messageId: "expectedAtEnd", data: { name: "function 'foo'" } }] },
        { code: "foo.every(function() { return; })", errors: [{ messageId: "expectedReturnValue", data: { name: "Function" } }] },
        { code: "foo.every(function foo() { return; })", errors: [{ messageId: "expectedReturnValue", data: { name: "Function 'foo'" } }] },
        { code: "foo.every(function() { if (a) return; })", errors: ["Expected to return a value at the end of function.", { messageId: "expectedReturnValue", data: { name: "Function" } }] },
        { code: "foo.every(function foo() { if (a) return; })", errors: ["Expected to return a value at the end of function 'foo'.", { messageId: "expectedReturnValue", data: { name: "Function 'foo'" } }] },
        { code: "foo.every(function() { if (a) return; else return; })", errors: [{ messageId: "expectedReturnValue", data: { name: "Function" } }, { messageId: "expectedReturnValue", data: { name: "Function" } }] },
        { code: "foo.every(function foo() { if (a) return; else return; })", errors: [{ messageId: "expectedReturnValue", data: { name: "Function 'foo'" } }, { messageId: "expectedReturnValue", data: { name: "Function 'foo'" } }] },
        { code: "foo.every(cb || function() {})", errors: ["Expected to return a value in function."] },
        { code: "foo.every(cb || function foo() {})", errors: ["Expected to return a value in function 'foo'."] },
        { code: "foo.every(a ? function() {} : function() {})", errors: ["Expected to return a value in function.", "Expected to return a value in function."] },
        { code: "foo.every(a ? function foo() {} : function bar() {})", errors: ["Expected to return a value in function 'foo'.", "Expected to return a value in function 'bar'."] },
        { code: "foo.every(function(){ return function() {}; }())", errors: [{ message: "Expected to return a value in function.", column: 30 }] },
        { code: "foo.every(function(){ return function foo() {}; }())", errors: [{ message: "Expected to return a value in function 'foo'.", column: 39 }] },
        { code: "foo.every(() => {})", options: [{ allowImplicit: false }], parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected to return a value in arrow function." }] },
        { code: "foo.every(() => {})", options: [{ allowImplicit: true }], parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected to return a value in arrow function." }] }
    ]
});
