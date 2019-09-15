<template>
  <div
    id="source-code-editor-context-menu"
    class="btn-group-vertical border bg-white"
    :style="style"
  >
    <button
      type="button"
      class="btn btn-light"
      v-show="isTextSelected && selectedDescription"
      @click="onStoreQuestion"
    >問題に追加</button>
    <button
      type="button"
      class="btn btn-light"
      v-show="isTextSelected && selectedDescription"
      @click="onStoreDescriptionTarget"
    >説明対象に追加</button>
    <button type="button" class="btn btn-light">テストボタン</button>
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
    questions: Array,
    descriptionTargets: Array
  },
  methods: {
    onStoreQuestion() {
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
            this.selectedDescription.id,
            answer
          );
          const that = this;
          question.store(response => {
            that.questions.push(question);
            const lineRegex = /\n/g;
            let lineMatch = lineRegex.exec(answer);
            let lineStartIndex = 0;
            let inputButtonIndex = 0;
            while (true) {
              const storeInputButton = function(line) {
                console.log("*************");
                console.log(line);
                console.log("*************");
                const spaceRegex = / /g;
                let spaceMatch = spaceRegex.exec(line);
                let spaceStartIndex = 0;
                while (true) {
                  if (!spaceMatch) {
                    const startIndex =
                      that.startIndex + lineStartIndex + spaceStartIndex;
                    let endIndex =
                      that.startIndex +
                      (lineMatch ? lineMatch.index : answer.length);
                    if (startIndex === endIndex) {
                      ++endIndex;
                    }
                    const inputButton = new InputButton(
                      null,
                      inputButtonIndex,
                      startIndex,
                      endIndex,
                      question.id
                    );
                    ++inputButtonIndex;
                    inputButton.store();
                    console.log(
                      that.file.text.substring(
                        inputButton.startIndex,
                        inputButton.endIndex
                      )
                    );
                    break;
                  }
                  const startIndex =
                    that.startIndex + lineStartIndex + spaceStartIndex;
                  let endIndex =
                    that.startIndex + lineStartIndex + spaceMatch.index;
                  if (startIndex === endIndex) {
                    ++endIndex;
                  }
                  const inputButton = new InputButton(
                    null,
                    inputButtonIndex,
                    startIndex,
                    endIndex,
                    question.id
                  );
                  ++inputButtonIndex;
                  inputButton.store();
                  console.log(
                    that.file.text.substring(
                      inputButton.startIndex,
                      inputButton.endIndex
                    )
                  );
                  if (spaceStartIndex !== spaceMatch.index) {
                    const spaceButton = new InputButton(
                      null,
                      inputButtonIndex,
                      that.startIndex + lineStartIndex + spaceMatch.index,
                      that.startIndex + lineStartIndex + spaceMatch.index + 1,
                      question.id
                    );
                    ++inputButtonIndex;
                    spaceButton.store();
                    console.log(
                      that.file.text.substring(
                        spaceButton.startIndex,
                        spaceButton.endIndex
                      )
                    );
                  }
                  spaceStartIndex = spaceMatch.index + 1;
                  spaceMatch = spaceRegex.exec(line);
                }
                if (line && lineMatch) {
                  const inputButton = new InputButton(
                    null,
                    inputButtonIndex,
                    that.startIndex + lineMatch.index,
                    that.startIndex + lineMatch.index + 1,
                    question.id
                  );
                  inputButton.store();
                  ++inputButtonIndex;
                }
              };
              if (!lineMatch) {
                storeInputButton(answer.substring(lineStartIndex));
                break;
              }
              storeInputButton(
                answer.substring(lineStartIndex, lineMatch.index)
              );
              lineStartIndex = lineMatch.index + 1;
              lineMatch = lineRegex.exec(answer);
            }
          });
        }
      );
    },
    onStoreDescriptionTarget() {
      const descriptionTarget = new DescriptionTarget(
        null,
        this.startIndex,
        this.endIndex,
        this.selectedDescription.id,
        this.file.text.substring(this.startIndex, this.endIndex)
      );
      descriptionTarget.store();
      this.selectedDescription.targets.push(descriptionTarget);
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