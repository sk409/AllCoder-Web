<template>
    <li>
        <div v-if="doesHaveItemName" @contextmenu.stop.prevent="oncontextmenu">{{item.name}}</div>
        <ul v-if="doesHaveItemChildren" class="file-tree-item">
            <file-tree-item v-for="child in item.children" :item="child" :key="child.id" @show-context-menu="showContextMenu"></file-tree-item>
        </ul>
    </li>
</template>

<script>
    export default {
        name: "file-tree-item",
        props: {
            item: Object
        },
        computed: {
            doesHaveItemName() {
                return this.item && this.item.hasOwnProperty("name")
            },
            doesHaveItemChildren() {
                return this.item && this.item.hasOwnProperty("children") && this.item.children.length;
            },
        },
        methods: {
            oncontextmenu(e) {
                this.showContextMenu(e, this.item.id, this.item.children);
            },
            showContextMenu(e, id, children) {
                this.$emit('show-context-menu', e, id, children);
            },
        }
    }
</script>