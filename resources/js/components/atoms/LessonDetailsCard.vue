<template>
  <el-card class="w-50 mx-auto">
    <div slot="header" class="d-flex align-items-center">
      <h3>{{lesson.title}}</h3>
      <div class="ml-auto">
        <!-- TODO: レッスンのRateを計算する -->
        <el-rate :value="2.5" :allow-half="true" disabled></el-rate>
      </div>
    </div>
    <div>
      <div class="text-center mb-2">全{{ratings.length}}件の評価</div>
      <div v-for="(rate, stars) in rank" :key="stars" class="d-flex w-50 mx-auto">
        <el-rate :value="Number(stars)" disabled></el-rate>
        <span class="ml-auto">{{rate * 100 + "%"}}</span>
      </div>
      <el-collapse v-model="expandedNames" class="mt-4">
        <el-collapse-item title="概要" name="1">{{lesson.description}}</el-collapse-item>
        <!-- TODO: コメントを表示する -->
        <el-collapse-item title="コメント" name="2">COMMENT</el-collapse-item>
      </el-collapse>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "LessonDetailsCard",
  props: {
    lesson: {
      type: Object,
      required: true
    },
    ratings: {
      type: Array,
      required: true
    },
    rank: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      expandedNames: []
    };
  }
};
</script>