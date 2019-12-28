<template>
  <div @contextmenu.stop.prevent="showContextMenu">
    <div ref="editor" class="w-100 h-100" style="overflow:scroll;"></div>
    <el-dialog :visible.sync="isInputDialogVisible" @closed="closedInputDialog">
      <textarea v-model="enteredAnswer" class="w-100 h-50" placeholder="答えを入力してください"></textarea>
      <div class="text-center">
        <el-button type="primary" @click="checkAnswer">解答</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="isCommentDialogVieible" @opened="openCommentDialog">
      <div ref="comment"></div>
      <el-divider class="my-2"></el-divider>
      <div v-show="isCorrect">
        <el-button type="danger" @click="newLearningResult(1)">分からなかった</el-button>
        <el-button type="warning" @click="newLearningResult(2)">難しい</el-button>
        <el-button type="primary" @click="newLearningResult(3)">できた</el-button>
        <el-button type="success" @click="newLearningResult(4)">余裕</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CodeQuestion from "../models/code_question";
import CodeQuestionAnswer from "../models/code_question_answer.js";
import LearningResult from "../models/learning_result.js";
import PHPSyntaxhilighter from "../syntaxhilighters/php_syntaxhilighter.js";
import { mapActions, mapGetters } from "vuex";

const questionButtons = [];
export default {
  name: "SourceCodeEditorLearning",
  props: {
    activeQuestionIds: {
      type: Array,
      required: true
    },
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
      isCorrect: false,
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
  },
  mounted() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "setEditedFile") {
        this.setupEditor();
      }
    });
  },
  watch: {
    activeQuestionIds() {
      this.activateQuestionButtons();
    }
  },
  methods: {
    ...mapActions(["setEditedFileText", "updateEditedFile"]),
    activateQuestionButtons() {
      let minY = 0;
      questionButtons.forEach(questionButton => {
        const index = this.activeQuestionIds.findIndex(
          activeQuestionId => activeQuestionId == questionButton.questionId
        );
        const notFound = -1;
        if (index === notFound) {
          questionButton.classList.remove("active-question");
        } else {
          minY = questionButton.getBoundingClientRect().top;
          questionButton.classList.add("active-question");
        }
      });
      this.scrollTo(minY);
    },
    scrollTo(y) {
      this.$refs.editor.scrollTop = 2000;
      //console.log(this.$refs.editor.scrollTop);
    },
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
        result += this.text.substr(seek, targetQuestion.start_index - seek);
        seek = targetQuestion.end_index;
      });
      result += this.text.substr(seek, this.text.length);
      return result;
    },
    setupEditor() {
      this.restoreText();
      //this.text = this.text.replace(/ /g, "\u00a0");
      this.$refs.editor.innerHTML = "";
      this.setTextAndQuestionButton(this.targetQuestions());
      this.nl2br(this.$refs.editor);
      this.highlight();
    },
    restoreText() {
      const targetQuestions = this.targetQuestions();
      if (targetQuestions.length === 0) {
        this.text = this.editedFileText;
        return;
      }
      this.text = "";
      let startIndex = 0;
      let offset = 0;
      targetQuestions.forEach(question => {
        this.text += this.editedFileText.substring(
          startIndex,
          question.start_index - offset
        );
        this.text += question.text;
        startIndex = question.start_index - offset;
        offset += question.text.length;
      });
      this.text += this.editedFileText.substr(startIndex);
    },
    setTextAndQuestionButton(questions) {
      let startIndex = 0;
      questions.forEach(question => {
        if (question.startIndex !== 0) {
          this.$refs.editor.appendChild(
            document.createTextNode(
              this.text.substring(startIndex, question.start_index)
            )
          );
        }
        const questionButton = document.createElement("span");
        questionButtons.push(questionButton);
        questionButton.textContent = "?";
        questionButton.classList.add("question-button");
        questionButton.questionId = question.id;
        const that = this;
        questionButton.onclick = function() {
          that.isInputDialogVisible = true;
          that.selectedQuestion = question;
          that.selectedQuestionButton = questionButton;
        };
        this.$refs.editor.appendChild(questionButton);
        startIndex = question.end_index;
      });
      this.activateQuestionButtons();
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
              textNode.parentNode.insertBefore(node, before.nextSibling);
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
      const selectedQuestionIndex = this.questions.findIndex(
        question => question.id === this.selectedQuestion.id
      );
      const notFound = -1;
      if (selectedQuestionIndex !== notFound) {
        this.questions[selectedQuestionIndex].answer = answer;
      }
      if (this.enteredAnswer === this.selectedQuestion.text) {
        const textNode = document.createTextNode(this.selectedQuestion.text);
        this.$refs.editor.insertBefore(textNode, this.selectedQuestionButton);
        this.selectedQuestionButton.remove();
        this.highlight();
        this.isCorrect = true;
        this.commentTitle = "正解";
        this.commentText = this.selectedQuestion.correct_comment;
        //console.log(this.editorText());
        this.setEditedFileText(this.editorText());
        this.updateEditedFile();
        this.setupEditor();
      } else {
        this.isCorrect = false;
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
    newLearningResult(evaluation) {
      this.isCommentDialogVieible = false;
      LearningResult.index(
        {
          user_id: this.userId,
          material_id: this.materialId,
          lesson_id: this.lessonId,
          code_question_id: this.selectedQuestion.id
        },
        response => {
          if (response.data.length !== 0) {
            const data = response.data[0];
            const learningResult = new LearningResult(
              evaluation,
              data.count + 1,
              data.user_id,
              data.material_id,
              data.lesson_id,
              data.code_question_id
            );
            learningResult.id = data.id;
            learningResult.update(response => {
              if (response.status === 200) {
                this.$notify.success({
                  message: "学習結果を更新しました",
                  duration: 3000
                });
              } else {
                this.$notify.error({
                  message: "学習結果の更新に失敗しました",
                  duration: 3000
                });
              }
            });
          } else {
            const learningResult = new LearningResult(
              evaluation,
              1,
              this.userId,
              this.materialId,
              this.lessonId,
              this.selectedQuestion.id
            );
            learningResult.store(response => {
              if (response.status === 200) {
                this.$notify.success({
                  message: "学習結果を保存しました",
                  duration: 3000
                });
              } else {
                this.$notify.error({
                  message: "学習結果の保存に失敗しました",
                  duration: 3000
                });
              }
            });
          }
        }
      );
    },
    showContextMenu(e) {
      this.$emit("show-context-menu", e.pageX, e.pageY);
    }
  }
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgb(100, 100, 100);
}
::-webkit-scrollbar-thumb {
  background-color: rgb(150, 150, 150);
  border-radius: 10px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
}
</style>

<style>
.question-button {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid rgb(240, 240, 240);
  cursor: pointer;
}

.question-button:hover,
.active-question {
  border-color: #67c23a;
}
</style>
