<template>
    <div id="context-menu" class="btn-group-vertical border bg-white" :style="style">
        <button type="button" class="btn btn-light" @click="onAppendFolderButtonClick">フォルダを追加</button>
        <button type="button" class="btn btn-light" @click="onAppendFolderButtonClick">ファイルを追加</button>
    </div>
</template>

<script>
    export default {
        name: "file-tree-context-menu",
        props: ["left", "top"],
        methods: {
            onAppendFolderButtonClick() {
                this.$emit("append-folder");
            },
            onAppendFileButtonClick() {
                this.$emit("append-file");
            },
        },
        computed: {
            style() {
                return {
                    left: this.left + "px",
                    top: this.top + "px"
                }
            }
        },
    }
</script>

<style scoped>
    #context-menu {
        position: absolute;
    }
</style>