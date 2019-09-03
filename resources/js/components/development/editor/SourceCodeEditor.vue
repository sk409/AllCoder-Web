<template>
    <textarea
        id="source-code-editor"
        class="w-100 h-100"
        :value="text"
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
    import QuestionDeletable from "../question/QuestionDeletable.js";
    import { Promise } from 'q';
    export default {
        name: "source-code-editor",
        props: {
            text: String,
            questions: Array,
        },
        mixins: [
            QuestionUpdatable,
            QuestionDeletable,
        ],
        data: function() {
            return {
                textBeforeInput: null,
                selectedRangeBeforeInput: null,
                pastedText: null,
                inputQueue: Promise.resolve(),
                apiQueue: Promise.resolve(),
                delayedUpdate: _.debounce(this.updateQuestions, 500),
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
                this.$emit("update-file-text", e);
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
                const deletedQuestionIds = [];
                const that = this;
                if (
                    selectedRangeBeforeInput === null ||
                    selectedRangeBeforeInput.start === selectedRangeBeforeInput.end
                ) {
                    const caretPosition = selectionStart - 1;
                    this.questions.forEach(question => {
                        let updated = false;
                        // console.log(question.startIndex);
                        // console.log(question.endIndex);
                        if (caretPosition <= question.startIndex) {
                            //console.log("START");
                            ++question.startIndex;
                            updated = true;
                        }
                        if (caretPosition < question.endIndex) {
                            //console.log("END");
                            ++question.endIndex;
                            updated = true;
                        }
                        if (updated) {
                            that.appendUpdatingTask(question.id, question.startIndex, question.endIndex);
                        }
                    });
                } else {
                    this.questions.forEach((question, index) => {
                        if (selectedRangeBeforeInput.start <= question.startIndex &&
                            question.endIndex <= selectedRangeBeforeInput.end   //  |---[---]---|
                        ) {
                            deletedQuestionIds.push(question.id);
                            that.appendDeletingTask(question.id);
                        } else {
                            if (selectedRangeBeforeInput.start <= question.startIndex &&
                                question.startIndex <= selectedRangeBeforeInput.end &&
                                selectedRangeBeforeInput.end < question.endIndex    //  |---[---|---)
                            ) {
                                question.startIndex = (selectedRangeBeforeInput.start + 1);
                                question.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start - 1);
                            } else if (question.startIndex < selectedRangeBeforeInput.start &&
                                selectedRangeBeforeInput.start <= question.endIndex &&
                                question.endIndex <= selectedRangeBeforeInput.end   // (---|---]---|
                            ) {
                                question.endIndex = selectedRangeBeforeInput.start;
                            } else if (question.startIndex < selectedRangeBeforeInput.start &&
                                       selectedRangeBeforeInput.end < question.endIndex     // (---|---|---)
                            ) {
                                question.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start - 1);
                            } else if (selectedRangeBeforeInput.end < question.startIndex) { // |---|---(---)
                                question.startIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start - 1);
                                question.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start - 1);
                            }
                            that.appendUpdatingTask(question.id, question.startIndex, question.endIndex);
                        }
                    });
                }
                if (deletedQuestionIds.length) {
                    this.$emit("remove-questions", deletedQuestionIds);
                }
            },
            deleteContentBackward(selectedRangeBeforeInput, selectionStart, selectionEnd) {
                //console.log("(" + selectionStart + ", " + selectionEnd + ")");
                //console.log(selectedRangeBeforeInput);
                const deletedQuestionIds = [];
                const that = this;
                if (
                    selectedRangeBeforeInput === null ||
                    selectedRangeBeforeInput.start === selectedRangeBeforeInput.end
                ) {
                    const caretPosition = selectionStart + 1;
                    //console.log(caretPosition);
                    this.questions.forEach(question => {
                        let updated = false;
                        // console.log(question.startIndex);
                        // console.log(question.endIndex);
                        if (caretPosition <= question.startIndex) {
                            //console.log("START");
                            --question.startIndex;
                            updated = true;
                        }
                        if (caretPosition <= question.endIndex) {
                            //console.log("END");
                            --question.endIndex;
                            updated = true;
                        }
                        if (updated) {
                            if (question.endIndex - question.startIndex == 0) {
                                deletedQuestionIds.push(question.id);
                                that.appendDeletingTask(question.id);
                            } else {
                                that.appendUpdatingTask(question.id, question.startIndex, question.endIndex);
                            }
                        }
                    });
                } else {
                    this.questions.forEach((question, index) => {
                        if (selectedRangeBeforeInput.start <= question.startIndex &&
                            question.endIndex <= selectedRangeBeforeInput.end   //  |---[---]---|
                        ) {
                            deletedQuestionIds.push(question.id);
                            that.appendDeletingTask(question.id);
                        } else {
                            if (selectedRangeBeforeInput.start <= question.startIndex &&
                                question.startIndex <= selectedRangeBeforeInput.end &&
                                selectedRangeBeforeInput.end < question.endIndex    //  |---[---|---)
                            ) {
                                question.startIndex = (selectedRangeBeforeInput.start);
                                question.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                                // console.log(question.startIndex);
                                // console.log(question.endIndex);
                            } else if (question.startIndex < selectedRangeBeforeInput.start &&
                                selectedRangeBeforeInput.start <= question.endIndex &&
                                question.endIndex <= selectedRangeBeforeInput.end   // (---|---]---|
                            ) {
                                question.endIndex = selectedRangeBeforeInput.start;
                            } else if (question.startIndex < selectedRangeBeforeInput.start &&
                                       selectedRangeBeforeInput.end < question.endIndex     // (---|---|---)
                            ) {
                                question.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                            } else if (selectedRangeBeforeInput.end < question.startIndex) { // |---|---(---)
                                question.startIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                                question.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                            }
                            that.appendUpdatingTask(question.id, question.startIndex, question.endIndex);
                        }
                    });
                }
                if (deletedQuestionIds.length) {
                    this.$emit("remove-questions", deletedQuestionIds);
                }
            },
            insertFromPaste(selectedRangeBeforeInput, selectionStart, selectionEnd) { 
                const deletedQuestionIds = [];
                const that = this;
                if (
                    selectedRangeBeforeInput === null ||
                    selectedRangeBeforeInput.start === selectedRangeBeforeInput.end
                ) {
                    const caretPosition = selectionStart - this.pastedText.length;
                    this.questions.forEach(question => {
                        let updated = false;
                        // console.log(question.startIndex);
                        // console.log(question.endIndex);
                        if (caretPosition <= question.startIndex) {
                            //console.log("START");
                            question.startIndex += this.pastedText.length;
                            updated = true;
                        }
                        if (caretPosition < question.endIndex) {
                            //console.log("END");
                            question.endIndex += this.pastedText.length;
                            updated = true;
                        }
                        if (updated) {
                            that.appendUpdatingTask(question.id, question.startIndex, question.endIndex);
                        }
                    });
                } else {
                    this.questions.forEach((question, index) => {
                        if (selectedRangeBeforeInput.start <= question.startIndex &&
                            question.endIndex <= selectedRangeBeforeInput.end   //  |---[---]---|
                        ) {
                            deletedQuestionIds.push(question.id);
                            that.appendDeletingTask(question.id);
                        } else {
                            if (selectedRangeBeforeInput.start <= question.startIndex &&
                                question.startIndex <= selectedRangeBeforeInput.end &&
                                selectedRangeBeforeInput.end < question.endIndex    //  |---[---|---)
                            ) {
                                question.startIndex = (selectedRangeBeforeInput.start + this.pastedText.length);
                                question.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                                question.endIndex += this.pastedText.length;
                            } else if (question.startIndex < selectedRangeBeforeInput.start &&
                                selectedRangeBeforeInput.start <= question.endIndex &&
                                question.endIndex <= selectedRangeBeforeInput.end   // (---|---]---|
                            ) {
                                question.endIndex = selectedRangeBeforeInput.start;
                            } else if (question.startIndex < selectedRangeBeforeInput.start &&
                                       selectedRangeBeforeInput.end < question.endIndex     // (---|---|---)
                            ) {
                                question.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                                question.endIndex += this.pastedText.length;
                            } else if (selectedRangeBeforeInput.end < question.startIndex) { // |---|---(---)
                                question.startIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                                question.startIndex += this.pastedText.length;
                                question.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                                question.endIndex += this.pastedText.length;
                            }
                            that.appendUpdatingTask(question.id, question.startIndex, question.endIndex);
                        }
                    });
                }
                if (deletedQuestionIds.length) {
                    this.$emit("remove-questions", deletedQuestionIds);
                }
            },
            deleteByCut(selectedRangeBeforeInput, selectionStart, selectionEnd) {
                //console.log("(" + selectionStart + ", " + selectionEnd + ")");
                //console.log(selectedRangeBeforeInput);
                const deletedQuestionIds = [];
                const that = this;
                this.questions.forEach((question, index) => {
                    if (selectedRangeBeforeInput.start <= question.startIndex &&
                        question.endIndex <= selectedRangeBeforeInput.end   //  |---[---]---|
                    ) {
                        deletedQuestionIds.push(question.id);
                        that.appendDeletingTask(question.id);
                    } else {
                        if (selectedRangeBeforeInput.start <= question.startIndex &&
                            question.startIndex <= selectedRangeBeforeInput.end &&
                            selectedRangeBeforeInput.end < question.endIndex    //  |---[---|---)
                        ) {
                            question.startIndex = (selectedRangeBeforeInput.start);
                            question.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                            // console.log(question.startIndex);
                            // console.log(question.endIndex);
                        } else if (question.startIndex < selectedRangeBeforeInput.start &&
                            selectedRangeBeforeInput.start <= question.endIndex &&
                            question.endIndex <= selectedRangeBeforeInput.end   // (---|---]---|
                        ) {
                            question.endIndex = selectedRangeBeforeInput.start;
                        } else if (question.startIndex < selectedRangeBeforeInput.start &&
                                    selectedRangeBeforeInput.end < question.endIndex     // (---|---|---)
                        ) {
                            question.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                        } else if (selectedRangeBeforeInput.end < question.startIndex) { // |---|---(---)
                            question.startIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                            question.endIndex -= (selectedRangeBeforeInput.end - selectedRangeBeforeInput.start);
                        }
                        that.appendUpdatingTask(question.id, question.startIndex, question.endIndex);
                    }
                });
                if (deletedQuestionIds.length) {
                    this.$emit("remove-questions", deletedQuestionIds);
                }
            },
            // historyUndo(e) {
                
            // },
            // historyRedo(e) {
                
            // },
            appendUpdatingTask(id, startIndex, endIndex) {
                this.$emit("update-question", id, startIndex, endIndex);
                this.delayedUpdate();
            },
            appendDeletingTask(id) {
                console.log("DELETE");
                const that = this;
                this.apiQueue.then(function() {
                    that.deleteQuestion(id);
                });
            },
            updateQuestions() {
                const that = this;
                this.questions.forEach(question => {
                    that.updateQuestion(question.id, {
                        start_index: question.startIndex,
                        end_index: question.endIndex,
                    });
                    question.hasUpdated= false;
                });
            },
        }
    }
</script>