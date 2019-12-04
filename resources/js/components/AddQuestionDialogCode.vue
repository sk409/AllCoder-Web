<template>
  <div>
    <el-dialog :visible.sync="isDialogVisible">
      <el-form :label-position="labelPosition" label-width="100px" :model="question">
        <div>
          <h4>正解</h4>
          <el-divider class="mt-1 mb-3"></el-divider>
          <div class="border p-2">
            <el-form-item label="コード" class="m-0 mt-2">
              <el-input type="textarea" :value="answer" disabled></el-input>
            </el-form-item>
            <el-form-item label="得点" class="m-0 mt-2">
              <el-input type="number" v-model="question.correct.score"></el-input>
            </el-form-item>
            <el-form-item label="コメント" class="m-0 mt-2">
              <el-input type="textarea" v-model="question.correct.comment"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="mt-5">
          <h4>不正解</h4>
          <el-divider class="mt-1 mb-3"></el-divider>
          <el-form-item label="コメント">
            <el-input type="textarea" v-model="question.incorrect.comment"></el-input>
          </el-form-item>
        </div>
        <div class="mt-5">
          <h4>中間点</h4>
          <el-divider class="mt-1 mb-3"></el-divider>
          <div v-for="(close, index) in question.closes" :key="index" class="mt-2 p-2 border">
            <el-form-item label="コード" class="m-0 mt-2">
              <el-input type="textarea" v-model="close.text"></el-input>
            </el-form-item>
            <el-form-item label="得点" class="m-0 mt-2">
              <el-input type="number" v-model="close.score"></el-input>
            </el-form-item>
            <el-form-item label="コメント" class="m-0 mt-2">
              <el-input type="textarea" v-model="close.comment"></el-input>
            </el-form-item>
            <div class="text-center">
              <el-button type="danger" class="mt-2" @click="removeClose(index)">削除</el-button>
            </div>
          </div>
          <div class="text-center mt-3">
            <el-button type="primary" @click="appendClose">追加</el-button>
          </div>
        </div>
        <el-divider class="mt-3 mb-4"></el-divider>
        <div class="text-center">
          <el-button type="primary">登録</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "AddQuestionDialogCode",
  props: {
    isShown: {
      type: Boolean,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isDialogVisible: false,
      labelPosition: "left",
      question: {
        correct: {
          score: 0,
          text: "",
          comment: ""
        },
        incorrect: {
          comment: ""
        },
        closes: []
      }
    };
  },
  watch: {
    isShown: {
      immediate: true,
      handler(newValue) {
        this.isDialogVisible = newValue;
        // const that = this;
        // Vue.nextTick(() => {
        //   if (!that.$refs.answer) {
        //     return;
        //   }
        //   that.nl2br(that.$refs.answer);
        // });
      }
    },
    answer: {
      immediate: true,
      handler(newValue) {
        this.question.correct.text = newValue;
      }
    }
  },
  methods: {
    appendClose() {
      if (!this.question.closes) {
        this.question.closes = [];
      }
      this.question.closes.push({ score: 0, text: "", comment: "" });
    },
    removeClose(index) {
      if (this.question.closes.length - 1 == index) {
        this.question.closes = this.question.closes.slice(0, index);
      } else {
        this.question.closes = this.question.closes
          .slice(0, index)
          .concat(this.question.closes.slice(index + 1));
      }
    }
  }
};
</script>

<style scoped>
#answer-container {
  background: lightgray;
}
</style>