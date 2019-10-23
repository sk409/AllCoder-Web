import store from "./stores/development.js";
import FileTree from "./components/molecules/FileTree.vue"
import SourceCodeEditor from "./components/atoms/SourceCodeEditor.vue"
import {
    mapMutations
} from "vuex";

new Vue({
    el: "#development",
    store,
    components: {
        FileTree,
        SourceCodeEditor
    },
    // mounted() {
    //     const that = this;

    //     window.onbeforeunload = function () {
    //         axios.post("/development/unload/" + that.lesson.id);
    //     };

    // },
    methods: {
        ...mapMutations(["setSourceCodeEditor"]),
    }
});
