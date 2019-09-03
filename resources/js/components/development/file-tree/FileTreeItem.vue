<template>
    <li>
        <div v-if="doesHaveItemName" @click="onclick" @contextmenu.stop.prevent="oncontextmenu">{{item.name}}</div>
        <ul v-if="doesHaveItemChildren" class="file-tree-item">
            <file-tree-item v-show="isExpanded" v-for="child in item.children" :item="child" :key="child.id" @show-context-menu="showContextMenu" @set-file="setFile"></file-tree-item>
        </ul>
    </li>
</template>

<script>
    export default {
        name: "file-tree-item",
        props: {
            item: Object
        },
        data: function() {
            return {
                isExpanded: true
            }
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
            onclick() {
                if (this.item.isFile) {
                    this.$emit("set-file", this.item);
                } else {
                    this.isExpanded = !this.isExpanded;
                }
            },
            oncontextmenu(e) {
                this.showContextMenu(this.item.isFile, e, this.item.id, this.item.children);
            },
            showContextMenu(isFile, e, id, children) {
                this.$emit('show-context-menu', isFile, e, id, children);
            },
            setFile(file) {
                this.$emit("set-file", file);
            }
        }
    }
</script>