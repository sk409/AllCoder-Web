<template>
  <div id="description">
    <transition name="slide-up" @after-leave="onAfterLeaveSlideUpEditingView">
      <div
        id="description-editing-view"
        class="w-100 h-100"
        v-show="editingView.isShown && selectedDescription"
      >
        <div
          id="description-editing-header"
          class="d-flex align-items-center border-bottom border-dark"
        >
          <div>{{selectedDescription ? selectedDescription.index + 1 : 0}}</div>
          <button class="ml-auto">
            <img :src="imageUrls.prevButton" alt="前" @click="onClickPrevButton" />
          </button>
          <button class="ml-3">
            <img :src="imageUrls.nextButton" alt="次" @click="onClickNextButton" />
          </button>
          <button class="ml-3 mr-2" @click="onCloseEditingView">
            <img :src="imageUrls.crossButton" alt="閉じる" />
          </button>
        </div>
        <div id="description-editing-body">
          <textarea
            class="description-editor"
            v-for="(description, index) in descriptions"
            :value="description.text"
            :style="descriptionEditorStyles[index]"
            :key="description.id"
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
            @click="onClickListItem(description.id)"
          >
            {{description.index + 1}}:
            <pre>{{description.text}}</pre>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Description from "../description/Description.js";
import File from "../../models/File.js";
export default {
  name: "description-editor",
  props: {
    lessonId: Number,
    file: Object,
    imageUrls: Object,
    selectedDescription: Object,
    descriptions: Array
  },
  data: function() {
    return {
      editingView: {
        isShown: false
      },
      descriptionList: {
        isShown: true
      },
      delayedUpdate: _.debounce(this.updateDescription, 500)
    };
  },
  computed: {
    selectedDescriptionIndex() {
      if (!this.selectedDescription) {
        return -1;
      }
      const that = this;
      return this.descriptions.findIndex(
        description => description.id === that.selectedDescription.id
      );
    },
    descriptionEditorStyles() {
      const selectedDescriptionIndex = this.selectedDescriptionIndex;
      return this.descriptions.map((description, index) => {
        const translateX = 100 * (index - selectedDescriptionIndex);
        return {
          transform: "translate(" + translateX + "%, 0)"
        };
      });
    }
  },
  methods: {
    onStoreDescription() {
      const that = this;
      const index = this.descriptions.length
        ? Math.max(...this.descriptions.map(description => description.index)) +
          1
        : 0;
      const description = new Description(null, index, "", this.file.id);
      description.store(response => {
        Description.index({ file_id: that.file.id }, response => {
          if (response.data.length !== 1) {
            return;
          }
          File.index({ lesson_id: that.lessonId }, response => {
            const index =
              Math.max(...response.data.map(file => file.index)) + 1;
            that.file.index = index;
            that.file.update();
          });
        });
      });
      this.descriptions.push(description);
    },
    onClickPrevButton() {
      const selectedDescriptionIndex = this.selectedDescriptionIndex;
      const notFound = -1;
      if (selectedDescriptionIndex === notFound) {
        return;
      }
      const nextSelectedDescriptionIndex = selectedDescriptionIndex - 1;
      if (nextSelectedDescriptionIndex < 0) {
        return;
      }
      const nextSelectedDescriptionId = this.descriptions[
        nextSelectedDescriptionIndex
      ].id;
      this.$emit("select-description", nextSelectedDescriptionId);
    },
    onClickNextButton() {
      const selectedDescriptionIndex = this.selectedDescriptionIndex;
      const notFound = -1;
      if (selectedDescriptionIndex === notFound) {
        return;
      }
      const nextSelectedDescriptionIndex = selectedDescriptionIndex + 1;
      if (this.descriptions.length <= nextSelectedDescriptionIndex) {
        return;
      }
      const nextSelectedDescriptionId = this.descriptions[
        nextSelectedDescriptionIndex
      ].id;
      this.$emit("select-description", nextSelectedDescriptionId);
    },
    onClickListItem(descriptionId) {
      this.descriptionList.isShown = false;
      this.$emit("select-description", descriptionId);
    },
    onInputDescription(e) {
      this.selectedDescription.text = e.target.value;
      this.delayedUpdate();
    },
    onCloseEditingView() {
      this.$emit("select-description", null);
    },
    onAfterLeaveSlideUpEditingView() {
      this.descriptionList.isShown = true;
      this.editingView.isShown = false;
    },
    onAfterLeaveSlideDownDescriptionList() {
      this.editingView.isShown = true;
    },
    updateDescription() {
      this.selectedDescription.update();
    }
  }
};
</script>