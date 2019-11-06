<template>
  <div>
    <div class="stars-outer" ref="starsOuter">
      <div class="stars-inner" ref="starsInner" :style="starStyle"></div>
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
      const maxStarCount = 5;
      return {
        width: (this.rating / maxStarCount) * 100 + "%"
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