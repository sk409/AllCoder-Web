import DevelopmentView from "./DevelopmentView.vue";
import store from "../stores/development.js";
new Vue({
    el: "#development",
    store,
    components: {
        DevelopmentView
    }
});

// import DevelopmentView from "./DevelopmentView.vue";

// new Vue({
//     el: "#development",
//     components: {
//         DevelopmentView,
//     }
// });
