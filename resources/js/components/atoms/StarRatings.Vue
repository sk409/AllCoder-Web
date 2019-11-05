<template>
  <div>
    <div class="stars-outer">
      <div class="stars-inner" :style="starStyle"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StartRatings",
  props: {
    rating: {
      required: true
    }
  },
  computed: {
    starStyle() {
      if (this.rating < 1) {
        this.rating *= 100;
      }
      return {
        width: this.rating + "%"
      };
    }
  }
};
</script>

<style scoped>
.stars-outer {
  position: relative;
  display: inline-block;
}

.stars-outer::before {
  content: "\f005 \f005 \f005 \f005 \f005";
  font-family: "Font Awesome 5 Free";
  font-weight: 200;
  color: #ccc;
}

.stars-inner {
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  overflow: hidden;
}

.stars-inner::before {
  content: "\f005 \f005 \f005 \f005 \f005";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  color: #f8ce0b;
}
</style>