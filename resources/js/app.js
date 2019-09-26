import './bootstrap';
import "./lodash.full.min.js";

window.Vue = require('vue');
axios.defaults.headers.common = {
    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
}
