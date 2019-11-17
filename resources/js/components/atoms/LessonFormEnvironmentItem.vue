<template>
  <div>
    <input type="hidden" name="environments[]" :value="environment" />
    <div v-if="environment.startsWith('MySQL')">
      {{environment}}
      <div class="form-row mt-2">
        <label class="col-2" for="mysql-username">ユーザ名</label>
        <input
          id="mysql-username"
          class="col form-control"
          type="text"
          name="mysql_username"
          value="root"
          required
        />
      </div>
      <div class="form-row mt-2">
        <label class="col-2" for="mysql-password">パスワード</label>
        <input
          id="mysql-password"
          class="col form-control"
          type="password"
          name="mysql_password"
          value="root"
          required
        />
      </div>
      <div class="form-row mt-2">
        <label class="col-2" for="mysql-port">ポート</label>
        <input
          id="mysql-port"
          class="col form-control"
          type="number"
          name="mysql_port"
          value="3306"
          required
        />
      </div>
    </div>
    <div v-else>{{environment}}</div>
  </div>
</template>

<script>
export default {
  name: "LessonFormEnvironmentItem",
  props: {
    environment: {
      type: String,
      required: true
    }
  }
};
</script>