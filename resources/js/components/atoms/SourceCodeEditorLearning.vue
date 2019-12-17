<template>
  <div>
    <div ref="editor"></div>
    <el-dialog :visible.sync="isInputDialogVisible" @closed="closedInputDialog">
      <textarea v-model="enteredAnswer" class="w-100 h-50" placeholder="答えを入力してください"></textarea>
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
import CodeQuestion from "../../models/code_question";
import PHPSyntaxhilighter from "../../syntaxhilighters/php_syntaxhilighter.js";
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
  },
  mounted() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "setEditedFile") {
        this.setupEditor();
      }
    });
  },
  methods: {
    ...mapActions(["setEditedFileText", "updateEditedFile"]),
    setupEditor() {
      const targetQuestions = this.questions.filter(
        question =>
          !question.answered && question.file_path === this.editedFilePath
      );
      this.restoreText();
      this.$refs.editor.innerHTML = "";
      this.setTextAndQuestionButton(targetQuestions);
      this.nl2br(this.$refs.editor);
      this.highlight();
    },
    restoreText() {
      const targetQuestions = this.questions.filter(
        question => question.file_path === this.editedFilePath
      );
      if (targetQuestions.length === 0) {
        this.text = this.editedFileText;
        return;
      }
      this.text = "";
      let startIndex = 0;
      let offset = 0;
      targetQuestions.forEach(question => {
        this.text += this.editedFileText.substr(
          startIndex,
          question.start_index - offset - startIndex
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
      if (this.mode === "test") {
        this.selectedQuestionButton.textContent = this.enteredAnswer;
        this.enteredAnswer = "";
        return;
      }
      if (this.enteredAnswer === this.selectedQuestion.text) {
        const textNode = document.createTextNode(this.selectedQuestion.text);
        this.$refs.editor.insertBefore(textNode, this.selectedQuestionButton);
        this.selectedQuestionButton.remove();
        this.highlight();
        this.commentTitle = "正解";
        this.commentText = this.selectedQuestion.correct_comment;
        const question = new CodeQuestion(
          this.selectedQuestion.file_path,
          this.selectedQuestion.start_index,
          this.selectedQuestion.end_index,
          this.selectedQuestion.text,
          this.selectedQuestion.score,
          this.selectedQuestion.correct_comment,
          this.selectedQuestion.incorrect_comment,
          this.selectedQuestion.lesson_id,
          true
        );
        question.id = this.selectedQuestion.id;
        this.selectedQuestion.answered = true;
        const that = this;
        question.update(response => {
          this.setupEditor();
          this.setEditedFileText(this.text);
          this.updateEditedFile();
        });
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
    }
  }
};
</script>

<style scoped>
</style>