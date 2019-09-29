import File from "../models/File.js";
import Folder from "../models/Folder.js";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        sourceCodeEditor: null,
        editedFile: null,
    },
    actions: {
        async setEditedFile({
            commit
        }, path) {
            const response = await File.index({
                path
            });
            commit("setEditedFile", response.data);
        },
    },
    mutations: {
        setSourceCodeEditor(state, payload) {
            state.sourceCodeEditor = payload.sourceCodeEditor
            state.sourceCodeEditor.$blockScrolling = Infinity;
            state.sourceCodeEditor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true
            });
            state.sourceCodeEditor.setTheme(payload.theme ? payload.theme : "ace/theme/monokai");
            // state.sourceCodeEditor.session.on("change", delta => {
            //     if (
            //         delta.action === "insert" &&
            //         that.sourceCodeEditor.file.txt !== that.sourceCodeEditor.getValue()
            //     ) {
            //         that.sourceCodeEditor.file.text = that.sourceCodeEditor.getValue();
            //         that.sourceCodeEditor.file.update();
            //     }
            // });
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
    },
})
