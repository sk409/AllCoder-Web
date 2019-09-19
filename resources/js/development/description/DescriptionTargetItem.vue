<template>
  <div id="description-target-item">
    <pre @click="onclick">{{descriptionTarget.text}}</pre>
  </div>
</template>

<script>
export default {
  name: "description-target-item",
  props: {
    descriptionTarget: Object
  },
  methods: {
    onclick() {
      this.$emit("select-description", this.descriptionTarget.descriptionId);
    }
  }
};
</script>