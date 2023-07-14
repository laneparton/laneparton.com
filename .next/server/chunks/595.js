"use strict";
exports.id = 595;
exports.ids = [595];
exports.modules = {

/***/ 5595:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "K": () => (/* binding */ getCanonicalPageUrl),
/* harmony export */   "O": () => (/* binding */ mapPageUrl)
/* harmony export */ });
/* harmony import */ var notion_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8751);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4872);
/* harmony import */ var _get_canonical_page_id__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6380);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([notion_utils__WEBPACK_IMPORTED_MODULE_0__, _config__WEBPACK_IMPORTED_MODULE_1__, _get_canonical_page_id__WEBPACK_IMPORTED_MODULE_2__]);
([notion_utils__WEBPACK_IMPORTED_MODULE_0__, _config__WEBPACK_IMPORTED_MODULE_1__, _get_canonical_page_id__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



// include UUIDs in page URLs during local development but not in production
// (they're nice for debugging and speed up local dev)
const uuid = !!_config__WEBPACK_IMPORTED_MODULE_1__/* .includeNotionIdInUrls */ .IT;
const mapPageUrl = (site, recordMap, searchParams)=>(pageId = "")=>{
        const pageUuid = (0,notion_utils__WEBPACK_IMPORTED_MODULE_0__.parsePageId)(pageId, {
            uuid: true
        });
        if ((0,notion_utils__WEBPACK_IMPORTED_MODULE_0__.uuidToId)(pageUuid) === site.rootNotionPageId) {
            return createUrl("/", searchParams);
        } else {
            return createUrl(`/${(0,_get_canonical_page_id__WEBPACK_IMPORTED_MODULE_2__/* .getCanonicalPageId */ .S)(pageUuid, recordMap, {
                uuid
            })}`, searchParams);
        }
    };
const getCanonicalPageUrl = (site, recordMap)=>(pageId = "")=>{
        const pageUuid = (0,notion_utils__WEBPACK_IMPORTED_MODULE_0__.parsePageId)(pageId, {
            uuid: true
        });
        if ((0,notion_utils__WEBPACK_IMPORTED_MODULE_0__.uuidToId)(pageId) === site.rootNotionPageId) {
            return `https://${site.domain}`;
        } else {
            return `https://${site.domain}/${(0,_get_canonical_page_id__WEBPACK_IMPORTED_MODULE_2__/* .getCanonicalPageId */ .S)(pageUuid, recordMap, {
                uuid
            })}`;
        }
    };
function createUrl(path, searchParams) {
    return [
        path,
        searchParams.toString()
    ].filter(Boolean).join("?");
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;