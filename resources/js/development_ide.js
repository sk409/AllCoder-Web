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
            isShown: false,
            startIndex: 0,
            endIndex: 0,
            style: {
                position: "absolute",
                left: "0",
                top: "0",
            }
        },
    },
    created() {
        axios.get("/folders/children?lesson_id=2&root=/").then(response => {
            console.log(response);
        });
    },
    methods: {
        ...mapMutations(["setSourceCodeEditor"]),
        showSourceCodeEditorContextMenu(x, y, startIndex, endIndex) {
            this.sourceCodeEditorContextMenu.isShown = true;
            this.sourceCodeEditorContextMenu.style.left = x + "px";
            this.sourceCodeEditorContextMenu.style.top = y + "px";
            this.sourceCodeEditorContextMenu.startIndex = startIndex;
            this.sourceCodeEditorContextMenu.endIndex = endIndex;
            console.log(this.sourceCodeEditorContextMenuStyle)
        },
        hideSourceCodeEditorContextMenu() {
            this.sourceCodeEditorContextMenu.isShown = false;
        }
    }
});
