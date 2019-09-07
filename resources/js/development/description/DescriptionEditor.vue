<template>
  <div id="description" class="w-100 h-100">
    <transition name="slide-up" @after-leave="onAfterLeaveSlideUpEditingView">
      <div id="description-editing-view" class="w-100 h-100" v-show="editingView.isShown">
        <div
          id="description-editing-header"
          class="d-flex align-items-center border-bottom border-dark"
        >
          <div>{{editingView.description.index}}</div>
          <button class="ml-auto">
            <img :src="imageUrls.prevButton" alt="前" />
          </button>
          <button class="ml-3">
            <img :src="imageUrls.nextButton" alt="次" />
          </button>
          <button class="ml-3 mr-2" @click="onCloseEditingView">
            <img :src="imageUrls.crossButton" alt="閉じる" />
          </button>
        </div>
        <div id="description-editing-body">
          <textarea
            id="description-editor"
            class="w-100 h-100"
            :value="editingView.description.text"
            @input="onInputDescription"
          ></textarea>
        </div>
      </div>
    </transition>
    <transition name="slide-down" @after-leave="onAfterLeaveSlideDownDescriptionList">
      <div class="w-100 h-100" v-show="descriptionList.isShown">
        <div
          id="description-list-header"
          class="d-flex align-items-center border-bottom border-dark"
        >
          <button class="ml-auto mr-2" @click="onStoreDescription">
            <img :src="imageUrls.plusButton" alt="追加" />
          </button>
        </div>
        <div id="description-list-body">
          <div
            class="border-bottom"
            v-for="description in descriptions"
            :key="description.id"
            @click="onSlideDownDescriptionList(description.id)"
          >
            {{description.index}}:
            <pre>{{description.text}}</pre>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Description from "../description/Description.js";
export default {
  name: "description-editor",
  props: {
    fileId: Number,
    imageUrls: Object,
    descriptions: Array
  },
  data: function() {
    return {
      descriptionList: {
        isShown: true
      },
      editingView: {
        isShown: false,
        description: Object
      },
      delayedUpdate: _.debounce(this.updateDescription, 500)
    };
  },
  methods: {
    onStoreDescription() {
      const that = this;
      const index = this.descriptions.length
        ? Math.max(...this.descriptions.map(description => description.index)) +
          1
        : 0;
      const description = new Description(null, index, "", this.fileId);
      description.store();
      this.descriptions.push(description);
    },
    onSlideDownDescriptionList(descriptionId) {
      this.descriptionList.isShown = false;
      this.editingView.description = this.descriptions.find(
        description => description.id === descriptionId
      );
      this.$emit("set-selected-description", this.editingView.description);
    },
    onInputDescription(e) {
      this.editingView.description.text = e.target.value;
      this.delayedUpdate();
    },
    onCloseEditingView() {
      this.editingView.isShown = false;
    },
    onAfterLeaveSlideUpEditingView() {
      this.descriptionList.isShown = true;
    },
    onAfterLeaveSlideDownDescriptionList() {
      this.editingView.isShown = true;
    },
    updateDescription() {
      const description = this.descriptions.find(
        description => description.id === this.editingView.description.id
      );
      if (!description) {
        return;
      }
      description.update();
    }
  }
};
</script>