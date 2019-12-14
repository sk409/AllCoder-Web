<template>
  <div id="source-code-editor-context-menu">
    <div class="d-flex">
      <div>
        <button
          type="button"
          class="btn btn-light"
          @mouseover="showStoreQuestionOptions"
          @mouseleave="hideStoreQuestionOptions"
        >問題に追加</button>
      </div>
      <div class="d-flex flex-column" v-show="areStoreQuestionOptionsShown">
        <button type="button" class="btn btn-light" @click="showDialogCode">トリミング</button>
        <!-- <button
          type="button"
          class="btn btn-light"
          @click="storeQuestion([trimmingOptions.forward])"
        >前方トリミング</button>
        <button
          type="button"
          class="btn btn-light"
          @click="storeQuestion([trimmingOptions.backwawrd])"
        >後方トリミング</button>
        <button type="button" class="btn btn-light" @click="storeQuestion([])">トリミングなし</button>-->
      </div>
    </div>
  </div>
</template>

<script>
//import Question from "../models/question.js";
import { mapState } from "vuex";
export default {
  name: "SourceCodeEditorCreatingContextMenu",
  props: {
    startIndex: {
      type: Number,
      required: true
    },
    endIndex: {
      type: Number,
      required: true
    },
    lessonId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      areStoreQuestionOptionsShown: false,
      trimmingOptions: {
        forward: "forward",
        backward: "backward"
      }
    };
  },
  computed: {
    ...mapState({
      filePath: state => (state.editedFile ? state.editedFile.path : null),
      fileText: state => (state.editedFile ? state.editedFile.text : null)
    }),
    answer() {
      if (!this.fileText) {
        return "";
      }
      return this.fileText.substring(this.startIndex, this.endIndex);
    }
  },
  methods: {
    showStoreQuestionOptions() {
      this.areStoreQuestionOptionsShown = true;
    },
    hideStoreQuestionOptions() {
      this.areStoreQuestionOptionsShown = false;
    },
    showDialogCode() {
      this.$emit("show-dialog-code");
    },
    // storeQuestion(trimmingOptions) {
    //   const question = new Question(
    //     null,
    //     this.filePath,
    //     this.startIndex,
    //     this.endIndex,
    //     this.answer,
    //     this.lessonId
    //   );
    //   question.store(response => {
    //     console.log(response);
    //   });
    //   // const that = this;
    //   // const answer = this.file.text.substring(this.startIndex, this.endIndex);
    //   // Question.index(
    //   //   { description_id: this.selectedDescription.id },
    //   //   response => {
    //   //     const index = response.data.length
    //   //       ? Math.max(...response.data.map(question => question.index)) + 1
    //   //       : 0;
    //   //     const question = new Question(
    //   //       null,
    //   //       index,
    //   //       this.selectedDescription.id
    //   //     );
    //   //     const that = this;
    //   //     question.store(response => {
    //   //       const lineRegex = /\n/g;
    //   //       let lineMatch = lineRegex.exec(answer);
    //   //       let lineStartIndex = 0;
    //   //       let lineEndIndex = 0;
    //   //       let inputButtonIndex = 0;
    //   //       while (true) {
    //   //         const storeInputButton = function(line) {
    //   //           console.log("*************");
    //   //           console.log(line);
    //   //           console.log("*************");
    //   //           const spaceRegex = / /g;
    //   //           let spaceMatch = spaceRegex.exec(line);
    //   //           let spaceStartIndex = 0;
    //   //           const createInputButton = function(startIndex, endIndex) {
    //   //             if (lineEndIndex <= lineStartIndex + spaceStartIndex) {
    //   //               return;
    //   //             }
    //   //             const lineNumber =
    //   //               that.file.text.substring(0, endIndex).split("\n").length -
    //   //               1;
    //   //             const inputButton = new InputButton(
    //   //               null,
    //   //               inputButtonIndex,
    //   //               startIndex,
    //   //               endIndex,
    //   //               lineNumber,
    //   //               question.id,
    //   //               that.file.text.substring(startIndex, endIndex)
    //   //             );
    //   //             ++inputButtonIndex;
    //   //             question.inputButtons.push(inputButton);
    //   //             inputButton.store();
    //   //             const text = that.file.text.substring(
    //   //               inputButton.startIndex,
    //   //               inputButton.endIndex
    //   //             );
    //   //             // if (text == " ") {
    //   //             //   console.log("スペース");
    //   //             // } else if (text == "\n") {
    //   //             //   console.log("開業");
    //   //             // } else {
    //   //             //   console.log(text);
    //   //             // }
    //   //             return inputButton;
    //   //           };
    //   //           while (true) {
    //   //             if (!spaceMatch) {
    //   //               const startIndex =
    //   //                 that.startIndex + lineStartIndex + spaceStartIndex;
    //   //               let endIndex = that.startIndex + lineEndIndex;
    //   //               if (startIndex === endIndex) {
    //   //                 ++endIndex;
    //   //               }
    //   //               const inputButton = createInputButton(startIndex, endIndex);
    //   //               break;
    //   //             }
    //   //             const startIndex =
    //   //               that.startIndex + lineStartIndex + spaceStartIndex;
    //   //             let endIndex =
    //   //               that.startIndex + lineStartIndex + spaceMatch.index;
    //   //             if (startIndex === endIndex) {
    //   //               ++endIndex;
    //   //             }
    //   //             const inputButton = createInputButton(startIndex, endIndex);
    //   //             if (spaceStartIndex !== spaceMatch.index) {
    //   //               const startIndex =
    //   //                 that.startIndex + lineStartIndex + spaceMatch.index;
    //   //               const endIndex =
    //   //                 that.startIndex + lineStartIndex + spaceMatch.index + 1;
    //   //               const inputButton = createInputButton(startIndex, endIndex);
    //   //             }
    //   //             spaceStartIndex = spaceMatch.index + 1;
    //   //             spaceMatch = spaceRegex.exec(line);
    //   //           }
    //   //         };
    //   //         lineEndIndex = lineMatch ? lineMatch.index : answer.length;
    //   //         const line = lineMatch
    //   //           ? answer.substring(lineStartIndex, lineMatch.index)
    //   //           : answer.substring(lineStartIndex);
    //   //         const trimmedLineIndices = this.trim(
    //   //           lineStartIndex,
    //   //           lineEndIndex,
    //   //           line,
    //   //           trimmingOptions
    //   //         );
    //   //         lineStartIndex = trimmedLineIndices.lineStartIndex;
    //   //         lineEndIndex = trimmedLineIndices.lineEndIndex;
    //   //         const trimmedLine = answer.substring(
    //   //           lineStartIndex,
    //   //           lineEndIndex
    //   //         );
    //   //         if (!lineMatch) {
    //   //           storeInputButton(trimmedLine);
    //   //           break;
    //   //         }
    //   //         storeInputButton(trimmedLine);
    //   //         lineStartIndex = lineMatch.index + 1;
    //   //         lineMatch = lineRegex.exec(answer);
    //   //       }
    //   //     });
    //   //   }
    //   // );
    //   this.$emit("hide");
    // },
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