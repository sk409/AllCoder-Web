// import DevelopmentView from "./DevelopmentView.vue";

// new Vue({
//         el: "#development",
//         components: {DevelopmentView},
// });

import Description from "./description/Description.js";
import DescriptionEditor from "./description/DescriptionEditor.vue";
import DescriptionTarget from "./description/DescriptionTarget.js";
import DescriptionTargetItem from "./description/DescriptionTargetItem.vue";
import FileCreationView from "./file-tree/FileCreationView.vue";
import FileTree from "./file-tree/FileTree.vue";
import FileTreeContextMenu from "./file-tree/FileTreeContextMenu.vue";
import InputButton from "./question/InputButton.js";
import Question from "./question/Question.js";
import QuestionItem from "./question/QuestionItem.vue";
import SourceCodeEditor from "./source-code-editor/SourceCodeEditor.vue";
import SourceCodeEditorContextMenu from "./source-code-editor/SourceCodeEditorContextMenu.vue";

new Vue({
    el: "#development",
    components: {
        FileTreeContextMenu,
        FileTree,
        FileCreationView,
        SourceCodeEditorContextMenu,
        QuestionItem,
        SourceCodeEditor,
        DescriptionEditor,
        DescriptionTargetItem
    },
    data: {
        file: null,
        descriptions: null,
        fileCreationView: {
            isShown: false
        },
        fileTree: {
            contextMenu: {
                isShown: false,
                left: 0,
                top: 0,
                item: null
            }
        },
        sourceCodeEditor: {
            disabled: true,
            contextMenu: {
                isShown: false,
                left: 0,
                top: 0,
                selection: {}
            }
        }
    },
    computed: {
        questions() {
            return this.descriptions ?
                this.descriptions
                .map(description => description.questions)
                .flat() : [];
        },
        descriptionTargets() {
            return this.descriptions ?
                this.descriptions
                .map(description => description.targets)
                .flat() : [];
        },
        selectedDescription() {
            return this.descriptions ?
                this.descriptions.find(description => description.isSelected) :
                null;
        }
    },
    methods: {
        onclick() {
            this.fileTree.contextMenu.isShown = false;
            if (this.fileTree.contextMenu.item && this.fileTree.contextMenu.item.isNameEditable) {
                this.fileTree.contextMenu.item.isNameEditable = false;
                this.fileTree.contextMenu.item.input.blur();
            }
            this.sourceCodeEditor.contextMenu.isShown = false;
            this.sourceCodeEditor.isClicked = true;
        },
        onOpenConsoleTab(portNumber) {
            const window = open("localhost:" + portNumber);
            //window.focus();
            //window.location.reload();
            //open("https://google.com");
        },
        onOpenPreviewTab(portNumber) {
            open("localhost:" + portNumber);
        },
        onundo() {
            alert("ごめんなさい!UNDO機能はまだ実装していません。");
        },
        onSelectDescription(id) {
            const that = this;
            const unselectDescriptions = function () {
                that.descriptions.forEach(description => {
                    description.isSelected = false;
                });
            };
            if (id === null) {
                unselectDescriptions();
                return;
            }
            const description = this.descriptions.find(
                description => description.id === id
            );
            if (!description) {
                return;
            }
            unselectDescriptions();
            description.isSelected = true;
        },
        onSetFile(file) {
            this.file = file;
            const that = this;
            Description.index({
                file_id: file.id
            }, response => {
                that.descriptions = response.data.map(data => {
                    const description = new Description(
                        data.id,
                        data.index,
                        data.text,
                        data.file_id
                    );
                    DescriptionTarget.index({
                            description_id: description.id
                        },
                        response => {
                            description.targets.push(
                                ...response.data.map(descriptionTarget => {
                                    return new DescriptionTarget(
                                        descriptionTarget.id,
                                        descriptionTarget.start_index,
                                        descriptionTarget.end_index,
                                        description.id,
                                        file.text.substring(
                                            descriptionTarget.start_index,
                                            descriptionTarget.end_index
                                        )
                                    );
                                })
                            );
                            Question.index({
                                    description_id: description.id
                                },
                                response => {
                                    response.data.forEach(question => {
                                        InputButton.index({
                                                question_id: question.id
                                            },
                                            response => {
                                                const inputButtons = response.data.map(
                                                    inputButton => {
                                                        return new InputButton(
                                                            inputButton.id,
                                                            inputButton.index,
                                                            inputButton.start_index,
                                                            inputButton.end_index,
                                                            inputButton.line_number,
                                                            inputButton.question_id,
                                                            file.text.substring(
                                                                inputButton.start_index,
                                                                inputButton.end_index
                                                            )
                                                        );
                                                    }
                                                );
                                                description.questions.push(
                                                    new Question(
                                                        question.id,
                                                        question.index,
                                                        question.description_id,
                                                        inputButtons
                                                    )
                                                );
                                            }
                                        );
                                    });
                                    // return new Question(
                                    //   question.id,
                                    //   question.start_index,
                                    //   question.end_index,
                                    //   question.description_id,
                                    //   that.file.text.substring(
                                    //     question.start_index,
                                    //     question.end_index
                                    //   )
                                    // );
                                }
                            );
                        }
                    );
                    return description;
                });
            });
            this.sourceCodeEditor.disabled = false;
        },
        onShowFileTreeContextMenu(e, item) {
            this.fileTree.contextMenu.isShown = true;
            this.fileTree.contextMenu.left = e.pageX;
            this.fileTree.contextMenu.top = e.pageY;
            this.fileTree.contextMenu.item = item;
        },
        onShowFileCreationView() {
            this.fileCreationView.isShown = true;
        },
        onHideFileCreationView() {
            this.fileCreationView.isShown = false;
        },
        onShowSourceCodeEditorContextMenu(e) {
            this.sourceCodeEditor.contextMenu.isShown = true;
            this.sourceCodeEditor.contextMenu.left = e.pageX;
            this.sourceCodeEditor.contextMenu.top = e.pageY;
            this.sourceCodeEditor.contextMenu.selection.startIndex =
                e.target.selectionStart;
            this.sourceCodeEditor.contextMenu.selection.endIndex =
                e.target.selectionEnd;
        }
    }
});
