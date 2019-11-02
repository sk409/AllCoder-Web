<template>
  <div class="w-100 h-100" v-html="markedText"></div>
</template>

<script>
import marked from "marked";
export default {
  name: "development-reading",
  props: {
    markdownText: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      markedText: ""
    };
  },
  mounted() {
    this.markedText = marked(this.markdownText);
  }
};
</script>