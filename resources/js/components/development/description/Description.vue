<template>
     <div id="description" class="w-100 h-100">
         <transition name="slide-up">
             <div id="description-editing-view" v-show="editingView.isShown" class="bg-danger" style="width:100%;height:300px;">
                 <textarea 
                    class="w-100 h-100"
                    v-model="editingView.description.text"
                ></textarea>
            </div>
         </transition>
        <div id="description-tools d-flex">
                <button class="btn btn-primary" @click="onAppendDescription">追加</button>
            </div>
        <div id="description-list" class="bg-info">
            <div class="border-bottom" v-for="description in descriptions" :key="description.id" @click="onSlideUpEditingView(description.id)">
                {{description.index}}: {{description.text}}
            </div>
         </div>
     </div>
</template>

<script>
    import DescriptionCreatable from "./DescriptionCreatable.js";
    export default {
        name: "description",
        props: {
            fileId: Number,
            descriptions: Array,
        },
        mixins: [
            DescriptionCreatable,
        ],
        data: function() {
            return {
                editingView: {
                    isShown: false,
                    description: Object,
                },
            }
        },
        methods: {
            onAppendDescription() {
                const that = this;
                const index = this.descriptions.length ?
                              Math.max(...this.descriptions.map(description => description.index)) + 1 :
                              0;
                this.createDescription(index, "", this.fileId, description => {
                    that.descriptions.push(description);
                });
            },
            onSlideUpEditingView(descriptionId) {
                this.editingView.isShown = !this.editingView.isShown;
                this.editingView.description = this.descriptions.find(description => description.id === descriptionId);
            }
        },
    }
</script>