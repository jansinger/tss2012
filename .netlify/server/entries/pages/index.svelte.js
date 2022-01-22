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
  default: () => Routes
});
var import_index_d91e651d = __toModule(require("../../chunks/index-d91e651d.js"));
var import_ol = __toModule(require("ol"));
var LogbookEntry_svelte_svelte_type_style_lang = "";
var LogbookMap_svelte_svelte_type_style_lang = "";
const css = {
  code: "@import 'ol/ol.css';.map.svelte-gxnlmq{position:absolute;top:0;bottom:0;width:100%}.tooltip.svelte-gxnlmq{width:120px;background-color:gray;color:#fff;text-align:center;padding:5px;border-radius:6px;position:absolute;z-index:1;font-size:0.8em}",
  map: null
};
const LogbookMap = (0, import_index_d91e651d.c)(($$result, $$props, $$bindings, slots) => {
  (0, import_index_d91e651d.a)();
  let mapElement, tooltipElement;
  $$result.css.add(css);
  return `<div class="${"map svelte-gxnlmq"}"${(0, import_index_d91e651d.b)("this", mapElement, 0)}></div>
<div class="${"tooltip svelte-gxnlmq"}"${(0, import_index_d91e651d.b)("this", tooltipElement, 0)}></div>`;
});
var Modal_svelte_svelte_type_style_lang = "";
const Routes = (0, import_index_d91e651d.c)(($$result, $$props, $$bindings, slots) => {
  return `${(0, import_index_d91e651d.v)(LogbookMap, "LoogbookMap").$$render($$result, {}, {}, {})}

${``}`;
});
