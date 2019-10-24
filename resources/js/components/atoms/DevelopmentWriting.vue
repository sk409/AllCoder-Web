<template>
  <div class="h-100">
    <mavon-editor
      class="w-100 h-100"
      language="ja"
      placeholder="執筆を始めよう!"
      :value="book ? book.text : ''"
      @change="change"
    ></mavon-editor>
  </div>
</template>

<script>
import Book from "../../models/book.js";

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
      book: null,
      delayedUpdate: _.debounce(this.update, 1000),
      updateQueue: Promise.resolve()
    };
  },
  mounted() {
    Book.index(
      {
        lesson_id: this.lessonId
      },
      response => {
        if (response.data.length == 0) {
          this.book = new Book(null, "", this.lessonId);
          this.book.store();
        } else {
          this.book = new Book(
            response.data[0].id,
            response.data[0].text,
            response.data[0].lesson_id
          );
        }
      }
    );
  },
  methods: {
    change(value, render) {
      const that = this;
      this.book.text = value;
      console.log(this.book);
      this.updateQueue.then(function() {
        that.delayedUpdate();
      });
    },
    update() {
      this.book.update();
    }
  }
};
</script>