"use strict";
(() => {
var exports = {};
exports.id = 119;
exports.ids = [119];
exports.modules = {

/***/ 3050:
/***/ ((module) => {

module.exports = require("@keyvhq/core");

/***/ }),

/***/ 1888:
/***/ ((module) => {

module.exports = require("@keyvhq/redis");

/***/ }),

/***/ 1253:
/***/ ((module) => {

module.exports = require("lqip-modern");

/***/ }),

/***/ 868:
/***/ ((module) => {

module.exports = import("got");;

/***/ }),

/***/ 743:
/***/ ((module) => {

module.exports = import("notion-client");;

/***/ }),

/***/ 8751:
/***/ ((module) => {

module.exports = import("notion-utils");;

/***/ }),

/***/ 8098:
/***/ ((module) => {

module.exports = import("p-map");;

/***/ }),

/***/ 9726:
/***/ ((module) => {

module.exports = import("p-memoize");;

/***/ }),

/***/ 5574:
/***/ ((module) => {

module.exports = import("react-notion-x");;

/***/ }),

/***/ 2263:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "db": () => (/* binding */ db)
/* harmony export */ });
/* harmony import */ var _keyvhq_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3050);
/* harmony import */ var _keyvhq_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_keyvhq_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _keyvhq_redis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1888);
/* harmony import */ var _keyvhq_redis__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_keyvhq_redis__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(885);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_config__WEBPACK_IMPORTED_MODULE_2__]);
_config__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];



let db;
if (_config__WEBPACK_IMPORTED_MODULE_2__/* .isRedisEnabled */ .YZ) {
    const keyvRedis = new (_keyvhq_redis__WEBPACK_IMPORTED_MODULE_1___default())(_config__WEBPACK_IMPORTED_MODULE_2__/* .redisUrl */ .Xc);
    db = new (_keyvhq_core__WEBPACK_IMPORTED_MODULE_0___default())({
        store: keyvRedis,
        namespace: _config__WEBPACK_IMPORTED_MODULE_2__/* .redisNamespace */ .VO || undefined
    });
} else {
    db = new (_keyvhq_core__WEBPACK_IMPORTED_MODULE_0___default())();
}


