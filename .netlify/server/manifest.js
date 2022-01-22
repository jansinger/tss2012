var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  manifest: () => manifest
});
const manifest = {
  appDir: "_app",
  assets: new Set(["data/logbook_geo.json", "data/segelsommer2012.geojson", "data/segelsommer2012.kml", "favicon.png", "pics/sailing.png"]),
  _: {
    mime: { ".json": "application/json", ".geojson": "application/geo+json", ".kml": "application/vnd.google-earth.kml+xml", ".png": "image/png" },
    entry: { "file": "start-247eafe7.js", "js": ["start-247eafe7.js", "chunks/vendor-293183b8.js", "chunks/preload-helper-ec9aa979.js"], "css": ["assets/vendor-a2c515ad.css"] },
    nodes: [
      () => Promise.resolve().then(() => __toModule(require("./nodes/0.js"))),
      () => Promise.resolve().then(() => __toModule(require("./nodes/1.js"))),
      () => Promise.resolve().then(() => __toModule(require("./nodes/2.js")))
    ],
    routes: [
      {
        type: "page",
        pattern: /^\/$/,
        params: null,
        path: "/",
        a: [0, 2],
        b: [1]
      },
      {
        type: "endpoint",
        pattern: /^\/logentry\/([^/]+?)\.json$/,
        params: (m) => ({ id: m[1] }),
        load: () => Promise.resolve().then(() => __toModule(require("./entries/endpoints/logentry/_id_.json.ts.js")))
      }
    ]
  }
};
