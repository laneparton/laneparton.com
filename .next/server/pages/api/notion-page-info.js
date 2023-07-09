"use strict";
(() => {
var exports = {};
exports.id = 38;
exports.ids = [38];
exports.modules = {

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

/***/ 5574:
/***/ ((module) => {

module.exports = import("react-notion-x");;

/***/ }),

/***/ 7421:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var got__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(868);
/* harmony import */ var notion_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8751);
/* harmony import */ var _lib_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(885);
/* harmony import */ var _lib_map_image_url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4155);
/* harmony import */ var _lib_notion_api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8091);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([got__WEBPACK_IMPORTED_MODULE_0__, notion_utils__WEBPACK_IMPORTED_MODULE_1__, _lib_config__WEBPACK_IMPORTED_MODULE_2__, _lib_map_image_url__WEBPACK_IMPORTED_MODULE_3__, _lib_notion_api__WEBPACK_IMPORTED_MODULE_4__]);
([got__WEBPACK_IMPORTED_MODULE_0__, notion_utils__WEBPACK_IMPORTED_MODULE_1__, _lib_config__WEBPACK_IMPORTED_MODULE_2__, _lib_map_image_url__WEBPACK_IMPORTED_MODULE_3__, _lib_notion_api__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async (req, res)=>{
    if (req.method !== "POST") {
        return res.status(405).send({
            error: "method not allowed"
        });
    }
    const pageId = (0,notion_utils__WEBPACK_IMPORTED_MODULE_1__.parsePageId)(req.body.pageId);
    if (!pageId) {
        throw new Error("Invalid notion page id");
    }
    const recordMap = await _lib_notion_api__WEBPACK_IMPORTED_MODULE_4__/* .notion.getPage */ .R.getPage(pageId);
    const keys = Object.keys(recordMap?.block || {});
    const block = recordMap?.block?.[keys[0]]?.value;
    if (!block) {
        throw new Error("Invalid recordMap for page");
    }
    const blockSpaceId = block.space_id;
    if (blockSpaceId && _lib_config__WEBPACK_IMPORTED_MODULE_2__/* .rootNotionSpaceId */ .bY && blockSpaceId !== _lib_config__WEBPACK_IMPORTED_MODULE_2__/* .rootNotionSpaceId */ .bY) {
        return res.status(400).send({
            error: `Notion page "${pageId}" belongs to a different workspace.`
        });
    }
    const isBlogPost = block.type === "page" && block.parent_table === "collection";
    const title = (0,notion_utils__WEBPACK_IMPORTED_MODULE_1__.getBlockTitle)(block, recordMap) || _lib_config__WEBPACK_IMPORTED_MODULE_2__/* .name */ .u2;
    const imageCoverPosition = block.format?.page_cover_position ?? _lib_config__WEBPACK_IMPORTED_MODULE_2__/* .defaultPageCoverPosition */ .Wx;
    const imageObjectPosition = imageCoverPosition ? `center ${(1 - imageCoverPosition) * 100}%` : null;
    const imageBlockUrl = (0,_lib_map_image_url__WEBPACK_IMPORTED_MODULE_3__/* .mapImageUrl */ .H)((0,notion_utils__WEBPACK_IMPORTED_MODULE_1__.getPageProperty)("Social Image", block, recordMap) || block.format?.page_cover, block);
    const imageFallbackUrl = (0,_lib_map_image_url__WEBPACK_IMPORTED_MODULE_3__/* .mapImageUrl */ .H)(_lib_config__WEBPACK_IMPORTED_MODULE_2__/* .defaultPageCover */ .yN, block);
    const blockIcon = (0,notion_utils__WEBPACK_IMPORTED_MODULE_1__.getBlockIcon)(block, recordMap);
    const authorImageBlockUrl = (0,_lib_map_image_url__WEBPACK_IMPORTED_MODULE_3__/* .mapImageUrl */ .H)(blockIcon && (0,notion_utils__WEBPACK_IMPORTED_MODULE_1__.isUrl)(blockIcon) ? blockIcon : null, block);
    const authorImageFallbackUrl = (0,_lib_map_image_url__WEBPACK_IMPORTED_MODULE_3__/* .mapImageUrl */ .H)(_lib_config__WEBPACK_IMPORTED_MODULE_2__/* .defaultPageIcon */ .SH, block);
    const [authorImage, image] = await Promise.all([
        getCompatibleImageUrl(authorImageBlockUrl, authorImageFallbackUrl),
        getCompatibleImageUrl(imageBlockUrl, imageFallbackUrl)
    ]);
    const author = (0,notion_utils__WEBPACK_IMPORTED_MODULE_1__.getPageProperty)("Author", block, recordMap) || _lib_config__WEBPACK_IMPORTED_MODULE_2__/* .author */ .v;
    // const socialDescription =
    //   getPageProperty<string>('Description', block, recordMap) ||
    //   libConfig.description
    // const lastUpdatedTime = getPageProperty<number>(
    //   'Last Updated',
    //   block,
    //   recordMap
    // )
    const publishedTime = (0,notion_utils__WEBPACK_IMPORTED_MODULE_1__.getPageProperty)("Published", block, recordMap);
    const datePublished = publishedTime ? new Date(publishedTime) : undefined;
    // const dateUpdated = lastUpdatedTime
    //   ? new Date(lastUpdatedTime)
    //   : publishedTime
    //   ? new Date(publishedTime)
    //   : undefined
    const date = isBlogPost && datePublished ? `${datePublished.toLocaleString("en-US", {
        month: "long"
    })} ${datePublished.getFullYear()}` : undefined;
    const detail = date || author || _lib_config__WEBPACK_IMPORTED_MODULE_2__/* .domain */ .nw;
    const pageInfo = {
        pageId,
        title,
        image,
        imageObjectPosition,
        author,
        authorImage,
        detail
    };
    res.setHeader("Cache-Control", "public, s-maxage=3600, max-age=3600, stale-while-revalidate=3600");
    res.status(200).json(pageInfo);
});
async function isUrlReachable(url) {
    if (!url) {
        return false;
    }
    try {
        await got__WEBPACK_IMPORTED_MODULE_0__["default"].head(url);
        return true;
    } catch (err) {
        return false;
    }
}
async function getCompatibleImageUrl(url, fallbackUrl) {
    const image = await isUrlReachable(url) ? url : fallbackUrl;
    if (image) {
        const imageUrl = new URL(image);
        if (imageUrl.host === "images.unsplash.com") {
            if (!imageUrl.searchParams.has("w")) {
                imageUrl.searchParams.set("w", "1200");
                imageUrl.searchParams.set("fit", "max");
                return imageUrl.toString();
            }
        }
    }
    return image;
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [845], () => (__webpack_exec__(7421)));
module.exports = __webpack_exports__;

})();