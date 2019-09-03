<template>
    <div 
        id="development"
        class="container-fluid vh-100"
        v-on:click="onclick"
        v-on:keydown.meta.90.stop.prevent="onundo"
    >
        <div id="header" class="d-flex bg-light border-bottom p-2">
            <div class="d-flex align-items-center" contenteditable="true">
                {{ lessonTitle }}
            </div>
            <div class="ml-3 d-flex align-items-center">
                <button class="ml-2" type="button">ファイル</button>
                <button class="ml-2" type="button">ファイル</button>
                <button class="ml-2" type="button">ファイル</button>
            </div>
        </div>
        <div id="body" class="row">
            <div class="col-9 h-100 p-0">
                <div class="h-75 d-flex">
                    <div class="w-25 h-100">
                        <ul class="w-100 h-100">
                            <file-tree 
                                id="file-tree"
                                class="w-100 h-100"
                                :root-item="fileTree.rootItem"
                                @show-context-menu="showFileTreeContextMenu"
                                @set-file="setFile"
                            ></file-tree>
                        </ul>
                    </div>
                    <div class="w-75 h-100">
                        <source-code-editor
                            id="source-code-editor"
                            class="w-100 h-100"
                            :text="file ? file.text : ''"
                            :questions="questions"
                            :disabled="sourceCodeEditor.disabled"
                            @update-file-text="onUpdateFileText"
                            @show-context-menu.stop.prevent="showSourceCodeEditorContextMenu"
                            @set-is-clicked-to-false="setIsClickedToFalse"
                            @remove-questions="onRemoveQuestions"
                            @update-question="onUpdateQuestion"
                        ></source-code-editor>
                    </div>
                </div>
                <div class="h-25 d-flex">
                    <div id="questions-view" class="w-25">
                        <question-item v-for="question in questions" :key="question.id" :answer="question.answer"></question-item>
                    </div>
                    <div class="w-75">
                        <description
                            v-show="file"
                            :file-id="file ? file.id : null"
                            :descriptions="descriptions"
                        ></description>
                    </div>
                </div>
            </div>
            <div class="col p-0 h-100 bg-dark">
                
            </div>
        </div>
        <transition name="fade">
            <file-creation-view 
                v-show="fileCreationView.isShown"
                :lesson-id="lessonId"
                :item-id="fileTree.contextMenu.itemId"
                :item-children="fileTree.contextMenu.itemChildren"
                @cancel="onFlieCreationViewCancelButtonClick"
            ></file-creation-view>
        </transition>
        <file-tree-context-menu
            v-show="fileTree.contextMenu.isShown"
            :is-file="fileTree.contextMenu.isFile"
            :left="fileTree.contextMenu.left"
            :top="fileTree.contextMenu.top"
            :lesson-id="lessonId"
            :item-id="fileTree.contextMenu.itemId"
            :item-children="fileTree.contextMenu.itemChildren"
            @show-file-creation-view="onShowFileCreationView"
            @remove-file-tree-item="onRemoveFileTreeItem"
        ></file-tree-context-menu>
        <source-code-editor-context-menu
            v-show="sourceCodeEditor.contextMenu.isShown"
            :left="sourceCodeEditor.contextMenu.left"
            :top="sourceCodeEditor.contextMenu.top"
            @add-question="onAddQuestion"
        ></source-code-editor-context-menu>
    </div>
</template>

