"use strict";
(() => {
var exports = {};
exports.id = 660;
exports.ids = [660];
exports.modules = {

/***/ 2735:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ MyDocument)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: ./node_modules/next/document.js
var next_document = __webpack_require__(6859);
;// CONCATENATED MODULE: external "@react-icons/all-files"
const all_files_namespaceObject = require("@react-icons/all-files");
;// CONCATENATED MODULE: ./pages/_document.tsx




class MyDocument extends next_document["default"] {
    render() {
        return /*#__PURE__*/ jsx_runtime_.jsx(all_files_namespaceObject.IconContext.Provider, {
            value: {
                style: {
                    verticalAlign: "middle"
                }
            },
            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(next_document.Html, {
                lang: "en",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)(next_document.Head, {
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("link", {
                                rel: "shortcut icon",
                                href: "/favicon.ico"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("link", {
                                rel: "icon",
                                type: "image/png",
                                sizes: "32x32",
                                href: "favicon.png"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("link", {
                                rel: "manifest",
                                href: "/manifest.json"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("body", {
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx(next_document.Main, {}),
                            /*#__PURE__*/ jsx_runtime_.jsx(next_document.NextScript, {})
                        ]
                    })
                ]
            })
        });
    }
}


/***/ }),

/***/ 4140:
/***/ ((module) => {

module.exports = require("next/dist/server/get-page-files.js");

/***/ }),

/***/ 9716:
/***/ ((module) => {

module.exports = require("next/dist/server/htmlescape.js");

/***/ }),

/***/ 6368:
/***/ ((module) => {

module.exports = require("next/dist/server/utils.js");

/***/ }),

/***/ 6724:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/constants.js");

/***/ }),

/***/ 8743:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/html-context.js");

/***/ }),

/***/ 8524:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/is-plain-object.js");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [676,859], () => (__webpack_exec__(2735)));
module.exports = __webpack_exports__;

})();