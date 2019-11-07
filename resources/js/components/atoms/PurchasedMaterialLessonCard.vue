<template>
  <el-card>
    <div slot="header">
      <div class="d-flex align-items-center">
        <h3>{{lesson.title}}</h3>
        <el-rate v-model="rate2" class="ml-auto" @change="changeRate"></el-rate>
      </div>
    </div>
    <div>
      <el-collapse v-model="expandedNames" class="mb-3">
        <el-collapse-item title="概要" name="1">{{lesson.description}}</el-collapse-item>
      </el-collapse>
      <div class="text-center">
        <a :href="url" class="btn btn-primary">学習</a>
      </div>
    </div>
  </el-card>
</template>

<script>
import LessonRating from "../../models/lesson_rating.js";
export default {
  name: "PurchasedMaterialLessonCard",
  props: {
    lesson: {
      type: Object,
      required: true
    },
    rate: {
      type: Number,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    userId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      expandedNames: [],
      rate2: 0,
      lessonRating: null
    };
  },
  mounted() {
    this.rate2 = this.rate;
    this.lessonRating = new LessonRating(
      this.lesson.id,
      this.userId,
      this.rate
    );
  },
  methods: {
    changeRate(value) {
      if (this.lessonRating.value === value) {
        return;
      }
      this.lessonRating.value = value;
      this.lessonRating.update(response => {
        this.$notify({
          message: "評価を更新しました",
          type: "success",
          duration: 1500
        });
      });
    }
  }
};
</script>