<script>
    import FileCreationView from "./file-tree/FileCreationView.vue";
    import FileTree from "./file-tree/FileTree.vue";
    import FileTreeContextMenu from "./file-tree/FileTreeContextMenu.vue";
    import SourceCodeEditor from "./editor/SourceCodeEditor.vue"
    import SourceCodeEditorContextMenu from "./editor/SourceCodeEditorContextMenu.vue"
    import FileTreeItemDeletable from "./file-tree/FileTreeItemDeletable.js";
    import FileTreeItemFetchable from "./file-tree/FileTreeItemFetchable.js";
    import FileUpdatable from "./file-tree/FileUpdatable.js";
    import QuestionItem from "./question/QuestionItem.vue";
    import QuestionAddable from "./question/QuestionAddable.js";
    import QuestionFetchable from "./question/QuestionFetchable.js";
    import QuestionUpdatable from "./question/QuestionUpdatable.js";
    import Description from "./description/Description.vue";
    import DescriptionFetchable from "./description/DescriptionFetchable.js";

    export default {
            name: "development-view",
            props: {
                lessonId: Number,
                lessonTitle: String,
            },
            data: function() {
                return {
                    file: null,
                    fileCreationView: {
                        isShown: false,
                    },
                    fileTree: {
                        rootItem: {
                            id: null,
                            isFile: false,
                            children: []
                        },
                        contextMenu: {
                            isFile: false,
                            isShown: false,
                            left: 0,
                            top: 0,
                            itemId: null,
                            itemChildren: null,
                        }
                    },
                    sourceCodeEditor: {
                        disabled: true,
                        contextMenu: {
                            isShown: false,
                            left: 0,
                            top: 0,
                            target: null,
                        },
                    },
                    questions: [],
                    isFetchingQuestions: false,
                    descriptions: null,
                }
            },
            mixins: [
                FileTreeItemDeletable,
                FileTreeItemFetchable,
                FileUpdatable,
                QuestionAddable,
                QuestionFetchable,
                QuestionUpdatable,
                DescriptionFetchable,
            ],
            components: {
                FileTreeContextMenu,
                FileTree,
                FileCreationView,
                SourceCodeEditorContextMenu,
                QuestionItem,
                SourceCodeEditor,
                Description,
            },
            created() {
                this.buildFileTree(this.lessonId, this.fileTree.rootItem);
            },
            methods: {
                onclick() {
                    //console.log("ONCLICK");
                    this.fileTree.contextMenu.isShown = false;
                    this.sourceCodeEditor.contextMenu.isShown = false;
                    this.sourceCodeEditor.isClicked = true;
                },
                onundo() {
                    alert("ごめんなさい!UNDO機能はまだ実装していません。");
                },
                onFlieCreationViewCancelButtonClick() {
                    this.fileCreationView.isShown = false;
                },
                onShowFileCreationView() {
                    this.fileCreationView.isShown = true;
                },
                onUpdateFileText(e) {
                    if (this.isFetchingQuestions) {
                        console.log("---------ERROR---------");
                        console.log("QuestionをFetch中です。");
                        console.log("---------ERROR---------");
                    }
                    this.file.text = e.target.value;
                    this.updateFileText(this.file.id, this.file.text);
                },
                onAddQuestion() {
                    const selectionStart = this.sourceCodeEditor.contextMenu.target.selectionStart;
                    const selectionEnd = this.sourceCodeEditor.contextMenu.target.selectionEnd;
                    const answer = this.sourceCodeEditor.contextMenu.target.value.substring(selectionStart, selectionEnd);
                    this.addQuestion(
                        selectionStart,
                        selectionEnd,
                        this.file.id,
                        (id => {
                        this.questions.push({
                            id,
                            hasUpdated: false,
                            startIndex: selectionStart,
                            endIndex: selectionEnd,
                            answer,
                        });
                    }));
                },
                onRemoveQuestions(questionIds) {
                    //console.log(this.questions);
                    const that = this;
                    questionIds.forEach(questionId => {
                        that.questions = that.questions.filter(question => question.id !== questionId)
                    });
                    //console.log(this.questions);
                },
                onUpdateQuestion(id, startIndex, endIndex) {
                    let question = null;
                    if (question = this.questions.find(question => question.id === id)) {
                        question.hasUpdated = true;
                        question.startIndex = startIndex;
                        question.endIndex = endIndex;
                        question.answer = this.file.text.substring(question.startIndex, question.endIndex);
                        this.questions = this.questions;
                    }
                },
                onRemoveFileTreeItem(id, isFile) {
                    //console.log(id);
                    const that = this;
                    const deleter = function(item) {
                        if (item.isFile) {
                            if (that.file.id === item.id) {
                                that.file = null;
                                that.sourceCodeEditor.disabled = true;
                            }
                            that.deleteFile(item.id);
                        } else {
                            that.deleteFolder(item.id);
                        }
                        item.children.forEach(child => {
                            deleter(child);
                        });
                    };
                    const remover = function(item) {
                        let found = false;
                        for(let index = 0; index < item.children.length; ++index) {
                            if ((item.children[index].id === id) && (item.children[index].isFile === isFile)) {
                                found = true;
                                deleter(item.children[index]);
                                item.children.splice(index, 1);
                                break;
                            }
                        }
                        if (found) {
                            return true;
                        } else {
                            for(let index = 0; index < item.children.length; ++index) {
                                if (remover(item.children[index])) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    }
                    remover(this.fileTree.rootItem);
                },
                showFileTreeContextMenu(isFile, originX, originY, itemId, itemChildren) {
                    this.fileTree.contextMenu.isFile = isFile;
                    this.fileTree.contextMenu.isShown = true;
                    this.fileTree.contextMenu.left = originX;
                    this.fileTree.contextMenu.top = originY;
                    this.fileTree.contextMenu.itemId = itemId;
                    this.fileTree.contextMenu.itemChildren = itemChildren;
                },
                showSourceCodeEditorContextMenu(e) {
                    this.sourceCodeEditor.contextMenu.isShown = true;
                    this.sourceCodeEditor.contextMenu.left = e.pageX;
                    this.sourceCodeEditor.contextMenu.top = e.pageY;
                    this.sourceCodeEditor.contextMenu.target = e.target;
                },
                setFile(file) {
                    this.file = file;
                    this.questions = [];
                    this.isFetchingQuestions = true;
                    const that = this;
                    this.fetchQuestions(file.id, (response => {
                        //console.log(response);
                        that.questions.push(...response.data.map(question => {
                            return {
                                id: question.id,
                                hasUpdated: false,
                                startIndex: question.start_index,
                                endIndex: question.end_index,
                                answer: that.file.text.substring(question.start_index, question.end_index),
                            };
                        }));
                        that.isFetchingQuestions = false;
                    }));
                    this.fetchDescriptions(file.id, descriptions => {
                        that.descriptions = descriptions;
                    });
                    this.sourceCodeEditor.disabled = false;
                },
                setIsClickedToFalse() {
                    this.sourceCodeEditor.isClicked = false;
                },
            },
    };
</script>