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
                        context.report({ node, message: "Use path.join() or path.resolve() instead of + to create paths." });
                    } else if (left.type === "Identifier" && MATCHER.test(left.name) && !EXTENSION.test(right.value)) {
                        context.report({ node, message: "Use path.join() or path.resolve() instead of + to create paths." });
                    }
                }
            }

        };

    }
};
