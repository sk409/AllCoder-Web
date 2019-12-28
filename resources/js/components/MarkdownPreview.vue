<template>
  <div ref="preview" class="preview overflow-auto"></div>
</template>

<script>
import MarkdownParser from "../utils/markdown_parser.js";
const markdownParser = new MarkdownParser();

export default {
  name: "MarkdownPreview",
  props: {
    text: {
      type: String,
      required: true
    }
  },
  watch: {
    text: {
      immediate: true,
      handler(newValue) {
        console.log(newValue);
        this.$nextTick(() => {
          const text = this.parseQuestionLink(markdownParser.parse(newValue));
          this.$refs.preview.innerHTML = "";
          const childNodes = Array.from(
            new DOMParser().parseFromString(text, "text/html").body.childNodes
          );
          const that = this;
          //.clickQuestionButton("a");
          childNodes.forEach(childNode => {
            if (childNode.nodeName === "BUTTON") {
              Array.from(childNode.attributes).forEach(attribute => {
                if (attribute.name === "question") {
                  childNode.onclick = function() {
                    that.clickQuestionButton(attribute.value, childNode);
                  };
                }
              });
            }
            this.$refs.preview.appendChild(childNode);
          });
        });
      }
    }
  },
  methods: {
    parseQuestionLink(text) {
      const regex = /\?\{([0-9]+)\}/gm;
      let match = regex.exec(text);
      while (match) {
        text =
          text.substring(0, match.index) +
          `<button class="btn btn-primary" question="${
            match[1]
          }">問題</button>` +
          text.substring(match.index + match[0].length);
        match = regex.exec(text);
      }
      return text;
    },
    clickQuestionButton(questionId, button) {
      this.$emit("click-question-button", questionId, button);
    }
  }
};
</script>

<style scoped>
.preview {
  word-break: break-all;
  background: white;
  color: black;
  padding: 0.5rem;
}
</style>