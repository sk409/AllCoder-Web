<template>
    <div id="source-code-editor-context-menu" class="btn-group-vertical border bg-white" :style="style">
        <button type="button" class="btn btn-light" v-show="isTextSelected" @click="onAddQuestionButtonClick">選択範囲を問題に追加</button>
        <button type="button" class="btn btn-light">テストボタン</button>
    </div>
</template>

<script>
    export default {
        name: "source-code-editor-context-menu",
        props: {
            left: Number,
            top: Number,
        },
        methods: {
            onAddQuestionButtonClick() {
                this.$emit("add-question");
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