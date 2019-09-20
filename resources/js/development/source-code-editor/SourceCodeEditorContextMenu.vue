<template>
  <div id="source-code-editor-context-menu" :style="menuStyle" @mouseleave="onHideOptions">
    <div class="d-flex">
      <div>
        <button
          type="button"
          class="source-code-editor-context-menu-button"
          v-show="isTextSelected && selectedDescription"
          @mouseover="onShowStoreQuestionOptions"
        >問題に追加</button>

        <button
          type="button"
          class="source-code-editor-context-menu-button"
          v-show="isTextSelected && selectedDescription"
          @mouseover="onShowStoreDescriptionTargetOptions"
        >説明対象に追加</button>
      </div>
      <div v-show="areStoreQuestionOptionsShown">
        <button
          type="button"
          class="source-code-editor-context-menu-option-button"
          @click="onStoreQuestion([trimmingOptions.forward, trimmingOptions.backward])"
        >トリミング</button>
        <button
          type="button"
          class="source-code-editor-context-menu-option-button"
          @click="onStoreQuestion([trimmingOptions.forward])"
        >前方トリミング</button>
        <button
          type="button"
          class="source-code-editor-context-menu-option-button"
          @click="onStoreQuestion([trimmingOptions.backwawrd])"
        >後方トリミング</button>
        <button
          type="button"
          class="source-code-editor-context-menu-option-button"
          @click="onStoreQuestion([])"
        >トリミングなし</button>
      </div>
      <div v-show="areStoreDescriptionTargetOptionsShown">
        <button
          type="button"
          class="source-code-editor-context-menu-option-button"
          @click="onStoreDescriptionTarget([trimmingOptions.forward, trimmingOptions.backward])"
        >トリミング</button>
        <button
          type="button"
          class="source-code-editor-context-menu-option-button"
          @click="onStoreDescriptionTarget([trimmingOptions.forward])"
        >前方トリミング</button>
        <button
          type="button"
          class="source-code-editor-context-menu-option-button"
          @click="onStoreDescriptionTarget([trimmingOptions.backward])"
        >後方トリミング</button>
        <button
          type="button"
          class="source-code-editor-context-menu-option-button"
          @click="onStoreDescriptionTarget([])"
        >トリミングなし</button>
      </div>
    </div>
  </div>
</template>

