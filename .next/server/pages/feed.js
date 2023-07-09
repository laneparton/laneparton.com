"use strict";
(() => {
var exports = {};
exports.id = 986;
exports.ids = [986];
exports.modules = {

/***/ 7035:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "N": () => (/* binding */ getSocialImageUrl)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4872);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_config__WEBPACK_IMPORTED_MODULE_0__]);
_config__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

function getSocialImageUrl(pageId) {
    try {
        const url = new URL(_config__WEBPACK_IMPORTED_MODULE_0__/* .api.getSocialImage */ .hi.getSocialImage, _config__WEBPACK_IMPORTED_MODULE_0__/* .host */ .ho);
        if (pageId) {
            url.searchParams.set("id", pageId);
            return url.toString();
        }
    } catch (err) {
        console.warn("error invalid social image url", pageId, err.message);
    }
    return null;
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 7937:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "getServerSideProps": () => (/* binding */ getServerSideProps)
/* harmony export */ });
/* harmony import */ var notion_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8751);
/* harmony import */ var rss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3572);
/* harmony import */ var rss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(rss__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4872);
/* harmony import */ var _lib_get_site_map__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6655);
/* harmony import */ var _lib_get_social_image_url__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7035);
/* harmony import */ var _lib_map_page_url__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5595);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([notion_utils__WEBPACK_IMPORTED_MODULE_0__, _lib_config__WEBPACK_IMPORTED_MODULE_2__, _lib_get_site_map__WEBPACK_IMPORTED_MODULE_3__, _lib_get_social_image_url__WEBPACK_IMPORTED_MODULE_4__, _lib_map_page_url__WEBPACK_IMPORTED_MODULE_5__]);
([notion_utils__WEBPACK_IMPORTED_MODULE_0__, _lib_config__WEBPACK_IMPORTED_MODULE_2__, _lib_get_site_map__WEBPACK_IMPORTED_MODULE_3__, _lib_get_social_image_url__WEBPACK_IMPORTED_MODULE_4__, _lib_map_page_url__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);






const getServerSideProps = async ({ req , res  })=>{
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify({
            error: "method not allowed"
        }));
        res.end();
        return {
            props: {}
        };
    }
    const siteMap = await (0,_lib_get_site_map__WEBPACK_IMPORTED_MODULE_3__/* .getSiteMap */ .P)();
    const ttlMinutes = 24 * 60 // 24 hours
    ;
    const ttlSeconds = ttlMinutes * 60;
    const feed = new (rss__WEBPACK_IMPORTED_MODULE_1___default())({
        title: _lib_config__WEBPACK_IMPORTED_MODULE_2__/* .name */ .u2,
        site_url: _lib_config__WEBPACK_IMPORTED_MODULE_2__/* .host */ .ho,
        feed_url: `${_lib_config__WEBPACK_IMPORTED_MODULE_2__/* .host */ .ho}/feed.xml`,
        language: _lib_config__WEBPACK_IMPORTED_MODULE_2__/* .language */ .dK,
        ttl: ttlMinutes
    });
    for (const pagePath of Object.keys(siteMap.canonicalPageMap)){
        const pageId = siteMap.canonicalPageMap[pagePath];
        const recordMap = siteMap.pageMap[pageId];
        if (!recordMap) continue;
        const keys = Object.keys(recordMap?.block || {});
        const block = recordMap?.block?.[keys[0]]?.value;
        if (!block) continue;
        const parentPage = (0,notion_utils__WEBPACK_IMPORTED_MODULE_0__.getBlockParentPage)(block, recordMap);
        const isBlogPost = block.type === "page" && block.parent_table === "collection" && parentPage?.id === (0,notion_utils__WEBPACK_IMPORTED_MODULE_0__.idToUuid)(_lib_config__WEBPACK_IMPORTED_MODULE_2__/* .rootNotionPageId */ .AM);
        if (!isBlogPost) {
            continue;
        }
        const title = (0,notion_utils__WEBPACK_IMPORTED_MODULE_0__.getBlockTitle)(block, recordMap) || _lib_config__WEBPACK_IMPORTED_MODULE_2__/* .name */ .u2;
        const description = (0,notion_utils__WEBPACK_IMPORTED_MODULE_0__.getPageProperty)("Description", block, recordMap) || _lib_config__WEBPACK_IMPORTED_MODULE_2__/* .description */ .WL;
        const url = (0,_lib_map_page_url__WEBPACK_IMPORTED_MODULE_5__/* .getCanonicalPageUrl */ .K)(_lib_config__WEBPACK_IMPORTED_MODULE_2__/* .site */ .lz, recordMap)(pageId);
        const lastUpdatedTime = (0,notion_utils__WEBPACK_IMPORTED_MODULE_0__.getPageProperty)("Last Updated", block, recordMap);
        const publishedTime = (0,notion_utils__WEBPACK_IMPORTED_MODULE_0__.getPageProperty)("Published", block, recordMap);
        const date = lastUpdatedTime ? new Date(lastUpdatedTime) : publishedTime ? new Date(publishedTime) : undefined;
        const socialImageUrl = (0,_lib_get_social_image_url__WEBPACK_IMPORTED_MODULE_4__/* .getSocialImageUrl */ .N)(pageId);
        feed.item({
            title,
            url,
            date,
            description,
            enclosure: socialImageUrl ? {
                url: socialImageUrl,
                type: "image/jpeg"
            } : undefined
        });
    }
    const feedText = feed.xml({
        indent: true
    });
    res.setHeader("Cache-Control", `public, max-age=${ttlSeconds}, stale-while-revalidate=${ttlSeconds}`);
    res.setHeader("Content-Type", "text/xml; charset=utf-8");
    res.write(feedText);
    res.end();
    return {
        props: {}
    };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (()=>null);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 3572:
/***/ ((module) => {

module.exports = require("rss");

/***/ }),

/***/ 743:
/***/ ((module) => {

module.exports = import("notion-client");;

/***/ }),

/***/ 8751:
/***/ ((module) => {

module.exports = import("notion-utils");;

/***/ }),

/***/ 9726:
/***/ ((module) => {

module.exports = import("p-memoize");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [872,655,595], () => (__webpack_exec__(7937)));
module.exports = __webpack_exports__;

})();