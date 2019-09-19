<template>
  <div id="question-item">
    <pre class="question-answer" @click="onclick">{{inputButton.answer}}</pre>
  </div>
</template>

<script>
export default {
  name: "question-item",
  props: {
    inputButton: Object
  },
  methods: {
    onclick() {
      //this.$emit("select-description", this.descriptionId);
    }
  }
};
</script>