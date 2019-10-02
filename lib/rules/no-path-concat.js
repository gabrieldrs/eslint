/**
 * @fileoverview Disallow string concatenation when using __dirname and __filename
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow string concatenation with `__dirname` and `__filename`",
            category: "Node.js and CommonJS",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-path-concat"
        },

        schema: []
    },

    create(context) {

        const MATCHER = /^__(?:dir|file)name$/u;
        const EXTENSION = /^\.[a-zA-Z0-9]+/u;

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {

            BinaryExpression(node) {

                const left = node.left,
                    right = node.right;

                if (node.operator === "+") {
                    if (right.type === "Identifier" && MATCHER.test(right.name)) {
                        context.report({ node, message: "Use path.join() or path.resolve() instead of concatenation to create paths." });
                    } else if (left.type === "Identifier" && MATCHER.test(left.name) && !EXTENSION.test(right.value)) {
                        context.report({ node, message: "Use path.join() or path.resolve() instead of concatenation to create paths." });
                    }
                }
            },

            TemplateLiteral(node) {
                if (node.expressions.length > 0) {
                    const orderedElements = [...node.expressions, ...node.quasis].sort((a, b) => a.range[0] - b.range[0]);

                    orderedElements.forEach((el, i) => {
                        if (el.type === "Identifier" && MATCHER.test(el.name)) {
                            if (orderedElements.length !== 3) {
                                context.report({ node, message: "Use path.join() or path.resolve() instead of concatenation to create paths." });
                            }
                            if (orderedElements[i - 1].value.raw !== "") {
                                context.report({ node, message: "Use path.join() or path.resolve() instead of concatenation to create paths." });
                                return;
                            }
                            if (orderedElements[i + 1] && !EXTENSION.test(orderedElements[i + 1].value.raw)) {
                                context.report({ node, message: "Use path.join() or path.resolve() instead of concatenation to create paths." });
                            }
                        }
                    });
                }
            }

        };

    }
};
