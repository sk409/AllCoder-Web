<template>
  <div>
    <el-divider></el-divider>
    <div class="d-flex align-items-center">
      <div class="mr-auto version">{{version}}</div>
      <el-button type="primary" @click="onclick">{{buttonTitle}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LessonFormSettingItem",
  props: {
    name: {
      stype: String,
      required: true
    },
    version: {
      type: String,
      required: true
    },
    os: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonTitle() {
      return this.os ? "設定" : "追加";
    }
  },
  methods: {
    onclick() {
      if (this.os) {
        this.$emit("set-os", this.name + ": " + this.version);
      } else {
        this.$emit("add-environment", this.name + ": " + this.version);
      }
    }
  }
};
</script>

<style scoped>
.version {
  font-size: 1.5rem;
}
</style>