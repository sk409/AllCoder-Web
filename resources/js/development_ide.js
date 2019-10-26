import store from "./stores/development.js";
import FileTree from "./components/molecules/FileTree.vue"
import SourceCodeEditor from "./components/atoms/SourceCodeEditor.vue"
import SourceCodeEditorContextMenu from "./components/atoms/SourceCodeEditorContextMenu.vue"
import {
    mapMutations
} from "vuex";

new Vue({
    el: "#development-ide",
    store,
    components: {
        FileTree,
        SourceCodeEditor,
        SourceCodeEditorContextMenu
    },
    data: {
        sourceCodeEditorContextMenu: {
            startIndex: 0,
            endIndex: 0,
            style: {
                position: "absolute",
                left: "0",
                top: "0",
                background: "red"
            }
        },
    },
    // mounted() {
    //     const that = this;

    //     window.onbeforeunload = function () {
    //         axios.post("/development/unload/" + that.lesson.id);
    //     };

    // },
    methods: {
        ...mapMutations(["setSourceCodeEditor"]),
        showSourceCodeEditorContextMenu(x, y, startIndex, endIndex) {
            this.sourceCodeEditorContextMenu.style.left = x + "px";
            this.sourceCodeEditorContextMenu.style.top = y + "px";
            this.sourceCodeEditorContextMenu.startIndex = startIndex;
            this.sourceCodeEditorContextMenu.endIndex = endIndex;
            console.log(this.sourceCodeEditorContextMenuStyle)
        },
    }
});