<script>
import DescriptionTarget from "../description/DescriptionTarget";
import InputButton from "../question/InputButton.js";
import Question from "../question/Question.js";
export default {
  name: "source-code-editor-context-menu",
  props: {
    left: Number,
    top: Number,
    startIndex: Number,
    endIndex: Number,
    file: Object,
    selectedDescription: Object,
    descriptionTargets: Array
  },
  data: function() {
    return {
      areStoreQuestionOptionsShown: false,
      areStoreDescriptionTargetOptionsShown: false,
      trimmingOptions: {
        forward: "forward",
        backward: "backward"
      }
    };
  },
  computed: {
    menuStyle() {
      return {
        left: this.left + "px",
        top: this.top + "px"
      };
    }
  },
  methods: {
    onShowStoreQuestionOptions() {
      this.onHideOptions();
      this.areStoreQuestionOptionsShown = true;
    },
    onShowStoreDescriptionTargetOptions() {
      this.onHideOptions();
      this.areStoreDescriptionTargetOptionsShown = true;
    },
    onHideOptions() {
      this.areStoreQuestionOptionsShown = false;
      this.areStoreDescriptionTargetOptionsShown = false;
    },
    onStoreQuestion(trimmingOptions) {
      const that = this;
      const answer = this.file.text.substring(this.startIndex, this.endIndex);
      Question.index(
        { description_id: this.selectedDescription.id },
        response => {
          const index = response.data.length
            ? Math.max(...response.data.map(question => question.index)) + 1
            : 0;
          const question = new Question(
            null,
            index,
            this.selectedDescription.id
          );
          const that = this;
          question.store(response => {
            const lineRegex = /\n/g;
            let lineMatch = lineRegex.exec(answer);
            let lineStartIndex = 0;
            let lineEndIndex = 0;
            let inputButtonIndex = 0;
            while (true) {
              const storeInputButton = function(line) {
                console.log("*************");
                console.log(line);
                console.log("*************");
                const spaceRegex = / /g;
                let spaceMatch = spaceRegex.exec(line);
                let spaceStartIndex = 0;
                const createInputButton = function(startIndex, endIndex) {
                  if (lineEndIndex <= lineStartIndex + spaceStartIndex) {
                    return;
                  }
                  const lineNumber =
                    that.file.text.substring(0, endIndex).split("\n").length -
                    1;
                  const inputButton = new InputButton(
                    null,
                    inputButtonIndex,
                    startIndex,
                    endIndex,
                    lineNumber,
                    question.id,
                    that.file.text.substring(startIndex, endIndex)
                  );
                  ++inputButtonIndex;
                  question.inputButtons.push(inputButton);
                  inputButton.store();
                  const text = that.file.text.substring(
                    inputButton.startIndex,
                    inputButton.endIndex
                  );
                  // if (text == " ") {
                  //   console.log("スペース");
                  // } else if (text == "\n") {
                  //   console.log("開業");
                  // } else {
                  //   console.log(text);
                  // }
                  return inputButton;
                };
                while (true) {
                  if (!spaceMatch) {
                    const startIndex =
                      that.startIndex + lineStartIndex + spaceStartIndex;
                    let endIndex = that.startIndex + lineEndIndex;
                    if (startIndex === endIndex) {
                      ++endIndex;
                    }
                    const inputButton = createInputButton(startIndex, endIndex);
                    break;
                  }
                  const startIndex =
                    that.startIndex + lineStartIndex + spaceStartIndex;
                  let endIndex =
                    that.startIndex + lineStartIndex + spaceMatch.index;
                  if (startIndex === endIndex) {
                    ++endIndex;
                  }
                  const inputButton = createInputButton(startIndex, endIndex);
                  if (spaceStartIndex !== spaceMatch.index) {
                    const startIndex =
                      that.startIndex + lineStartIndex + spaceMatch.index;
                    const endIndex =
                      that.startIndex + lineStartIndex + spaceMatch.index + 1;
                    const inputButton = createInputButton(startIndex, endIndex);
                  }
                  spaceStartIndex = spaceMatch.index + 1;
                  spaceMatch = spaceRegex.exec(line);
                }
              };
              lineEndIndex = lineMatch ? lineMatch.index : answer.length;
              const line = lineMatch
                ? answer.substring(lineStartIndex, lineMatch.index)
                : answer.substring(lineStartIndex);
              const trimmedLineIndices = this.trim(
                lineStartIndex,
                lineEndIndex,
                line,
                trimmingOptions
              );
              lineStartIndex = trimmedLineIndices.lineStartIndex;
              lineEndIndex = trimmedLineIndices.lineEndIndex;
              const trimmedLine = answer.substring(
                lineStartIndex,
                lineEndIndex
              );
              if (!lineMatch) {
                storeInputButton(trimmedLine);
                break;
              }
              storeInputButton(trimmedLine);
              lineStartIndex = lineMatch.index + 1;
              lineMatch = lineRegex.exec(answer);
            }
          });
        }
      );
    },
    onStoreDescriptionTarget(trimmingOptions) {
      const that = this;
      const storeDescriptionTarget = function(lineStartIndex, lineEndIndex) {
        if (lineStartIndex === lineEndIndex) {
          return;
        }
        const descriptionTarget = new DescriptionTarget(
          null,
          that.startIndex + lineStartIndex,
          that.startIndex + lineEndIndex,
          that.selectedDescription.id,
          that.file.text.substring(
            that.startIndex + lineStartIndex,
            that.startIndex + lineEndIndex
          )
        );
        descriptionTarget.store();
        that.selectedDescription.targets.push(descriptionTarget);
      };
      const describedText = this.file.text.substring(
        this.startIndex,
        this.endIndex
      );
      const lineRegex = /\n/g;
      let lineMatch = lineRegex.exec(describedText);
      let lineStartIndex = 0;
      let lineEndIndex = 0;
      while (true) {
        lineEndIndex = lineMatch ? lineMatch.index : describedText.length;
        const line = describedText.substring(lineStartIndex, lineEndIndex);
        const trimmedLineIndices = this.trim(
          lineStartIndex,
          lineEndIndex,
          line,
          trimmingOptions
        );
        lineStartIndex = trimmedLineIndices.lineStartIndex;
        lineEndIndex = trimmedLineIndices.lineEndIndex;
        storeDescriptionTarget(lineStartIndex, lineEndIndex);
        if (!lineMatch) {
          break;
        }
        lineStartIndex = lineMatch.index + 1;
        lineMatch = lineRegex.exec(describedText);
      }
    },
    isTextSelected() {
      return getSelection().toString().length;
    },
    trim(lineStartIndex, lineEndIndex, line, trimmingOptions) {
      if (trimmingOptions.includes(this.trimmingOptions.forward)) {
        const regex = /^( *).*?$/;
        const match = regex.exec(line);
        if (match && match.length === 2) {
          lineStartIndex += match[1].length;
        }
      }
      if (trimmingOptions.includes(this.trimmingOptions.backward)) {
        const regex = /^.*?( *)$/;
        const match = regex.exec(line);
        if (match && match.length === 2) {
          lineEndIndex -= match[1].length;
        }
      }
      return { lineStartIndex, lineEndIndex };
    }
  }
};
</script>