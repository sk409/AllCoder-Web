<template>
  <div id="console-view" class="h-100">
    <div id="console-tool-bar" class="d-flex align-items-center p-2">
      <div class="ml-auto">
        <i class="el-icon-plus" @click="addConsole"></i>
      </div>
      <el-divider direction="vertical"></el-divider>
      <el-dropdown @command="handleConsoleDropdownCommand">
        <span class="el-dropdown-link text-white">
          コンソール: {{ activeConsoleIndex }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="consoleId in consoleCount"
            :key="consoleId"
            :command="consoleId - 1"
          >{{ consoleId - 1 }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div id="console-container" class="h-100">
      <iframe
        v-for="consoleId in consoleCount"
        :key="consoleId"
        :src="'http://localhost:' + consolePort"
        :class="{
                                'active-console': isActiveConsole(consoleId)
                            }"
        class="console"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: "development-ide-console",
  props: {
    consolePort: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      activeConsoleIndex: 0,
      consoleCount: 1
    };
  },
  methods: {
    handleConsoleDropdownCommand(command) {
      this.activeConsoleIndex = command;
    },
    addConsole() {
      ++this.consoleCount;
      this.activeConsoleIndex = this.consoleCount - 1;
    },
    isActiveConsole(consoleId) {
      return this.activeConsoleIndex === consoleId - 1;
    }
  }
};
</script>

<style scoped>
.console {
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  width: 100%;
  height: 32%;
}

.active-console {
  z-index: 1;
}

#console-tool-bar {
  height: 8%;
  background: rgb(30, 30, 30);
  border-top: solid 1.5px rgb(80, 80, 80);
}

#console-container {
  position: relative;
}
</style>