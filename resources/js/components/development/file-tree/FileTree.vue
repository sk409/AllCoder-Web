<template>
    <div @contextmenu.stop.prevent="oncontextmenu">
        <ul>
            <file-tree-item :item="rootItem" @show-context-menu="showContextMenu" @set-file="setFile"></file-tree-item>
        </ul>
    </div>
</template>

<script>
    import FileTreeItem from "./FileTreeItem.vue";
    export default {
        name: "file-tree",
        props: {
            rootItem: Object
        },
        components: {
            FileTreeItem,
        },
        methods:  {
            oncontextmenu: function(e) { 
                this.showContextMenu(false, e, this.rootItem.id, this.rootItem.children);
            },
            showContextMenu(isFile, e, id, children) {
                this.$emit("show-context-menu", isFile, e.pageX, e.pageY, id, children);
            },
            setFile(file) {
                this.$emit("set-file", file);
            }
        },
    }
</script>