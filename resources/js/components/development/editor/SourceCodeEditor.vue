<template>
    <textarea
        id="source-code-editor"
        class="w-100 h-100"
        :value="text"
        :disabled="disabled"
        @input="oninput"
        @click="onclick"
        @select="onselect"
        @focus="onfocus"
        @paste="onpaste"
        @keydown.left="onArrowKeyDown"
        @keydown.right="onArrowKeyDown"
        @keydown.up="onArrowKeyDown"
        @keydown.down="onArrowKeyDown"
        @contextmenu.stop.prevent="oncontextmenu"
    ></textarea>
</template>

<script>
    import QuestionUpdatable from "../question/QuestionUpdatable.js";
    //import QuestionDeletable from "../question/QuestionDeletable.js";
    import { Promise } from 'q';
    import {deleteQuestion, deleteQuestions} from "../question/DeleteQuestions.js";
    import {updateDescriptionTarget} from "../description/UpdateDescriptionTarget.js";
    import {deleteDescriptionTarget, deleteDescriptionTargets} from "../description/DeleteDescriptionTargets.js";
    export default {
        name: "source-code-editor",
        props: {
            text: String,
            questions: Array,
            descriptionTargets: Array,
            disabled: Boolean,
        },
        mixins: [
            QuestionUpdatable,
            // QuestionDeletable,
        ],
        data: function() {
            return {
                textarea: null,
                textBeforeInput: null,
                selectedRangeBeforeInput: null,
                pastedText: null,
                inputQueue: Promise.resolve(),
                delayedUpdate: _.debounce(this.update, 500),
            }
        },
        methods: {
            oninput(e) {
                const that = this;
                const selectionStart = e.target.selectionStart;
                const selectionEnd = e.target.selectionEnd;
                const selectedRangeBeforeInput = this.selectedRangeBeforeInput ? {
                    start: this.selectedRangeBeforeInput.start,
                    end: this.selectedRangeBeforeInput.end
                } : null;
                if (e.inputType === "insertText" || e.inputType === "insertLineBreak") {
                    this.inputQueue.then(function() {
                        that.insertText(
                            selectedRangeBeforeInput,
                            selectionStart,
                            selectionEnd
                        );
                    });
                } else if (e.inputType === "deleteContentBackward") {
                    this.inputQueue.then(function() {
                        that.deleteContentBackward(
                            selectedRangeBeforeInput,
                            selectionStart,
                            selectionEnd
                        );
                    });
                } else if (e.inputType === "insertFromPaste") {
                    //console.log(e);
                    this.inputQueue.then(function() {
                        that.insertFromPaste(
                            selectedRangeBeforeInput,
                            selectionStart,
                            selectionEnd
                        );
                    });
                } else if (e.inputType === "deleteByCut") {
                    this.inputQueue.then(function() {
                        that.deleteByCut(
                            selectedRangeBeforeInput,
                            selectionStart,
                            selectionEnd
                        );
                    });
                }
                 //else if (e.inputType === "historyUndo") {
                //     this.queue.then(this.historyUndo(e));
                // } else if (e.inputType === "historyRedo") {
                //     this.queue.then(this.historyRedo(e));
                // }
                this.textarea = e.target;
                this.selectedRangeBeforeInput = null;
            },
            onclick(e) {
                this.selectedRangeBeforeInput = null;
            },
            onselect(e) {
                //console.log("ONSELECT: " + e.target.selectionStart + ", " + e.target.selectionEnd);
                this.selectedRangeBeforeInput = {
                    start: e.target.selectionStart,
                    end: e.target.selectionEnd,
                };
            },
            onfocus(e) {
                //console.log("FOCUS");
                this.selectedRangeBeforeInput = null;
            },
            onpaste(e) {
                this.pastedText = e.clipboardData.getData("text");
            },
            onArrowKeyDown(e) {
                this.selectedRangeBeforeInput = null;
            },
            oncontextmenu(e) {
                this.$emit("show-context-menu", e);
            },
            insertText(selectedRangeBeforeInput, selectionStart, selectionEnd) {
                //console.log("(" + selectionStart + ", " + selectionEnd + ")");
                // console.log(selectedRangeBeforeInput);
                // console.log(getSelection().toString());
                //console.log(this.questions);
                //const deletedQuestionIds = [];
                const that = this;
                if (
                    selectedRangeBeforeInput === null ||
                    selectedRangeBeforeInput.start === selectedRangeBeforeInput.end
                ) {
                    const caretPosition = selectionStart - 1;
                    this.questions.concat(this.descriptionTargets).forEach(item => {
                        //console.log(item.startIndex);
                        let updated = false;
                        if (caretPosition <= item.startIndex) {
                            //console.log("START");
                            ++item.startIndex;
                            updated = true;
                        }
                        if (caretPosition < item.endIndex) {
                            //console.log("END");
                            ++item.endIndex;
                            updated = true;
                        }
                        if (updated) {
                            item.hasUpdated = true;
                            that.appendUpdatingTask(item.id, item.startIndex, item.endIndex);
                        }
                    });
                    
                } else {
                    this.questions.concat(this.descriptionTargets).forEach(item => {
                        if (selectedRangeBeforeInput.start <= item.startIndex &&
                            item.endIndex <= selectedRangeBeforeInput.end   //  |---[---]---|
                        ) {
                            item.hasDeleted = true;
                            this.delayedUpdate();
                        } else {
                            if (selectedRangeBeforeInput.start <= item.startIndex &&
                                item.startIndex <= selectedRangeBeforeInput.end &&
                                selectedRangeBeforeInput.end < item.endIndex    //  |---[---|---)
                            ) {
                                item.startIndex = (selectedRangeBeforeInput.start + 1);
                                item.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start - 1);
                            } else if (item.startIndex < selectedRangeBeforeInput.start &&
                                selectedRangeBeforeInput.start <= item.endIndex &&
                                item.endIndex <= selectedRangeBeforeInput.end   // (---|---]---|
                            ) {
                                item.endIndex = selectedRangeBeforeInput.start;
                            } else if (item.startIndex < selectedRangeBeforeInput.start &&
                                       selectedRangeBeforeInput.end < item.endIndex     // (---|---|---)
                            ) {
                                item.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start - 1);
                            } else if (selectedRangeBeforeInput.end < item.startIndex) { // |---|---(---)
                                item.startIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start - 1);
                                item.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start - 1);
                            }
                            item.hasUpdated = !(item.endIndex < selectedRangeBeforeInput.start);    //  (---)---[---]
                            that.appendUpdatingTask(item.id, item.startIndex, item.endIndex);
                        }
                    });
                }
                // if (deletedQuestionIds.length) {
                //     this.$emit("remove-questions", deletedQuestionIds);
                // }
            },
            deleteContentBackward(selectedRangeBeforeInput, selectionStart, selectionEnd) {
                //console.log("(" + selectionStart + ", " + selectionEnd + ")");
                //console.log(selectedRangeBeforeInput);
                const that = this;
                if (
                    selectedRangeBeforeInput === null ||
                    selectedRangeBeforeInput.start === selectedRangeBeforeInput.end
                ) {
                    const caretPosition = selectionStart + 1;
                    //console.log(caretPosition);
                    this.questions.concat(this.descriptionTargets).forEach(item => {
                        let updated = false;
                        // console.log(question.startIndex);
                        // console.log(question.endIndex);
                        if (caretPosition <= item.startIndex) {
                            //console.log("START");
                            --item.startIndex;
                            updated = true;
                        }
                        if (caretPosition <= item.endIndex) {
                            //console.log("END");
                            --item.endIndex;
                            updated = true;
                        }
                        if (updated) {
                            if (item.endIndex - item.startIndex == 0) {                            
                                item.hasDeleted = true;
                            } else {
                                item.hasUpdated = true;
                                that.appendUpdatingTask(item.id, item.startIndex, item.endIndex);
                            }
                        }
                    });
                } else {
                    this.questions.concat(this.descriptionTargets).forEach(item => {
                        if (selectedRangeBeforeInput.start <= item.startIndex &&
                            item.endIndex <= selectedRangeBeforeInput.end   //  |---[---]---|
                        ) {
                            item.hasDeleted =  true;
                            this.delayedUpdate();
                        } else {
                            if (selectedRangeBeforeInput.start <= item.startIndex &&
                                item.startIndex <= selectedRangeBeforeInput.end &&
                                selectedRangeBeforeInput.end < item.endIndex    //  |---[---|---)
                            ) {
                                item.startIndex = (selectedRangeBeforeInput.start);
                                item.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                            } else if (item.startIndex < selectedRangeBeforeInput.start &&
                                selectedRangeBeforeInput.start <= item.endIndex &&
                                item.endIndex <= selectedRangeBeforeInput.end   // (---|---]---|
                            ) {
                                item.endIndex = selectedRangeBeforeInput.start;
                            } else if (item.startIndex < selectedRangeBeforeInput.start &&
                                       selectedRangeBeforeInput.end < item.endIndex     // (---|---|---)
                            ) {
                                item.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                            } else if (selectedRangeBeforeInput.end < item.startIndex) { // |---|---(---)
                                item.startIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                                item.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                            }
                            item.hasUpdated = !(item.endIndex < selectedRangeBeforeInput.start);    //  (---)---[---]
                            that.appendUpdatingTask(item.id, item.startIndex, item.endIndex);
                        }
                    });
                }
            },
            insertFromPaste(selectedRangeBeforeInput, selectionStart, selectionEnd) { 
                const that = this;
                if (
                    selectedRangeBeforeInput === null ||
                    selectedRangeBeforeInput.start === selectedRangeBeforeInput.end
                ) {
                    const caretPosition = selectionStart - this.pastedText.length;
                    this.questions.concat(this.descriptionTargets).forEach(item => {
                        let updated = false;
                        // console.log(question.startIndex);
                        // console.log(question.endIndex);
                        if (caretPosition <= item.startIndex) {
                            //console.log("START");
                            item.startIndex += this.pastedText.length;
                            updated = true;
                        }
                        if (caretPosition < item.endIndex) {
                            //console.log("END");
                            item.endIndex += this.pastedText.length;
                            updated = true;
                        }
                        if (updated) {
                            item.hasUpdated = true;
                            that.appendUpdatingTask(item.id, item.startIndex, item.endIndex);
                        }
                    });
                } else {
                    this.questions.concat(this.descriptionTargets).forEach(item => {
                        if (selectedRangeBeforeInput.start <= item.startIndex &&
                            item.endIndex <= selectedRangeBeforeInput.end   //  |---[---]---|
                        ) {
                            item.hasDeleted = true;
                            this.delayedUpdate();
                        } else {
                            if (selectedRangeBeforeInput.start <= item.startIndex &&
                                item.startIndex <= selectedRangeBeforeInput.end &&
                                selectedRangeBeforeInput.end < item.endIndex    //  |---[---|---)
                            ) {
                                item.startIndex = (selectedRangeBeforeInput.start + this.pastedText.length);
                                item.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                                item.endIndex += this.pastedText.length;
                            } else if (item.startIndex < selectedRangeBeforeInput.start &&
                                selectedRangeBeforeInput.start <= item.endIndex &&
                                item.endIndex <= selectedRangeBeforeInput.end   // (---|---]---|
                            ) {
                                item.endIndex = selectedRangeBeforeInput.start;
                            } else if (item.startIndex < selectedRangeBeforeInput.start &&
                                       selectedRangeBeforeInput.end < item.endIndex     // (---|---|---)
                            ) {
                                item.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                                item.endIndex += this.pastedText.length;
                            } else if (selectedRangeBeforeInput.end < item.startIndex) { // |---|---(---)
                                item.startIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                                item.startIndex += this.pastedText.length;
                                item.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                                item.endIndex += this.pastedText.length;
                            }
                            item.hasUpdated = !(item.endIndex < selectedRangeBeforeInput.start);    //  (---)---[---]
                            that.appendUpdatingTask(item.id, item.startIndex, item.endIndex);
                        }
                    });
                }
            },
            deleteByCut(selectedRangeBeforeInput, selectionStart, selectionEnd) {
                //console.log("(" + selectionStart + ", " + selectionEnd + ")");
                //console.log(selectedRangeBeforeInput);
                const that = this;
                this.questions.concat(this.descriptionTargets).forEach(item => {
                    if (selectedRangeBeforeInput.start <= item.startIndex &&
                        item.endIndex <= selectedRangeBeforeInput.end   //  |---[---]---|
                    ) {
                        item.hasDeleted = true;
                        this.delayedUpdate();
                    } else {
                        if (selectedRangeBeforeInput.start <= item.startIndex &&
                            item.startIndex <= selectedRangeBeforeInput.end &&
                            selectedRangeBeforeInput.end < item.endIndex    //  |---[---|---)
                        ) {
                            item.startIndex = (selectedRangeBeforeInput.start);
                            item.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                        } else if (item.startIndex < selectedRangeBeforeInput.start &&
                            selectedRangeBeforeInput.start <= item.endIndex &&
                            item.endIndex <= selectedRangeBeforeInput.end   // (---|---]---|
                        ) {
                            item.endIndex = selectedRangeBeforeInput.start;
                        } else if (item.startIndex < selectedRangeBeforeInput.start &&
                                selectedRangeBeforeInput.end < item.endIndex     // (---|---|---)
                        ) {
                            item.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                        } else if (selectedRangeBeforeInput.end < item.startIndex) { // |---|---(---)
                            item.startIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                            item.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                        }
                        item.hasUpdated = !(item.endIndex < selectedRangeBeforeInput.start);    //  (---)---[---]
                        that.appendUpdatingTask(item.id, item.startIndex, item.endIndex);
                    }
                });
            },
            // historyUndo(e) {
                
            // },
            // historyRedo(e) {
                
            // },
            appendUpdatingTask(id, startIndex, endIndex) {
                this.delayedUpdate();
            },
            // appendDeletingTask(id) {
            //     console.log("DELETE");
            //     const that = this;
            //     this.apiQueue.then(function() {
            //         that.deleteQuestion(id);
            //     });
            // },
            update() {
                console.log("UPDATE");
                this.$emit("update-file-text", this.textarea.value);
                const that = this;
                const deleter = function(items, isQuestion) {
                    const deletedItemIds = items.filter(item => item.hasDeleted).map(item => item.id);
                    if (deletedItemIds.length) {
                        if (isQuestion) {
                            console.log("Delete Question.");
                            deleteQuestions(deletedItemIds);
                        } else {
                            console.log("Delete DescriptionTargets.");
                            deleteDescriptionTargets(deletedItemIds);
                        }
                    }
                };
                deleter(this.questions, true);
                deleter(this.descriptionTargets, false);
                this.$emit("set-questions", this.questions.filter(question => !question.hasDeleted));
                this.$emit("set-description-targets", this.descriptionTargets.filter(descriptionTarget => !descriptionTarget.hasDeleted));
                Vue.nextTick(function() {
                    const updater = function(items, isQuestion) {
                        items.forEach(item => {
                            if (item.hasUpdated) {
                                if (isQuestion) {
                                    that.updateQuestion(item.id, {
                                        start_index: item.startIndex,
                                        end_index: item.endIndex,
                                    });
                                    that.$emit("update-question", item.id, item.startIndex, item.endIndex);
                                } else {
                                    updateDescriptionTarget(item.id, item.startIndex, item.endIndex, item.descriptionId);
                                    that.$emit("update-description-target", item.id, item.startIndex, item.endIndex);
                                }
                                item.hasUpdated = false;   
                            }
                        });
                    };
                    updater(that.questions, true);
                    //console.log(that.descriptionTargets);
                    updater(that.descriptionTargets, false);
                });
            },
        }
    }
</script>