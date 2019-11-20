import File from "../models/file.js";
import Folder from "../models/folder.js";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        sourceCodeEditor: null,
        editedFile: null,
    },
    actions: {
        setEditedFile({
            commit
        }, editedFile) {
            commit("setEditedFile", editedFile);
        },
    },
    mutations: {
        setSourceCodeEditor(state, payload) {
            state.sourceCodeEditor = payload.sourceCodeEditor
            state.sourceCodeEditor.$blockScrolling = Infinity;
            state.sourceCodeEditor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true,
                fontSize: "0.8rem",
            });
            state.sourceCodeEditor.setTheme(payload.theme ? payload.theme : "ace/theme/chaos");
            state.sourceCodeEditor.setReadOnly(true);
        },
        setEditedFile(state, file) {
            state.editedFile = file;
            state.sourceCodeEditor.setReadOnly(false);
            state.sourceCodeEditor.setValue(file.text);
            const modes = {
                js: "javascript",
                php: "php",
                html: "html",
                css: "css",
                scss: "scss",
                vue: "vue",
                json: "json",
                xml: "xml"
            };
            const pathComponents = file.path.split(".");
            const extension = pathComponents.slice(-1)[0];
            state.sourceCodeEditor.getSession().setMode("ace/mode/" + modes[extension]);
        },
        setEditedFileText(state, text) {
            state.editedFile.text = text;
        }
    },
})
