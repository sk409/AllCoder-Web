<template>
    <div id="development" class="container-fluid vh-100" v-on:click="onclick">
        <div id="header" class="d-flex bg-light border-bottom p-2">
            <div class="d-flex align-items-center" contenteditable="true">
                {{ lessonTitle }}
            </div>
            <div class="ml-3 d-flex align-items-center">
                <button class="ml-2" type="button">ファイル</button>
                <button class="ml-2" type="button">ファイル</button>
                <button class="ml-2" type="button">ファイル</button>
            </div>
            <div class="ml-auto d-flex align-items-center">
                <a :href="dashboardUrl" class="btn text-secondary">ホーム</a>
            </div>
        </div>
        <div id="body" class="row">
            <div class="col-9 h-100 p-0">
                <div class="h-75 d-flex">
                    <div id="file-tree" class="w-25 h-100 bg-primary">
                        <ul class="w-100 h-100">
                            <file-tree 
                                class="w-100 h-100"
                                :root-item="fileTree.rootItem"
                                v-on:show-context-menu="showContextMenu"
                                v-on:set-file="setFile"
                            ></file-tree>
                        </ul>
                    </div>
                    <div class="w-75 h-100">
                        <textarea id="code-editor" class="w-100 h-100" :value="file ? file.text : ''" v-on:change="onSourceCodeChange">
                        </textarea>
                    </div>
                </div>
                <div class="h-25 d-flex">
                    <div class="w-25 bg-info">
                        問題
                    </div>
                    <div class="w-75 bg-secondary">
                        説明文
                    </div>
                </div>
            </div>
            <div class="col p-0 h-100 bg-dark">
                
            </div>
        </div>
        <transition name="fade">
            <file-creation-view 
            v-show="fileCreationView.isShown"
            @cancel="onFlieCreationViewCancelButtonClick"
            @append-file="onAppendFile"
            ></file-creation-view>
        </transition>
        <file-tree-context-menu
            v-show="fileTree.contextMenu.isShown"
            :is-file="fileTree.contextMenu.isFile"
            :left="fileTree.contextMenu.left"
            :top="fileTree.contextMenu.top"
            v-on:append-folder="onFileTreeContextMenuFolderAppendingButtonClick"
            v-on:show-file-creation-view="onFileTreeContextMenuFileAppendingButtonClick"
        ></file-tree-context-menu>
    </div>
</template>

<script>
    import FileCreationView from "./file-tree/FileCreationView.vue";
    import FileTree from "./file-tree/FileTree.vue";
    import FileTreeContextMenu from "./file-tree/FileTreeContextMenu.vue";
    import FileTreeItemAppendable from "./file-tree/FileTreeItemAppendable.js";
    import FileTreeItemFetchable from "./file-tree/FileTreeItemFetchable.js";
    import FileUpdatable from "./file-tree/FileUpdatable.js";

    export default {
            name: "development-view",
            props: {
                lessonId: Number,
                lessonTitle: String,
                dashboardUrl: String,
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
                    }
                }
            },
            mixins: [FileTreeItemAppendable, FileTreeItemFetchable, FileUpdatable],
            components: {
                FileTreeContextMenu,
                FileTree,
                FileCreationView,
            },
            created() {
                this.buildFileTree(this.lessonId, this.fileTree.rootItem);
            },
            methods: {
                onclick() {
                    this.fileTree.contextMenu.isShown = false;
                },
                onFlieCreationViewCancelButtonClick() {
                    this.fileCreationView.isShown = false;
                },
                onFileTreeContextMenuFolderAppendingButtonClick() {
                    this.appendFolder(
                        this.lessonId,
                        this.fileTree.contextMenu.itemId,
                        this.fileTree.contextMenu.itemChildren
                    );
                },
                onFileTreeContextMenuFileAppendingButtonClick() {
                    this.fileCreationView.isShown = true;
                },
                onAppendFile(fileName) {
                    this.appendFile(
                        this.lessonId,
                        this.fileTree.contextMenu.itemId,
                        this.fileTree.contextMenu.itemChildren,
                        fileName
                    );
                },
                onSourceCodeChange(e) {
                    this.file.text = e.target.value;
                    this.updateFileText(this.file.id, this.file.text);
                },
                showContextMenu(isFile, originX, originY, itemId, itemChildren) {
                    this.fileTree.contextMenu.isFile = isFile;
                    this.fileTree.contextMenu.isShown = true;
                    this.fileTree.contextMenu.left = originX;
                    this.fileTree.contextMenu.top = originY;
                    this.fileTree.contextMenu.itemId = itemId;
                    this.fileTree.contextMenu.itemChildren = itemChildren;
                },
                setFile(file) {
                    this.file = file;
                },
            },
    };
</script>