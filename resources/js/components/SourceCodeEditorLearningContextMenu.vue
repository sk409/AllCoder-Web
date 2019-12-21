<template>
  <div>
    <div class="d-flex">
      <div>
        <button type="button" class="btn btn-light" @click="showQuestionList">問題一覧</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SourceCodeEditorLearningContextMenu",
  data() {
    return {};
  },
  methods: {
    showQuestionList() {
      this.$emit("show-question-list");
    }
  }
};
</script>