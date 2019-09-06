<template>
    <div id="source-code-editor-context-menu" class="btn-group-vertical border bg-white" :style="style">
        <button type="button" class="btn btn-light" v-show="isTextSelected" @click="onStoreQuestion">問題に追加</button>
        <button type="button" class="btn btn-light" v-show="isDescriptionSelected" @click="onStoreDescriptionTarget">説明対象に追加</button>
        <button type="button" class="btn btn-light">テストボタン</button>
    </div>
</template>

<script>
    export default {
        name: "source-code-editor-context-menu",
        props: {
            left: Number,
            top: Number,
            isDescriptionSelected: Boolean,
        },
        methods: {
            onStoreQuestion() {
                this.$emit("store-question");
            },
            onStoreDescriptionTarget() {
                this.$emit("store-description-target");
            },
            isTextSelected() {
                return getSelection().toString().length;
            }
        },
        computed: {
            style() {
                return {
                    left: this.left + "px",
                    top: this.top + "px"
                }
            },
        },
    }
</script>