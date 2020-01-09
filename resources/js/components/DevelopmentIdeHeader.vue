<template>
  <div id="development-header">
    <div class="d-flex align-items-center p-3">
      <h3>{{ title }}</h3>
      <div class="ml-auto">
        <a class="header-button" :href="url">{{urlTitle}}</a>
      </div>
      <el-divider direction="vertical"></el-divider>
      <el-dropdown @command="handlePortDropdownCommand">
        <span class="el-dropdown-link text-white">
          ポート
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(containerPort, index) in containerPorts"
            :key="containerPort"
            :command="hostPorts[index]"
          >{{ containerPort }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: "DevelopmentIdeHeader",
  props: {
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    urlTitle: {
      type: String,
      required: true
    },
    containerPorts: {
      type: Array,
      required: true
    },
    hostPorts: {
      type: Array,
      required: true
    }
  },
  methods: {
    handlePortDropdownCommand(command) {
      open(`http://localhost:${command}`);
    },
    showMarkdown() {
      // this.$emit("show-markdown");
    }
  }
};
</script>

<style scoped>
.header-button {
  display: block;
  color: white;
  font-size: 1rem;
  cursor: pointer;
}
</style>