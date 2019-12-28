<template>
  <div class="d-flex bg-white text-dark" @click="onclick">
    <div class="w-50 h-100 p-1 d-flex flex-column">
      <div class="d-flex border-bottom position-relative">
        <div class="ml-auto fs-4" @click.stop="toggleMenu">...</div>
        <div v-show="menu.isVisible" class="menu">
          <button class="btn btn-light" @click="showAppendingQuestionLinkDialog">問題へのリンクを追加</button>
        </div>
      </div>
      <textarea class="resize-none w-100 fill border-0" v-model="markdown" @input="oninput"></textarea>
    </div>
    <el-divider direction="vertical" class="m-0 h-100"></el-divider>
    <div class="w-50">
      <div class="w-100 d-flex border-bottom align-items-center">
        <div class="ml-auto fs-4 btn" @click="close">✖︎</div>
      </div>
      <MarkdownPreview :text="markdown" class="w-100" @click-question-button="clickQuestionButton"></MarkdownPreview>
    </div>
    <el-dialog
      title="問題へのリンクを追加"
      :visible.sync="appendingQuestionLinkDialog.isVisible"
      append-to-body
    >
      <el-card v-for="(questions, filePath) in questionGroups" :key="filePath">
        <div slot="header">{{filePath}}</div>
        <div>
          <div v-for="question in questions" :key="question.id">
            <div class="d-flex align-items-center">
              <pre>{{question.text}}</pre>
              <el-button type="primary" class="ml-auto" @click="appendQuestionLink(question.id)">追加</el-button>
            </div>
            <el-divider class="my-2"></el-divider>
          </div>
        </div>
      </el-card>
    </el-dialog>
    <!-- <mavon-editor
      class="w-100 h-100"
      language="ja"
      placeholder="執筆を始めよう!"
      :value="lesson ? lesson.book : ''"
      :toolbars="toolbars"
      @change="change"
    ></mavon-editor>-->
  </div>
</template>

<script>
import Lesson from "../models/lesson.js";
import MarkdownPreview from "./MarkdownPreview.vue";

export default {
  name: "MarkdownEditor",
  props: {
    text: {
      type: String,
      required: true
    },
    questions: {
      type: Array,
      required: true
    }
  },
  components: {
    MarkdownPreview
  },
  data() {
    return {
      appendingQuestionLinkDialog: {
        isVisible: false
      },
      markdown: "",
      menu: {
        isVisible: false
      }
    };
  },
  computed: {
    questionGroups() {
      return this.questions.reduce((group, question) => {
        if (question.file_path in group) {
          group[question.file_path].push(question);
        } else {
          group[question.file_path] = [question];
        }
        return group;
      }, {});
    }
  },
  watch: {
    text: {
      immediate: true,
      handler(newValue) {
        this.markdown = newValue;
      }
    }
  },
  methods: {
    onclick() {
      this.menu.isVisible = false;
    },
    oninput() {
      this.$emit("input", this.markdown);
    },
    toggleMenu() {
      this.menu.isVisible = !this.menu.isVisible;
    },
    clickQuestionButton(questionId, button) {
      this.$emit("click-question-button", questionId, button);
    },
    close() {
      this.$emit("close");
    },
    appendQuestionLink(questionId) {
      this.markdown += `?{${questionId}}`;
      this.menu.isVisible = false;
      this.$emit("input", this.markdown);
    },
    showAppendingQuestionLinkDialog() {
      this.appendingQuestionLinkDialog.isVisible = true;
    }
  }
};

// export default {
//   name: "development-writing",
//   props: {
//     lessonId: {
//       type: String,
//       required: true
//     }
//   },
//   data() {
//     return {
//       lesson: null,
//       toolbars: {
//         bold: true,
//         italic: true,
//         header: true,
//         strikethrough: true,
//         quote: true,
//         ol: true,
//         ul: true,
//         link: true,
//         code: true,
//         table: true,
//         readmodel: true,
//         htmlcode: true,
//         undo: true,
//         redo: true,
//         trash: true,
//         subfield: true,
//         preview: true
//       },
// delayedUpdate: _.debounce(this.update, 1000),
//       updateQueue: Promise.resolve()
//     };
//   },
//   mounted() {
//     const that = this;
//     Lesson.index({ id: this.lessonId }, response => {
//       that.lesson = new Lesson(
//         response.data[0].id,
//         response.data[0].title,
//         response.data[0].description,
//         response.data[0].book
//       );
//     });
//   },
//   methods: {
//     change(value, render) {
//       const that = this;
//       this.lesson.book = value;
//       this.updateQueue.then(function() {
//         that.delayedUpdate();
//       });
//     },
//     update() {
//       this.lesson.update();
//     }
//   }
// };
</script>

<style scoped>
.menu {
  position: absolute;
  right: 0;
  bottom: 0;
  transform: translate(0, 105%);
  border: 1px solid lightgray;
}
</style>