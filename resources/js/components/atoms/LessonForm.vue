<template>
  <div>
    <form method="post" :action="action">
      <input type="hidden" name="_token" :value="csrfToken" />
      <input type="hidden" name="user_id" :value="userId" />
      <div class="form-group">
        <label class="w-100">
          タイトル
          <input class="form-control w-100" type="text" name="title" />
        </label>
      </div>
      <div class="form-group">
        <label class="w-100">
          説明文
          <textarea class="form-control" name="description"></textarea>
        </label>
      </div>
      <div class="form-group">
        <el-card>
          <div slot="header">環境設定</div>
          <div>
            <div>
              <div>OS</div>
              <input type="hidden" name="os" :value="dockerfileOS" />
              <div>{{os}}</div>
              <div class="text-center">
                <el-button type="success" @click="showOSDialog">設定</el-button>
              </div>
              <el-divider></el-divider>
              <div class="form-group">
                <label>
                  ユーザ名
                  <input class="form-control" type="text" name="username" required />
                </label>
              </div>
              <el-divider></el-divider>
              <div class="form-group">
                <label>
                  コンソールポート
                  <input class="form-control" type="number" name="console_port" required />
                </label>
              </div>
              <el-divider></el-divider>
              <div>その他のポート</div>
              <div class="form-group" v-for="(port, index) in ports" :key="index">
                <input v-model="ports[index]" type="number" name="ports[]" />
              </div>
              <div class="text-center">
                <el-button type="success" @click="appendPort">追加</el-button>
              </div>
              <el-divider></el-divider>
              <div>フレームワーク・ライブラリ・ミドルウェア</div>
              <div v-for="environment in environments" :key="environment">
                <el-divider></el-divider>
                <lesson-form-environment-item :environment="environment"></lesson-form-environment-item>
              </div>
            </div>
            <div class="text-center mt-5">
              <el-button type="success" @click="showEnvironmentDialog">追加</el-button>
            </div>
          </div>
        </el-card>
      </div>
      <el-divider></el-divider>
      <div class="text-center">
        <input class="btn btn-primary" type="submit" value="作成" />
      </div>
    </form>
    <el-dialog title="OS選択" :visible.sync="osDialogVisible">
      <el-collapse v-model="expandedOSNames">
        <el-collapse-item title="CentOS" name="CentOS">
          <lesson-form-setting-item
            v-for="version in versions.centOS"
            :key="version"
            name="CentOS"
            :version="version"
            :os="true"
            @set-os="setOS"
          ></lesson-form-setting-item>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
    <el-dialog title="環境設定" :visible.sync="environmentDialogVisible">
      <el-collapse v-model="expandedEnvironmentNames">
        <el-collapse-item title="Laravel" name="Laravel">
          <lesson-form-setting-item
            v-for="version in versions.laravel"
            :key="version"
            name="Laravel"
            :version="version"
            @add-environment="addEnvironment"
          ></lesson-form-setting-item>
        </el-collapse-item>
        <el-collapse-item title="MySQL" name="MySQL">
          <lesson-form-setting-item
            v-for="version in versions.mysql"
            :key="version"
            name="MySQL"
            :version="version"
            @add-environment="addEnvironment"
          ></lesson-form-setting-item>
        </el-collapse-item>
        <el-collapse-item title="PHP" name="PHP">
          <lesson-form-setting-item
            v-for="version in versions.php"
            :key="version"
            name="PHP"
            :version="version"
            @add-environment="addEnvironment"
          ></lesson-form-setting-item>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </div>
</template>

<script>
import LessonFormEnvironmentItem from "./LessonFormEnvironmentItem.vue";
import LessonFormSettingItem from "./LessonFormSettingItem.vue";
export default {
  name: "LessonForm",
  props: {
    action: {
      type: String,
      required: true
    },
    userId: {
      type: Number,
      required: true
    },
    lesson: {
      type: Object,
      required: true
    }
  },
  components: {
    LessonFormEnvironmentItem,
    LessonFormSettingItem
  },
  data() {
    return {
      csrfToken: document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content"),
      os: "",
      ports: [],
      environments: [],
      osDialogVisible: false,
      environmentDialogVisible: false,
      expandedOSNames: [],
      expandedEnvironmentNames: [],
      versions: {
        centOS: ["7"],
        php: ["7.3.12"],
        laravel: ["5.7"],
        mysql: ["5.7.28", "8.0.18"]
      }
    };
  },
  computed: {
    dockerfileOS() {
      let os = this.os;
      if (os.startsWith("CentOS")) {
        os = os.replace("CentOS", "centos");
      }
      return os.replace(/\s+/g, "");
    }
  },
  methods: {
    showOSDialog() {
      this.osDialogVisible = true;
    },
    showEnvironmentDialog() {
      this.environmentDialogVisible = true;
    },
    setOS(os) {
      this.os = os;
      this.osDialogVisible = false;
    },
    addEnvironment(environment) {
      if (this.environments.find(e => e === environment)) {
        return;
      }
      this.environments.push(environment);
      this.environments.sort();
    },
    appendPort() {
      this.ports.push("");
    }
  }
};
</script>

<style scoped></style>
