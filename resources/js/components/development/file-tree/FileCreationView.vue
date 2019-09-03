<template>
    <div id="file-creation-view" class="border shadow bg-white">
        <div id="file-creation-view-header" class="form-inline py-2 border-bottom">
            <div class="w-100 text-center">
                <input id="file-creation-view-file-name" class="form-control" v-model="fileName">
                <button id="file-creation-view-cancel" class="btn btn-primary file-creation-view-button" type="button" @click="onCancelButtonClick">キャンセル</button>
                <button id="file-creaetion-view-create" class="btn btn-primary file-creation-view-button" type="button" @click="onCreateFile">作成</button>
            </div>
        </div>
        <div id="file-creation-view-body" class="text-center">
            <filec-creation-view-file-item v-for="fileItem in fileItems" :key="fileItem.name" :image-url="fileItems.imageUrl" :name="fileItem.name"></filec-creation-view-file-item>
        </div>
    </div>
</template>

<script>
    import FileTreeItemAppendable from "./FileTreeItemAppendable.js";
    import FilecCreationViewFileItem from "./FilecreationViewFileItem.vue";
    export default {
        name: "file-creation-view",
        props: {
            lessonId: Number,
            itemId: Number,
            itemChildren: Array,
        },
        components: {
            FilecCreationViewFileItem,
        },
        mixins: [
            FileTreeItemAppendable,
        ],
        data: function() {
            return {
                fileName: "test.html",
                fileItems: [
                    {
                        imageUrl: "",
                        name: "HTML"
                    },
                    {
                        imageUrl: "",
                        name: "CSS",
                    },
                    {
                        imageUrl: "",
                        name: "JavaScript"
                    },
                    {
                        imageUrl: "",
                        name: "PHP"
                    },
                    {
                        imageUrl: "",
                        name: "Perl"
                    },
                ]
            }
        },
        methods: {
            onCancelButtonClick() {
                this.$emit("cancel");
            },
            onCreateFile() {
                this.appendFile(
                    this.lessonId,
                    this.itemId,
                    this.itemChildren,
                    this.fileName
                );
            },
        }
    }
</script>