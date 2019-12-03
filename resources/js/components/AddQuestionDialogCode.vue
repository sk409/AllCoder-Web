<template>
  <div>
    <el-dialog :visible.sync="isDialogVisible">
      <div ref="answer">{{answer}}</div>
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
      isDialogVisible: false
    };
  },
  watch: {
    isShown: {
      immediate: true,
      handler(newValue, oldValue) {
        this.isDialogVisible = newValue;
        const that = this;
        Vue.nextTick(() => {
          if (!that.$refs.answer) {
            return;
          }
          that.nl2br(that.$refs.answer);
        });
      }
    }
  }
};
</script>