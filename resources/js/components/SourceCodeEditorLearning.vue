<template>
    <div @contextmenu.stop.prevent="showContextMenu">
        <div ref="editor"></div>
        <el-dialog
            :visible.sync="isInputDialogVisible"
            @closed="closedInputDialog"
        >
            <textarea
                v-model="enteredAnswer"
                class="w-100 h-50"
                placeholder="答えを入力してください"
            ></textarea>
            <div class="text-center">
                <el-button type="primary" @click="checkAnswer">解答</el-button>
            </div>
        </el-dialog>
        <el-dialog
            :title="commentTitle"
            :visible.sync="isCommentDialogVieible"
            @opened="openCommentDialog"
        >
            <div ref="comment"></div>
        </el-dialog>
    </div>
</template>

<script>
import CodeQuestion from "../models/code_question";
import CodeQuestionAnswer from "../models/code_question_answer.js";
import PHPSyntaxhilighter from "../syntaxhilighters/php_syntaxhilighter.js";
import { mapActions, mapGetters } from "vuex";
export default {
    name: "SourceCodeEditorLearning",
    props: {
        mode: {
            type: String,
            required: true
        },
        questions: {
            type: Array,
            required: true
        },
        userId: {
            type: Number,
            required: true
        },
        materialId: {
            type: Number,
            required: true
        },
        lessonId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            isInputDialogVisible: false,
            isCommentDialogVieible: false,
            text: "",
            answer: "",
            enteredAnswer: "",
            selectedQuestion: null,
            selectedQuestionButton: null,
            commentTitle: "",
            commentText: "",
            syntaxhilighter: new PHPSyntaxhilighter()
        };
    },
    computed: {
        ...mapGetters(["editedFileText", "editedFilePath"])
        // answeredQuestions() {
        //     const targetQuestions = this.targetQuestions;
        //     return this.questions.filter(
        //         question => !targetQuestions.includes(question)
        //     );
        // }
    },
    mounted() {
        this.$store.subscribe((mutation, state) => {
            if (mutation.type === "setEditedFile") {
                // const targetQuestions = this.targetQuestions();
                this.setupEditor();
                //console.log(this.editorText() + "abc");
            }
        });
    },
    methods: {
        ...mapActions(["setEditedFileText", "updateEditedFile"]),
        targetQuestions() {
            return this.questions.filter(
                question =>
                    question.file_path === this.editedFilePath &&
                    (!question.answer || question.answer.text !== question.text)
            );
        },
        editorText() {
            let result = "";
            let seek = 0;
            this.targetQuestions().forEach(targetQuestion => {
                // console.log("@@@@@@@@@@@@@");
                // console.log(targetQuestion.text);
                result += this.text.substr(
                    seek,
                    targetQuestion.start_index - seek
                );
                seek = targetQuestion.end_index;
            });
            result += this.text.substr(seek, this.text.length);
            return result;
        },
        setupEditor() {
            this.restoreText();
            this.$refs.editor.innerHTML = "";
            this.setTextAndQuestionButton(this.targetQuestions());
            this.nl2br(this.$refs.editor);
            this.highlight();
        },
        restoreText() {
            // console.log(this.editedFileText);
            const targetQuestions = this.targetQuestions();
            if (targetQuestions.length === 0) {
                this.text = this.editedFileText;
                return;
            }
            this.text = "";
            let startIndex = 0;
            let offset = 0;
            targetQuestions.forEach(question => {
                // if (question.text == 'echo "OK6";') {
                //     this.text += "\n";
                // }
                this.text += this.editedFileText.substring(
                    startIndex,
                    question.start_index - offset
                );
                this.text += question.text;
                // console.log(this.text);
                startIndex = question.start_index - offset;
                offset += question.text.length;
            });
            this.text += this.editedFileText.substr(startIndex);
            //console.log(this.text);
        },
        setTextAndQuestionButton(questions) {
            let startIndex = 0;
            questions.forEach(question => {
                if (question.startIndex !== 0) {
                    this.$refs.editor.appendChild(
                        document.createTextNode(
                            this.text.substring(
                                startIndex,
                                question.start_index
                            )
                        )
                    );
                }
                const questionButton = document.createElement("span");
                questionButton.textContent = "?";
                questionButton.style.width = "1rem";
                const that = this;
                questionButton.onclick = function() {
                    that.isInputDialogVisible = true;
                    that.selectedQuestion = question;
                    that.selectedQuestionButton = questionButton;
                };
                this.$refs.editor.appendChild(questionButton);
                startIndex = question.end_index;
            });
            if (startIndex !== this.text.length) {
                this.$refs.editor.appendChild(
                    document.createTextNode(this.text.substring(startIndex))
                );
            }
        },
        highlight() {
            const that = this;
            function split(textNode) {
                const color = function(color, match) {
                    const startIndex = match.index;
                    const endIndex = match.index + match[0].length;
                    const nodes = [];
                    if (startIndex !== 0) {
                        const leftNode = document.createTextNode(
                            textNode.textContent.substring(0, startIndex)
                        );
                        nodes.push(leftNode);
                    }
                    const centerNode = document.createElement("span");
                    centerNode.textContent = textNode.textContent.substring(
                        startIndex,
                        endIndex
                    );
                    nodes.push(centerNode);
                    if (endIndex !== textNode.textContent.length) {
                        const rightNode = document.createTextNode(
                            textNode.textContent.substring(endIndex)
                        );
                        nodes.push(rightNode);
                    }
                    const previousSibling = textNode.previousSibling;
                    if (!previousSibling) {
                        textNode.parentNode.prepend(...nodes);
                    } else {
                        let before = previousSibling;
                        nodes.forEach(node => {
                            textNode.parentNode.insertBefore(
                                node,
                                before.nextSibling
                            );
                            before = node;
                        });
                    }
                    textNode.remove();
                    centerNode.style.color = color;
                    nodes.forEach(node => {
                        if (node.nodeType !== Node.TEXT_NODE) {
                            return;
                        }
                        split(node);
                    });
                };
                // const regex = new RegExp(/<.+?>/g);
                // let match = regex.exec(textNode.textContent);
                // if (match) {
                //   color("blue", match);
                // }
                const result = that.syntaxhilighter.check(textNode.textContent);
                if (result) {
                    color(result.color, result.match);
                }
            }
            Array.from(this.$refs.editor.childNodes).forEach(childNode => {
                if (childNode.nodeType !== Node.TEXT_NODE) {
                    return;
                }
                split(childNode);
            });
        },
        checkAnswer() {
            this.isInputDialogVisible = false;
            // if (this.mode === "test") {
            //   this.selectedQuestionButton.textContent = this.enteredAnswer;
            //   this.enteredAnswer = "";
            //   return;
            // }
            const answer = new CodeQuestionAnswer(
                this.enteredAnswer,
                this.userId,
                this.materialId,
                this.lessonId,
                this.selectedQuestion.id
            );
            if (this.selectedQuestion.answer) {
                answer.id = this.selectedQuestion.id;
                answer.update(response => {
                    // console.log(response);
                });
            } else {
                answer.store(response => {
                    // console.log(response);
                });
            }
            //this.$set(this.selectedQuestion, "answer", answer);
            // this.selectedQuestion.answer = answer;
            const selectedQuestionIndex = this.questions.findIndex(
                question => question.id === this.selectedQuestion.id
            );
            const notFound = -1;
            if (selectedQuestionIndex !== notFound) {
                this.questions[selectedQuestionIndex].answer = answer;
            }
            // this.questions.forEach(question => {
            //     console.log("==============");
            //     console.log(question.answer);
            //     if (question.answer) {
            //         console.log(question.answer.text);
            //         console.log(question.text);
            //         console.log(
            //             !question.answer ||
            //                 (question.answer.text !== question.text &&
            //                     question.file_path === this.editedFilePath)
            //         );
            //     }
            // });
            if (this.enteredAnswer === this.selectedQuestion.text) {
                const textNode = document.createTextNode(
                    this.selectedQuestion.text
                );
                this.$refs.editor.insertBefore(
                    textNode,
                    this.selectedQuestionButton
                );
                this.selectedQuestionButton.remove();
                this.highlight();
                this.commentTitle = "正解";
                this.commentText = this.selectedQuestion.correct_comment;
                this.setEditedFileText(this.editorText());
                console.log(this.editorText() + "abc");
                this.updateEditedFile();
                this.setupEditor();
            } else {
                //console.log(this.selectedQuestion.close);
                const close = this.selectedQuestion.closes.filter(
                    c => this.enteredAnswer === c.text
                );
                if (close.length === 0) {
                    this.commentTitle = "不正解";
                    this.commentText = this.selectedQuestion.incorrect_comment;
                } else {
                    this.commentTitle = "惜しい";
                    this.commentText = close[0].comment;
                }
            }
            this.enteredAnswer = "";
        },
        closedInputDialog() {
            this.isCommentDialogVieible = true;
        },
        openCommentDialog() {
            this.$refs.comment.textContent = this.commentText;
            this.nl2br(this.$refs.comment);
        },
        showContextMenu(e) {
            this.$emit("show-context-menu", e.pageX, e.pageY);
        }
    }
};
</script>

<style scoped></style>
