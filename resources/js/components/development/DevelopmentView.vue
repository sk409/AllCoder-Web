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
                            ></file-tree>
                        </ul>
                    </div>
                    <div class="w-75 h-100 bg-danger">
                        コード
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
        <file-tree-context-menu
            v-show="fileTree.contextMenu.isShown"
            :left="fileTree.contextMenu.left"
            :top="fileTree.contextMenu.top"
            v-on:append-folder="onAppendFolder"
            v-on:append-file="onAppendFile"
        ></file-tree-context-menu>
    </div>
</template>

<script>
    import FileTree from "./file-tree/FileTree.vue";
    import FileTreeContextMenu from "./file-tree/FileTreeContextMenu.vue";
    import FileTreeItemAppendable from "./file-tree/FileTreeItemAppendable";
    import FileTreeItemFetchable from "./file-tree/FileTreeItemFetchable";

    export default {
            name: "development-view",
            props: {
                lessonId: Number,
                lessonTitle: String,
                dashboardUrl: String,
            },
            data: function() {
                return {
                    fileTree: {
                        rootItem: {
                            id: null,
                            children: []
                        },
                        contextMenu: {
                            isShown: false,
                            left: 0,
                            top: 0,
                            itemId: null,
                            itemChildren: null,
                        }
                    }
                }
            },
            mixins: [FileTreeItemAppendable, FileTreeItemFetchable],
            components: {
                FileTreeContextMenu,
                FileTree,
            },
            created() {
                this.buildFileTree(this.lessonId, this.fileTree.rootItem);
            },
            methods: {
                onclick() {
                    this.fileTree.contextMenu.isShown = false;
                },
                onAppendFolder() {
                    this.appendFolder(
                        this.lessonId,
                        this.fileTree.contextMenu.itemId,
                        this.fileTree.contextMenu.itemChildren
                    );
                },
                onAppendFile() {
                        
                },
                showContextMenu(originX, originY, itemId, itemChildren) {
                    this.fileTree.contextMenu.isShown = true;
                    this.fileTree.contextMenu.left = originX;
                    this.fileTree.contextMenu.top = originY;
                    this.fileTree.contextMenu.itemId = itemId;
                    this.fileTree.contextMenu.itemChildren = itemChildren;
                },
            },
    };
</script>