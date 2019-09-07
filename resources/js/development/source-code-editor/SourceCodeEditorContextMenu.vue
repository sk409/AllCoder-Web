<template>
  <div
    id="source-code-editor-context-menu"
    class="btn-group-vertical border bg-white"
    :style="style"
  >
    <button
      type="button"
      class="btn btn-light"
      v-show="isTextSelected"
      @click="onStoreQuestion"
    >問題に追加</button>
    <button
      type="button"
      class="btn btn-light"
      v-show="selectedDescription"
      @click="onStoreDescriptionTarget"
    >説明対象に追加</button>
    <button type="button" class="btn btn-light">テストボタン</button>
  </div>
</template>

<script>
import Question from "../question/Question.js";
import DescriptionTarget from "../description/DescriptionTarget";
export default {
  name: "source-code-editor-context-menu",
  props: {
    left: Number,
    top: Number,
    startIndex: Number,
    endIndex: Number,
    file: Object,
    selectedDescription: Object,
    questions: Array,
    descriptionTargets: Array
  },
  methods: {
    onStoreQuestion() {
      const answer = this.file.text.substring(this.startIndex, this.endIndex);
      const question = new Question(
        null,
        this.startIndex,
        this.endIndex,
        this.file.id,
        answer
      );
      question.store();
      this.questions.push(question);
    },
    onStoreDescriptionTarget() {
      const descriptionTarget = new DescriptionTarget(
        null,
        this.startIndex,
        this.endIndex,
        this.selectedDescription.id
      );
      descriptionTarget.store();
      this.descriptionTargets.push(descriptionTarget);
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
      };
    }
  }
};
</script>