__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 2914:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "y": () => (/* binding */ search)
/* harmony export */ });
/* unused harmony export getPage */
/* harmony import */ var notion_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8751);
/* harmony import */ var p_map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8098);
/* harmony import */ var p_memoize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9726);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(885);
/* harmony import */ var _notion_api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8091);
/* harmony import */ var _preview_images__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4082);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([notion_utils__WEBPACK_IMPORTED_MODULE_0__, p_map__WEBPACK_IMPORTED_MODULE_1__, p_memoize__WEBPACK_IMPORTED_MODULE_2__, _config__WEBPACK_IMPORTED_MODULE_3__, _notion_api__WEBPACK_IMPORTED_MODULE_4__, _preview_images__WEBPACK_IMPORTED_MODULE_5__]);
([notion_utils__WEBPACK_IMPORTED_MODULE_0__, p_map__WEBPACK_IMPORTED_MODULE_1__, p_memoize__WEBPACK_IMPORTED_MODULE_2__, _config__WEBPACK_IMPORTED_MODULE_3__, _notion_api__WEBPACK_IMPORTED_MODULE_4__, _preview_images__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);






const getNavigationLinkPages = (0,p_memoize__WEBPACK_IMPORTED_MODULE_2__["default"])(async ()=>{
    const navigationLinkPageIds = (_config__WEBPACK_IMPORTED_MODULE_3__/* .navigationLinks */ .tg || []).map((link)=>link.pageId).filter(Boolean);
    if (_config__WEBPACK_IMPORTED_MODULE_3__/* .navigationStyle */ .wW !== "default" && navigationLinkPageIds.length) {
        return (0,p_map__WEBPACK_IMPORTED_MODULE_1__["default"])(navigationLinkPageIds, async (navigationLinkPageId)=>_notion_api__WEBPACK_IMPORTED_MODULE_4__/* .notion.getPage */ .R.getPage(navigationLinkPageId, {
                chunkLimit: 1,
                fetchMissingBlocks: false,
                fetchCollections: false,
                signFileUrls: false
            }), {
            concurrency: 4
        });
    }
    return [];
});
async function getPage(pageId) {
    let recordMap = await notion.getPage(pageId);
    if (navigationStyle !== "default") {
        // ensure that any pages linked to in the custom navigation header have
        // their block info fully resolved in the page record map so we know
        // the page title, slug, etc.
        const navigationLinkRecordMaps = await getNavigationLinkPages();
        if (navigationLinkRecordMaps?.length) {
            recordMap = navigationLinkRecordMaps.reduce((map, navigationLinkRecordMap)=>mergeRecordMaps(map, navigationLinkRecordMap), recordMap);
        }
    }
    if (isPreviewImageSupportEnabled) {
        const previewImageMap = await getPreviewImageMap(recordMap);
        recordMap.preview_images = previewImageMap;
    }
    return recordMap;
}
async function search(params) {
    return _notion_api__WEBPACK_IMPORTED_MODULE_4__/* .notion.search */ .R.search(params);
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4082:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* unused harmony exports getPreviewImageMap, getPreviewImage */
/* harmony import */ var got__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(868);
/* harmony import */ var lqip_modern__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1253);
/* harmony import */ var lqip_modern__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lqip_modern__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var notion_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8751);
/* harmony import */ var p_map__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8098);
/* harmony import */ var p_memoize__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9726);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(885);
/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2263);
/* harmony import */ var _map_image_url__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(4155);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([got__WEBPACK_IMPORTED_MODULE_0__, notion_utils__WEBPACK_IMPORTED_MODULE_2__, p_map__WEBPACK_IMPORTED_MODULE_3__, p_memoize__WEBPACK_IMPORTED_MODULE_4__, _config__WEBPACK_IMPORTED_MODULE_5__, _db__WEBPACK_IMPORTED_MODULE_6__, _map_image_url__WEBPACK_IMPORTED_MODULE_7__]);
([got__WEBPACK_IMPORTED_MODULE_0__, notion_utils__WEBPACK_IMPORTED_MODULE_2__, p_map__WEBPACK_IMPORTED_MODULE_3__, p_memoize__WEBPACK_IMPORTED_MODULE_4__, _config__WEBPACK_IMPORTED_MODULE_5__, _db__WEBPACK_IMPORTED_MODULE_6__, _map_image_url__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);








async function getPreviewImageMap(recordMap) {
    const urls = getPageImageUrls(recordMap, {
        mapImageUrl
    }).concat([
        defaultPageIcon,
        defaultPageCover
    ]).filter(Boolean);
    const previewImagesMap = Object.fromEntries(await pMap(urls, async (url)=>{
        const cacheKey = normalizeUrl(url);
        return [
            cacheKey,
            await getPreviewImage(url, {
                cacheKey
            })
        ];
    }, {
        concurrency: 8
    }));
    return previewImagesMap;
}
async function createPreviewImage(url, { cacheKey  }) {
    try {
        try {
            const cachedPreviewImage = await _db__WEBPACK_IMPORTED_MODULE_6__.db.get(cacheKey);
            if (cachedPreviewImage) {
                return cachedPreviewImage;
            }
        } catch (err) {
            // ignore redis errors
            console.warn(`redis error get "${cacheKey}"`, err.message);
        }
        const { body  } = await (0,got__WEBPACK_IMPORTED_MODULE_0__["default"])(url, {
            responseType: "buffer"
        });
        const result = await lqip_modern__WEBPACK_IMPORTED_MODULE_1___default()(body);
        console.log("lqip", {
            ...result.metadata,
            url,
            cacheKey
        });
        const previewImage = {
            originalWidth: result.metadata.originalWidth,
            originalHeight: result.metadata.originalHeight,
            dataURIBase64: result.metadata.dataURIBase64
        };
        try {
            await _db__WEBPACK_IMPORTED_MODULE_6__.db.set(cacheKey, previewImage);
        } catch (err1) {
            // ignore redis errors
            console.warn(`redis error set "${cacheKey}"`, err1.message);
        }
        return previewImage;
    } catch (err2) {
        console.warn("failed to create preview image", url, err2.message);
        return null;
    }
}
const getPreviewImage = (0,p_memoize__WEBPACK_IMPORTED_MODULE_4__["default"])(createPreviewImage);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6649:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_notion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2914);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_notion__WEBPACK_IMPORTED_MODULE_0__]);
_lib_notion__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async (req, res)=>{
    if (req.method !== "POST") {
        return res.status(405).send({
            error: "method not allowed"
        });
    }
    const searchParams = req.body;
    console.log("<<< lambda search-notion", searchParams);
    const results = await (0,_lib_notion__WEBPACK_IMPORTED_MODULE_0__/* .search */ .y)(searchParams);
    console.log(">>> lambda search-notion", results);
    res.setHeader("Cache-Control", "public, s-maxage=60, max-age=60, stale-while-revalidate=60");
    res.status(200).json(results);
});

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [845], () => (__webpack_exec__(6649)));
module.exports = __webpack_exports__;

})();