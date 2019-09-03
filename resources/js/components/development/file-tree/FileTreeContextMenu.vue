<template>
    <div id="file-tree-context-menu" class="btn-group-vertical border bg-white" :style="style">
        <button type="button" class="btn btn-light" v-show="isFolder" @click="onAppendFolder">フォルダを追加</button>
        <button type="button" class="btn btn-light" v-show="isFolder" @click="onShowFileCreationView">ファイルを追加</button>
        <button type="button" class="btn btn-light">名前を変更</button>
        <button type="button" class="btn btn-light" @click="onRemove">削除</button>
    </div>
</template>

<script>
    import FolderAppendable from "./FileTreeItemAppendable.js";
    export default {
        name: "file-tree-context-menu",
        props: {
            isFile: Boolean,
            left: Number,
            top: Number,
            lessonId: Number,
            itemId: Number,
            itemChildren: Array,
        },
        mixins: [
            FolderAppendable,
        ],
        methods: {
            onAppendFolder() {
                this.appendFolder(this.lessonId, this.itemId, this.itemChildren);
            },
            onShowFileCreationView() {
                this.$emit("show-file-creation-view");
            },
            onRemove() {
                this.$emit("remove-file-tree-item", this.itemId, this.isFile);
            },
        },
        computed: {
            style() {
                return {
                    left: this.left + "px",
                    top: this.top + "px"
                }
            },
            isFolder() {
                return !this.isFile;
            },
        },
    }
</script>