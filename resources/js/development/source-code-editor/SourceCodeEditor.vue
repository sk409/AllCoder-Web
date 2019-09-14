<template>
  <textarea
    id="source-code-editor"
    class="w-100 h-100"
    :value="file ? file.text : ''"
    :disabled="!file"
    @input="oninput"
    @click="onclick"
    @select="onselect"
    @focus="onfocus"
    @paste="onpaste"
    @keydown.left="onArrowKeyDown"
    @keydown.right="onArrowKeyDown"
    @keydown.up="onArrowKeyDown"
    @keydown.down="onArrowKeyDown"
    @contextmenu.stop.prevent="oncontextmenu"
  ></textarea>
</template>

<script>
import { Promise } from "q";
import Question from "../question/Question.js";
export default {
  name: "source-code-editor",
  props: {
    file: Object,
    questions: Array,
    descriptionTargets: Array
  },
  data: function() {
    return {
      textarea: null,
      textBeforeInput: null,
      selectedRangeBeforeInput: null,
      pastedText: null,
      lastTextLength: null,
      inputQueue: Promise.resolve(),
      delayedUpdate: _.debounce(this.update, 500)
    };
  },
  methods: {
    oninput(e) {
      const that = this;
      const selectionStart = e.target.selectionStart;
      const selectedRangeBeforeInput = this.selectedRangeBeforeInput
        ? {
            start: this.selectedRangeBeforeInput.start,
            end: this.selectedRangeBeforeInput.end
          }
        : null;
      // console.log(e.target.value.length);
      // console.log(that.lastTextLength);
      if (
        e.inputType === "insertText" ||
        e.inputType === "insertLineBreak" ||
        (e.inputType === "insertCompositionText" &&
          this.lastTextLength === null) ||
        (e.inputType === "insertCompositionText" &&
          (selectedRangeBeforeInput !== null &&
            0 <
              selectedRangeBeforeInput.end - selectedRangeBeforeInput.start)) ||
        (e.inputType === "insertCompositionText" &&
          e.target.value.length - this.lastTextLength === 1)
      ) {
        // console.log("insertText");
        this.inputQueue.then(function() {
          that.insertText(selectedRangeBeforeInput, selectionStart);
        });
      } else if (
        e.inputType === "deleteContentBackward" ||
        (e.inputType === "insertCompositionText" &&
          this.lastTextLength - e.target.value.length === 1)
      ) {
        // console.log("deleteContentBackward");
        this.inputQueue.then(function() {
          that.deleteContentBackward(selectedRangeBeforeInput, selectionStart);
        });
      } else if (
        e.inputType === "insertCompositionText" &&
        that.lastTextLength !== e.target.value.length
      ) {
        that.insertCompositionText(selectionStart, e);
      } else if (e.inputType === "insertFromPaste") {
        //console.log(e);
        this.inputQueue.then(function() {
          that.insertFromPaste(selectedRangeBeforeInput, selectionStart);
        });
      } else if (e.inputType === "deleteByCut") {
        this.inputQueue.then(function() {
          that.deleteByCut(selectedRangeBeforeInput, selectionStart);
        });
      }
      this.textarea = e.target;
      this.selectedRangeBeforeInput = null;
      this.lastTextLength = e.target.value.length;
      this.delayedUpdate();
    },
    onclick(e) {
      this.selectedRangeBeforeInput = null;
    },
    onselect(e) {
      this.selectedRangeBeforeInput = {
        start: e.target.selectionStart,
        end: e.target.selectionEnd
      };
    },
    onfocus(e) {
      this.selectedRangeBeforeInput = null;
    },
    onpaste(e) {
      this.pastedText = e.clipboardData.getData("text");
    },
    onArrowKeyDown(e) {
      this.selectedRangeBeforeInput = null;
    },
    oncontextmenu(e) {
      this.$emit("show-context-menu", e);
    },
    insertText(selectedRangeBeforeInput, selectionStart) {
      const that = this;
      if (
        selectedRangeBeforeInput === null ||
        selectedRangeBeforeInput.start === selectedRangeBeforeInput.end
      ) {
        const caretPosition = selectionStart - 1;
        // console.log(caretPosition);
        this.questions.concat(this.descriptionTargets).forEach(item => {
          // console.log(item.startIndex);
          let updated = false;
          if (caretPosition <= item.startIndex) {
            // console.log("START");
            ++item.startIndex;
            updated = true;
          }
          if (caretPosition < item.endIndex) {
            // console.log("END");
            ++item.endIndex;
            updated = true;
          }
          if (updated) {
            item.hasUpdated = true;
            that.delayedUpdate();
          }
        });
      } else {
        this.questions.concat(this.descriptionTargets).forEach(item => {
          if (
            selectedRangeBeforeInput.start <= item.startIndex &&
            item.endIndex <= selectedRangeBeforeInput.end //  |---[---]---|
          ) {
            item.hasDeleted = true;
            that.delayedUpdate();
          } else {
            if (
              selectedRangeBeforeInput.start <= item.startIndex &&
              item.startIndex <= selectedRangeBeforeInput.end &&
              selectedRangeBeforeInput.end < item.endIndex //  |---[---|---)
            ) {
              item.startIndex = selectedRangeBeforeInput.start + 1;
              item.endIndex -=
                selectedRangeBeforeInput.end -
                selectedRangeBeforeInput.start -
                1;
            } else if (
              item.startIndex < selectedRangeBeforeInput.start &&
              selectedRangeBeforeInput.start <= item.endIndex &&
              item.endIndex <= selectedRangeBeforeInput.end // (---|---]---|
            ) {
              item.endIndex = selectedRangeBeforeInput.start;
            } else if (
              item.startIndex < selectedRangeBeforeInput.start &&
              selectedRangeBeforeInput.end < item.endIndex // (---|---|---)
            ) {
              item.endIndex -=
                selectedRangeBeforeInput.end -
                selectedRangeBeforeInput.start -
                1;
            } else if (selectedRangeBeforeInput.end < item.startIndex) {
              // |---|---(---)
              item.startIndex -=
                selectedRangeBeforeInput.end -
                selectedRangeBeforeInput.start -
                1;
              item.endIndex -=
                selectedRangeBeforeInput.end -
                selectedRangeBeforeInput.start -
                1;
            }
            item.hasUpdated = !(item.endIndex < selectedRangeBeforeInput.start); //  (---)---[---]
            that.delayedUpdate();
          }
        });
      }
    },
    insertCompositionText(selectionStart, e) {
      const that = this;
      const diff = e.target.value.length - this.lastTextLength;
      const caretPosition = selectionStart - diff;
      this.questions.concat(this.descriptionTargets).forEach(item => {
        let updated = false;
        if (caretPosition <= item.startIndex) {
          item.startIndex += diff;
          updated = true;
        }
        if (caretPosition <= item.endIndex) {
          item.endIndex += diff;
          updated = true;
        }
        if (updated) {
          item.hasUpdated = true;
          that.delayedUpdate();
        }
      });
    },
    deleteContentBackward(selectedRangeBeforeInput, selectionStart) {
      const that = this;
      if (
        selectedRangeBeforeInput === null ||
        selectedRangeBeforeInput.start === selectedRangeBeforeInput.end
      ) {
        const caretPosition = selectionStart + 1;
        //console.log(caretPosition);
        this.questions.concat(this.descriptionTargets).forEach(item => {
          let updated = false;
          // console.log(question.startIndex);
          // console.log(question.endIndex);
          if (caretPosition <= item.startIndex) {
            //console.log("START");
            --item.startIndex;
            updated = true;
          }
          if (caretPosition <= item.endIndex) {
            //console.log("END");
            --item.endIndex;
            updated = true;
          }
          if (updated) {
            if (item.endIndex - item.startIndex == 0) {
              item.hasDeleted = true;
            } else {
              item.hasUpdated = true;
              that.delayedUpdate();
            }
          }
        });
      } else {
        this.questions.concat(this.descriptionTargets).forEach(item => {
          if (
            selectedRangeBeforeInput.start <= item.startIndex &&
            item.endIndex <= selectedRangeBeforeInput.end //  |---[---]---|
          ) {
            item.hasDeleted = true;
            that.delayedUpdate();
          } else {
            if (
              selectedRangeBeforeInput.start <= item.startIndex &&
              item.startIndex <= selectedRangeBeforeInput.end &&
              selectedRangeBeforeInput.end < item.endIndex //  |---[---|---)
            ) {
              item.startIndex = selectedRangeBeforeInput.start;
              item.endIndex -=
                selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
            } else if (
              item.startIndex < selectedRangeBeforeInput.start &&
              selectedRangeBeforeInput.start <= item.endIndex &&
              item.endIndex <= selectedRangeBeforeInput.end // (---|---]---|
            ) {
              item.endIndex = selectedRangeBeforeInput.start;
            } else if (
              item.startIndex < selectedRangeBeforeInput.start &&
              selectedRangeBeforeInput.end < item.endIndex // (---|---|---)
            ) {
              item.endIndex -=
                selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
            } else if (selectedRangeBeforeInput.end < item.startIndex) {
              // |---|---(---)
              item.startIndex -=
                selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
              item.endIndex -=
                selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
            }
            item.hasUpdated = !(item.endIndex < selectedRangeBeforeInput.start); //  (---)---[---]
            that.delayedUpdate();
          }
        });
      }
    },
    insertFromPaste(selectedRangeBeforeInput, selectionStart) {
      const that = this;
      if (
        selectedRangeBeforeInput === null ||
        selectedRangeBeforeInput.start === selectedRangeBeforeInput.end
      ) {
        const caretPosition = selectionStart - this.pastedText.length;
        this.questions.concat(this.descriptionTargets).forEach(item => {
          let updated = false;
          // console.log(question.startIndex);
          // console.log(question.endIndex);
          if (caretPosition <= item.startIndex) {
            //console.log("START");
            item.startIndex += this.pastedText.length;
            updated = true;
          }
          if (caretPosition < item.endIndex) {
            //console.log("END");
            item.endIndex += this.pastedText.length;
            updated = true;
          }
          if (updated) {
            item.hasUpdated = true;
            that.delayedUpdate();
          }
        });
      } else {
        this.questions.concat(this.descriptionTargets).forEach(item => {
          if (
            selectedRangeBeforeInput.start <= item.startIndex &&
            item.endIndex <= selectedRangeBeforeInput.end //  |---[---]---|
          ) {
            item.hasDeleted = true;
            that.delayedUpdate();
          } else {
            if (
              selectedRangeBeforeInput.start <= item.startIndex &&
              item.startIndex <= selectedRangeBeforeInput.end &&
              selectedRangeBeforeInput.end < item.endIndex //  |---[---|---)
            ) {
              item.startIndex =
                selectedRangeBeforeInput.start + this.pastedText.length;
              item.endIndex -=
                selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
              item.endIndex += this.pastedText.length;
            } else if (
              item.startIndex < selectedRangeBeforeInput.start &&
              selectedRangeBeforeInput.start <= item.endIndex &&
              item.endIndex <= selectedRangeBeforeInput.end // (---|---]---|
            ) {
              item.endIndex = selectedRangeBeforeInput.start;
            } else if (
              item.startIndex < selectedRangeBeforeInput.start &&
              selectedRangeBeforeInput.end < item.endIndex // (---|---|---)
            ) {
              item.endIndex -=
                selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
              item.endIndex += this.pastedText.length;
            } else if (selectedRangeBeforeInput.end < item.startIndex) {
              // |---|---(---)
              item.startIndex -=
                selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
              item.startIndex += this.pastedText.length;
              item.endIndex -=
                selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
              item.endIndex += this.pastedText.length;
            }
            item.hasUpdated = !(item.endIndex < selectedRangeBeforeInput.start); //  (---)---[---]
            that.delayedUpdate();
          }
        });
      }
    },
    deleteByCut(selectedRangeBeforeInput, selectionStart) {
      const that = this;
      this.questions.concat(this.descriptionTargets).forEach(item => {
        if (
          selectedRangeBeforeInput.start <= item.startIndex &&
          item.endIndex <= selectedRangeBeforeInput.end //  |---[---]---|
        ) {
          item.hasDeleted = true;
          that.delayedUpdate();
        } else {
          if (
            selectedRangeBeforeInput.start <= item.startIndex &&
            item.startIndex <= selectedRangeBeforeInput.end &&
            selectedRangeBeforeInput.end < item.endIndex //  |---[---|---)
          ) {
            item.startIndex = selectedRangeBeforeInput.start;
            item.endIndex -=
              selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
          } else if (
            item.startIndex < selectedRangeBeforeInput.start &&
            selectedRangeBeforeInput.start <= item.endIndex &&
            item.endIndex <= selectedRangeBeforeInput.end // (---|---]---|
          ) {
            item.endIndex = selectedRangeBeforeInput.start;
          } else if (
            item.startIndex < selectedRangeBeforeInput.start &&
            selectedRangeBeforeInput.end < item.endIndex // (---|---|---)
          ) {
            item.endIndex -=
              selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
          } else if (selectedRangeBeforeInput.end < item.startIndex) {
            // |---|---(---)
            item.startIndex -=
              selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
            item.endIndex -=
              selectedRangeBeforeInput.end - selectedRangeBeforeInput.start;
          }
          item.hasUpdated = !(item.endIndex < selectedRangeBeforeInput.start); //  (---)---[---]
          that.delayedUpdate();
        }
      });
    },
    update() {
      console.log("UPDATE");
      this.file.text = this.textarea.value;
      this.file.update();
      const that = this;
      this.questions.concat(this.descriptionTargets).forEach(item => {
        if (!item.hasDeleted) {
          return;
        }
        item.destroy();
        const container =
          item instanceof Question ? that.questions : that.descriptionTargets;
        Vue.delete(container, container.findIndex(i => i.id === item.id));
      });
      this.questions.concat(this.descriptionTargets).forEach(item => {
        if (!item.hasUpdated) {
          return;
        }
        item.update();
        const text = that.file.text.substring(item.startIndex, item.endIndex);
        if (item instanceof Question) {
          item.answer = text;
        } else {
          item.text = text;
        }
        item.hasUpdated = false;
      });
    }
  }
};
</script>