<template>
  <div class="h-100">
    <mavon-editor
      class="w-100 h-100"
      language="ja"
      placeholder="執筆を始めよう!"
      :value="lesson ? lesson.book : ''"
      :toolbars="toolbars"
      @change="change"
    ></mavon-editor>
  </div>
</template>

<script>
import Lesson from "../../models/lesson.js";

export default {
  name: "development-writing",
  props: {
    lessonId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      lesson: null,
      toolbars: {
        bold: true,
        italic: true,
        header: true,
        strikethrough: true,
        quote: true,
        ol: true,
        ul: true,
        link: true,
        code: true,
        table: true,
        readmodel: true,
        htmlcode: true,
        undo: true,
        redo: true,
        trash: true,
        subfield: true,
        preview: true
      },
      delayedUpdate: _.debounce(this.update, 1000),
      updateQueue: Promise.resolve()
    };
  },
  mounted() {
    const that = this;
    Lesson.index({ id: this.lessonId }, response => {
      that.lesson = new Lesson(
        response.data[0].id,
        response.data[0].title,
        response.data[0].description,
        response.data[0].book
      );
    });
  },
  methods: {
    change(value, render) {
      const that = this;
      this.lesson.book = value;
      this.updateQueue.then(function() {
        that.delayedUpdate();
      });
    },
    update() {
      this.lesson.update();
    }
  }
};
</script>