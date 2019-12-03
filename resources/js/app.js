import './bootstrap';
import "./lodash.full.min.js";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import htmlescape from "./mixin/htmlescape.js";
import isString from "./mixin/is_string.js";
import locale from 'element-ui/lib/locale';
import lang from 'element-ui/lib/locale/lang/ja';
import nl2br from "./mixin/nl2br.js";

locale.use(lang)


window.Vue = require('vue');
window.Vuex = require("vuex");

Vue.use(require("mavon-editor"));
Vue.use(ElementUI);

Vue.mixin(htmlescape);
Vue.mixin(isString);
Vue.mixin(nl2br);

require("mavon-editor/dist/css/index.css");

axios.defaults.headers.common = {
    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
}
