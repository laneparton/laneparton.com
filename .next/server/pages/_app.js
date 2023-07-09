"use strict";
(() => {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 3621:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "U": () => (/* binding */ bootstrap)
/* harmony export */ });
function bootstrap() {
    console.log(``);
}


/***/ }),

/***/ 5656:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var fathom_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9316);
/* harmony import */ var fathom_client__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(fathom_client__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _lib_bootstrap_client__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3621);
/* harmony import */ var _lib_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4872);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_config__WEBPACK_IMPORTED_MODULE_4__]);
_lib_config__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
// global styles shared across the entire site




// used for rendering equations (optional)

//import posthog from 'posthog-js'
// used for code syntax highlighting (optional)

// core styles shared by all of react-notion-x (required)


// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'
// global style overrides for notion

// global style overrides for prism theme (optional)



if (!_lib_config__WEBPACK_IMPORTED_MODULE_4__/* .isServer */ .sk) {
    (0,_lib_bootstrap_client__WEBPACK_IMPORTED_MODULE_5__/* .bootstrap */ .U)();
}
function App({ Component , pageProps  }) {
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    react__WEBPACK_IMPORTED_MODULE_1__.useEffect(()=>{
        function onRouteChangeComplete() {
            if (_lib_config__WEBPACK_IMPORTED_MODULE_4__/* .fathomId */ .gr) {
                fathom_client__WEBPACK_IMPORTED_MODULE_3__.trackPageview();
            }
        }
        if (_lib_config__WEBPACK_IMPORTED_MODULE_4__/* .fathomId */ .gr) {
            fathom_client__WEBPACK_IMPORTED_MODULE_3__.load(_lib_config__WEBPACK_IMPORTED_MODULE_4__/* .fathomId */ .gr, _lib_config__WEBPACK_IMPORTED_MODULE_4__/* .fathomConfig */ .GH);
        }
        router.events.on("routeChangeComplete", onRouteChangeComplete);
        return ()=>{
            router.events.off("routeChangeComplete", onRouteChangeComplete);
        };
    }, [
        router.events
    ]);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Component, {
        ...pageProps
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9316:
/***/ ((module) => {

module.exports = require("fathom-client");

/***/ }),

/***/ 1853:
/***/ ((module) => {

module.exports = require("next/router");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 8751:
/***/ ((module) => {

module.exports = import("notion-utils");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [872], () => (__webpack_exec__(5656)));
module.exports = __webpack_exports__;

})();