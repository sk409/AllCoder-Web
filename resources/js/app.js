import './bootstrap';
import "./lodash.full.min.js";

window.Vue = require('vue');
window.Vuex = require("vuex");
Vue.use(require("mavon-editor"));
require("mavon-editor/dist/css/index.css");
axios.defaults.headers.common = {
    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
}
