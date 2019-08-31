<template>
    <div @contextmenu.stop.prevent="oncontextmenu">
        <ul>
            <file-tree-item :item="rootItem" @show-context-menu="showContextMenu"></file-tree-item>
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
                this.showContextMenu(e, this.rootItem.id, this.rootItem.children);
            },
            showContextMenu(e, id, children) {
                this.$emit("show-context-menu", e.pageX, e.pageY, id, children);
            },
        },
    }
</script>