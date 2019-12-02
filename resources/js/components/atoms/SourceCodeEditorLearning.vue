<template>
  <div ref="editor">
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
export default {
  name: "SourceCodeEditorLearning",
  props: {
    mode: {
      type: String,
      required: true
    },
    text: {
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
      answer: "",
      enteredAnswer: "",
      selectedQuqestion: null,
      selectedQuestionButton: null,
      commentTitle: "",
      commentText: ""
    };
  },
  mounted() {
    this.convertToQuestionButton();
    this.nl2br(this.$refs.editor);
    this.highlight();
  },
  methods: {
    convertToQuestionButton() {
      let startIndex = 0;
      this.questions.forEach(question => {
        if (question.startIndex !== 0) {
          this.$refs.editor.appendChild(
            document.createTextNode(
              this.text.substring(startIndex, question.startIndex)
            )
          );
        }
        const questionButton = document.createElement("span");
        questionButton.textContent = "?";
        questionButton.style.width = "1rem";
        // this.answer = this.text.substring(
        //   question.startIndex,
        //   question.endIndex
        // );
        const that = this;
        questionButton.onclick = function() {
          that.isInputDialogVisible = true;
          that.selectedQuqestion = question;
          that.selectedQuestionButton = questionButton;
        };
        this.$refs.editor.appendChild(questionButton);
        startIndex = question.endIndex;
      });
      if (startIndex !== this.text.length) {
        this.$refs.editor.appendChild(
          document.createTextNode(this.text.substring(startIndex))
        );
      }
    },
    nl2br(target) {
      Array.from(target.childNodes).forEach(childNode => {
        if (childNode.nodeType !== Node.TEXT_NODE) {
          return;
        }
        const text = childNode.textContent;
        childNode.textContent = "";
        const newLineRegex = new RegExp(/\\n/g);
        let match;
        let startIndex = 0;
        console.log(text);
        while ((match = newLineRegex.exec(text))) {
          const textNode = document.createTextNode(
            text.substring(startIndex, match.index)
          );
          childNode.parentNode.insertBefore(textNode, childNode);
          const brNode = document.createElement("br");
          childNode.parentNode.insertBefore(brNode, childNode);
          startIndex = match.index + match[0].length;
        }
        const textNode = document.createTextNode(text.substring(startIndex));
        childNode.parentNode.insertBefore(textNode, childNode);
        childNode.remove();
      });
    },
    highlight() {
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
        const regex = new RegExp(/<.+?>/g);
        let match = regex.exec(textNode.textContent);
        if (match) {
          color("blue", match);
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
      if (this.enteredAnswer === this.selectedQuqestion.answer.text) {
        const textNode = document.createTextNode(
          this.selectedQuqestion.answer.text
        );
        this.$refs.editor.insertBefore(textNode, this.selectedQuestionButton);
        this.selectedQuestionButton.remove();
        this.highlight();
        this.commentTitle = "正解";
        this.commentText = this.selectedQuqestion.answer.comment;
      } else {
        console.log(this.selectedQuqestion.close);
        const close = this.selectedQuqestion.close.filter(
          c => this.enteredAnswer === c.text
        );
        if (close.length === 0) {
          this.commentTitle = "不正解";
          this.commentText = this.selectedQuqestion.incorrectComment;
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