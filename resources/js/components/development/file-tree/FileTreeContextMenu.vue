<template>
    <div id="context-menu" class="btn-group-vertical border bg-white" :style="style">
        <button type="button" class="btn btn-light" v-show="isFolder" @click="onAppendFolderButtonClick">フォルダを追加</button>
        <button type="button" class="btn btn-light" v-show="isFolder" @click="onAppendFileButtonClick">ファイルを追加</button>
        <button type="button" class="btn btn-light">名前を変更</button>
    </div>
</template>

<script>
    export default {
        name: "file-tree-context-menu",
        props: {
            isFile: Boolean,
            left: Number,
            top: Number,
        },
        methods: {
            onAppendFolderButtonClick() {
                this.$emit("append-folder");
            },
            onAppendFileButtonClick() {
                this.$emit("show-file-creation-view");
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

<style scoped>
    #context-menu {
        position: absolute;
    }
</style>