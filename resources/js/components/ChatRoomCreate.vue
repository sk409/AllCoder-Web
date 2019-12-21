<template>
  <el-form ref="form" :model="form" :rules="rules">
    <el-form-item label="名前" prop="name">
      <el-input name="name" v-model="form.name"></el-input>
    </el-form-item>
    <div class="text-center">
      <el-button type="primary" v-on:click="submit">作成</el-button>
    </div>
  </el-form>
</template>

<script>
import ChatRoom from "../models/chat_room.js";
export default {
  name: "ChatRoomCreate",
  props: {
    redirectUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "名前を入力してください",
            trigger: "change"
          },
          {
            max: 128,
            message: "128文字以内で入力してください",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        const chatRoom = new ChatRoom(this.form.name);
        chatRoom.store(response => {
          if (response.status !== 200) {
            return;
          }
          location.href = this.redirectUrl;
        });
      });
    }
  }
};
</script>