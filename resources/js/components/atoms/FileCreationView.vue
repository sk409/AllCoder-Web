<template>
  <div id="file-creation-view" class="border shadow bg-white">
    <div id="file-creation-view-header" class="form-inline py-2 border-bottom">
      <div class="w-100 text-center">
        <input
          id="file-creation-view-file-name"
          class="form-control"
          :value="fileName"
          @input="onInputFileName"
        />
        <button
          id="file-creation-view-cancel"
          class="btn btn-primary file-creation-view-button"
          type="button"
          @click="onHide"
        >キャンセル</button>
        <button
          id="file-creaetion-view-create"
          class="btn btn-primary file-creation-view-button"
          type="button"
          @click="onStoreFile"
        >作成</button>
      </div>
    </div>
    <div id="file-creation-view-body" class="text-center">
      <div
        class="file-creation-view-file-item text-center border d-inline-block m-2"
        v-for="fileItem in fileItems"
        :key="fileItem.name"
        :image-url="fileItems.imageUrl"
        :name="fileItem.name"
      >
        <div class="w-100 h-75 bg-primary">
          <!-- <img :src="imageUrl"> -->
        </div>
        <div>{{name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import File from "../../models/file.js";
export default {
  name: "file-creation-view",
  props: {
    folder: Object
  },
  data: function() {
    return {
      name: "test",
      extension: "html",
      fileItems: [
        {
          imageUrl: "",
          name: "HTML"
        },
        {
          imageUrl: "",
          name: "CSS"
        },
        {
          imageUrl: "",
          name: "JavaScript"
        },
        {
          imageUrl: "",
          name: "PHP"
        },
        {
          imageUrl: "",
          name: "Perl"
        }
      ]
    };
  },
  computed: {
    fileName() {
      return this.name + "." + this.extension;
    }
  },
  methods: {
    onHide() {
      this.$emit("hide");
    },
    onStoreFile() {
      const isUniqueFileName = function(children, fileName) {
        return !children.find(child => child.name === fileName);
      };
      let suffix = 2;
      let fileName = this.fileName;
      const that = this;
      const newName = function() {
        return that.name + suffix + "." + that.extension;
      };
      if (!isUniqueFileName(this.folder.children, fileName)) {
        while (!isUniqueFileName(this.folder.children, newName())) {
          ++suffix;
        }
        fileName = newName();
      }
      const fileIndex =
        Math.max(
          ...this.folder.children.map(child => {
            return child instanceof File ? child.index : 0;
          })
        ) + 1;
      console.log(fileIndex);
      const file = new File(
        null,
        fileName,
        "",
        fileIndex,
        this.folder,
        this.folder.lessonId
      );
      file.store();
      this.folder.children.push(file);
      this.onHide();
    },
    onInputFileName(e) {
      const splitted = e.target.value.split(".");
      this.extension = splitted.pop();
      this.fileName = splitted.join(".");
    }
  }
};
</script>