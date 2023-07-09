"use strict";
exports.id = 655;
exports.ids = [655];
exports.modules = {

/***/ 6380:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "S": () => (/* binding */ getCanonicalPageId)
/* harmony export */ });
/* harmony import */ var notion_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8751);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4872);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([notion_utils__WEBPACK_IMPORTED_MODULE_0__, _config__WEBPACK_IMPORTED_MODULE_1__]);
([notion_utils__WEBPACK_IMPORTED_MODULE_0__, _config__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


function getCanonicalPageId(pageId, recordMap, { uuid =true  } = {}) {
    const cleanPageId = (0,notion_utils__WEBPACK_IMPORTED_MODULE_0__.parsePageId)(pageId, {
        uuid: false
    });
    if (!cleanPageId) {
        return null;
    }
    const override = _config__WEBPACK_IMPORTED_MODULE_1__/* .inversePageUrlOverrides */ .JN[cleanPageId];
    if (override) {
        return override;
    } else {
        return (0,notion_utils__WEBPACK_IMPORTED_MODULE_0__.getCanonicalPageId)(pageId, recordMap, {
            uuid
        });
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6655:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "P": () => (/* binding */ getSiteMap)
/* harmony export */ });
/* harmony import */ var notion_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8751);
/* harmony import */ var p_memoize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9726);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4872);
/* harmony import */ var _get_canonical_page_id__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6380);
/* harmony import */ var _notion_api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8730);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([notion_utils__WEBPACK_IMPORTED_MODULE_0__, p_memoize__WEBPACK_IMPORTED_MODULE_1__, _config__WEBPACK_IMPORTED_MODULE_2__, _get_canonical_page_id__WEBPACK_IMPORTED_MODULE_3__, _notion_api__WEBPACK_IMPORTED_MODULE_4__]);
([notion_utils__WEBPACK_IMPORTED_MODULE_0__, p_memoize__WEBPACK_IMPORTED_MODULE_1__, _config__WEBPACK_IMPORTED_MODULE_2__, _get_canonical_page_id__WEBPACK_IMPORTED_MODULE_3__, _notion_api__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);






const uuid = !!_config__WEBPACK_IMPORTED_MODULE_2__/* .includeNotionIdInUrls */ .IT;
async function getSiteMap() {
    const partialSiteMap = await getAllPages(_config__WEBPACK_IMPORTED_MODULE_2__/* .rootNotionPageId */ .AM, _config__WEBPACK_IMPORTED_MODULE_2__/* .rootNotionSpaceId */ .bY);
    return {
        site: _config__WEBPACK_IMPORTED_MODULE_2__/* .site */ .lz,
        ...partialSiteMap
    };
}
const getAllPages = (0,p_memoize__WEBPACK_IMPORTED_MODULE_1__["default"])(getAllPagesImpl, {
    cacheKey: (...args)=>JSON.stringify(args)
});
async function getAllPagesImpl(rootNotionPageId, rootNotionSpaceId) {
    const getPage = async (pageId, ...args)=>{
        console.log("\nnotion getPage", (0,notion_utils__WEBPACK_IMPORTED_MODULE_0__.uuidToId)(pageId));
        return _notion_api__WEBPACK_IMPORTED_MODULE_4__/* .notion.getPage */ .R.getPage(pageId, ...args);
    };
    const pageMap = await (0,notion_utils__WEBPACK_IMPORTED_MODULE_0__.getAllPagesInSpace)(rootNotionPageId, rootNotionSpaceId, getPage);
    const canonicalPageMap = Object.keys(pageMap).reduce((map, pageId)=>{
        const recordMap = pageMap[pageId];
        if (!recordMap) {
            throw new Error(`Error loading page "${pageId}"`);
        }
        const canonicalPageId = (0,_get_canonical_page_id__WEBPACK_IMPORTED_MODULE_3__/* .getCanonicalPageId */ .S)(pageId, recordMap, {
            uuid
        });
        if (map[canonicalPageId]) {
            // you can have multiple pages in different collections that have the same id
            // TODO: we may want to error if neither entry is a collection page
            console.warn("error duplicate canonical page id", {
                canonicalPageId,
                pageId,
                existingPageId: map[canonicalPageId]
            });
            return map;
        } else {
            return {
                ...map,
                [canonicalPageId]: pageId
            };
        }
    }, {});
    return {
        pageMap,
        canonicalPageMap
    };
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 8730:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "R": () => (/* binding */ notion)
/* harmony export */ });
/* harmony import */ var notion_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(743);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([notion_client__WEBPACK_IMPORTED_MODULE_0__]);
notion_client__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

const notion = new notion_client__WEBPACK_IMPORTED_MODULE_0__.NotionAPI({
    apiBaseUrl: process.env.NOTION_API_BASE_URL
});

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;