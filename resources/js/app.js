import './bootstrap';
import "./lodash.full.min.js";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import htmlescape from "./mixin/htmlescape.js";
import isString from "./mixin/is_string.js";
import locale from 'element-ui/lib/locale';
import lang from 'element-ui/lib/locale/lang/ja';
import nl2br from "./mixin/nl2br.js";
import Vuex from "vuex";

// import Echo from "laravel-echo";
// window.Pusher = require("pusher-js");
// window.Echo = new Echo({
//     broadcaster: "pusher",
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     // encrypted: true
//     wsHost: window.location.hostname,
//     wsPort: 6001
// });

locale.use(lang)


window.Vue = require('vue');
window.Vuex = require("vuex");

Vue.use(require("mavon-editor"));
Vue.use(ElementUI);
Vue.use(Vuex);

Vue.mixin(htmlescape);
Vue.mixin(isString);
Vue.mixin(nl2br);

//require("./bootstrap");
require("mavon-editor/dist/css/index.css");

axios.defaults.headers.common = {
    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
}

Vue.prototype.count = (string, target) => {
    return string.split(target).length - 1;
}

// const app = new Vue({
//     el: "#app"
// })
