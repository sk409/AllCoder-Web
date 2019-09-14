<template>
  <div class="border-bottom">
    <pre @click="onclick">{{question.answer}}</pre>
  </div>
</template>

<script>
export default {
  name: "question-item",
  props: {
    question: Object
  },
  methods: {
    onclick() {
      this.$emit("select-description", this.question.descriptionId);
    }
  }
};
</script>