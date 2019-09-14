<template>
  <div
    id="development"
    class="container-fluid vh-100"
    v-on:click="onclick"
    v-on:keydown.meta.90.stop.prevent="onundo"
  >
    <div id="development-header" class="d-flex bg-light border-bottom border-dark row">
      <div class="d-flex align-items-center" contenteditable="true">{{ lesson.title }}</div>
      <div class="ml-3 d-flex align-items-center"></div>
    </div>
    <div id="development-body" class="row">
      <div class="col-9 h-100 p-0">
        <div id="development-body-top" class="d-flex">
          <div class="w-25 h-100 border-right border-bottom border-dark">
            <ul class="w-100 h-100">
              <file-tree
                id="file-tree"
                class="w-100 h-100"
                :items="fileTree.items"
                :lesson-id="lesson.id"
                @show-context-menu="onShowFileTreeContextMenu"
                @set-file="onSetFile"
              ></file-tree>
            </ul>
          </div>
          <div class="w-75 h-100 border-bottom border-dark">
            <source-code-editor
              id="source-code-editor"
              class="w-100 h-100"
              :file="file"
              :questions="questions"
              :description-targets="descriptionTargets"
              @show-context-menu.stop.prevent="onShowSourceCodeEditorContextMenu"
            ></source-code-editor>
          </div>
        </div>
        <div id="development-body-bottom" class="d-flex">
          <div class="w-25 border-right border-dark">
            <div id="questions">
              <div>問題</div>
              <question-item
                v-for="question in questions"
                :key="question.id"
                :question="question"
                @select-description="onSelectDescription"
              ></question-item>
            </div>
            <div id="description-targets">
              <div>説明対象</div>
              <description-target-item
                v-for="descriptionTarget in descriptionTargets"
                :key="descriptionTarget.id"
                :description-target="descriptionTarget"
                @select-description="onSelectDescription"
              ></description-target-item>
            </div>
          </div>
          <div class="w-75">
            <description-editor
              v-show="file"
              :lesson-id="lesson.id"
              :file="file"
              :image-urls="imageUrls"
              :selected-description="selectedDescription"
              :descriptions="descriptions"
              @select-description="onSelectDescription"
            ></description-editor>
          </div>
        </div>
      </div>
      <div class="col p-0 h-100 bg-dark"></div>
    </div>
    <transition name="fade">
      <file-creation-view
        v-show="fileCreationView.isShown"
        :folder="fileTree.contextMenu.item"
        @hide="onHideFileCreationView"
      ></file-creation-view>
    </transition>
    <file-tree-context-menu
      v-show="fileTree.contextMenu.isShown"
      :left="fileTree.contextMenu.left"
      :top="fileTree.contextMenu.top"
      :item="fileTree.contextMenu.item"
      @show-file-creation-view="onShowFileCreationView"
    ></file-tree-context-menu>
    <source-code-editor-context-menu
      v-show="sourceCodeEditor.contextMenu.isShown"
      :left="sourceCodeEditor.contextMenu.left"
      :top="sourceCodeEditor.contextMenu.top"
      :start-index="sourceCodeEditor.contextMenu.selection.startIndex"
      :end-index="sourceCodeEditor.contextMenu.selection.endIndex"
      :file="file"
      :questions="questions"
      :selected-description="selectedDescription"
    ></source-code-editor-context-menu>
  </div>
</template>

<script>
import Description from "./description/Description.js";
import DescriptionEditor from "./description/DescriptionEditor.vue";
import DescriptionTarget from "./description/DescriptionTarget.js";
import DescriptionTargetItem from "./description/DescriptionTargetItem.vue";
import File from "../models/File.js";
import FileCreationView from "./file-tree/FileCreationView.vue";
import FileTree from "./file-tree/FileTree.vue";
import FileTreeContextMenu from "./file-tree/FileTreeContextMenu.vue";
import Question from "./question/Question.js";
import QuestionItem from "./question/QuestionItem.vue";
import SourceCodeEditor from "./source-code-editor/SourceCodeEditor.vue";
import SourceCodeEditorContextMenu from "./source-code-editor/SourceCodeEditorContextMenu.vue";

export default {
  name: "development-view",
  props: {
    lesson: Object,
    imageUrls: Object
  },
  components: {
    FileTreeContextMenu,
    FileTree,
    FileCreationView,
    SourceCodeEditorContextMenu,
    QuestionItem,
    SourceCodeEditor,
    DescriptionEditor,
    DescriptionTargetItem
  },
  data: function() {
    return {
      file: null,
      descriptions: null,
      fileCreationView: {
        isShown: false
      },
      fileTree: {
        items: null,
        contextMenu: {
          isShown: false,
          left: 0,
          top: 0,
          item: null
        }
      },
      sourceCodeEditor: {
        disabled: true,
        contextMenu: {
          isShown: false,
          left: 0,
          top: 0,
          selection: {}
        }
      }
    };
  },
  created() {
    this.fileTree.items = File.index({ lesson_id: this.lesson.id });
  },
  computed: {
    questions() {
      return this.descriptions
        ? this.descriptions.map(description => description.questions).flat()
        : [];
    },
    descriptionTargets() {
      return this.descriptions
        ? this.descriptions.map(description => description.targets).flat()
        : [];
    },
    selectedDescription() {
      return this.descriptions
        ? this.descriptions.find(description => description.isSelected)
        : null;
    }
  },
  methods: {
    onclick() {
      this.fileTree.contextMenu.isShown = false;
      this.sourceCodeEditor.contextMenu.isShown = false;
      this.sourceCodeEditor.isClicked = true;
    },
    onundo() {
      alert("ごめんなさい!UNDO機能はまだ実装していません。");
    },
    onSelectDescription(id) {
      const that = this;
      const unselectDescriptions = function() {
        that.descriptions.forEach(description => {
          description.isSelected = false;
        });
      };
      if (id === null) {
        unselectDescriptions();
        return;
      }
      const description = this.descriptions.find(
        description => description.id === id
      );
      if (!description) {
        return;
      }
      unselectDescriptions();
      description.isSelected = true;
    },
    onSetFile(file) {
      this.file = file;
      const that = this;
      Description.index({ file_id: file.id }, response => {
        that.descriptions = response.data.map(data => {
          const description = new Description(
            data.id,
            data.index,
            data.text,
            data.file_id
          );
          DescriptionTarget.index(
            { description_id: description.id },
            response => {
              description.targets.push(
                ...response.data.map(descriptionTarget => {
                  return new DescriptionTarget(
                    descriptionTarget.id,
                    descriptionTarget.start_index,
                    descriptionTarget.end_index,
                    description.id,
                    file.text.substring(
                      descriptionTarget.start_index,
                      descriptionTarget.end_index
                    )
                  );
                })
              );
              Question.index({ description_id: description.id }, response => {
                description.questions.push(
                  ...response.data.map(question => {
                    return new Question(
                      question.id,
                      question.start_index,
                      question.end_index,
                      question.description_id,
                      that.file.text.substring(
                        question.start_index,
                        question.end_index
                      )
                    );
                  })
                );
              });
            }
          );
          return description;
        });
      });
      this.sourceCodeEditor.disabled = false;
    },
    onShowFileTreeContextMenu(e, item) {
      this.fileTree.contextMenu.isShown = true;
      this.fileTree.contextMenu.left = e.pageX;
      this.fileTree.contextMenu.top = e.pageY;
      this.fileTree.contextMenu.item = item;
    },
    onShowFileCreationView() {
      this.fileCreationView.isShown = true;
    },
    onHideFileCreationView() {
      this.fileCreationView.isShown = false;
    },
    onShowSourceCodeEditorContextMenu(e) {
      this.sourceCodeEditor.contextMenu.isShown = true;
      this.sourceCodeEditor.contextMenu.left = e.pageX;
      this.sourceCodeEditor.contextMenu.top = e.pageY;
      this.sourceCodeEditor.contextMenu.selection.startIndex =
        e.target.selectionStart;
      this.sourceCodeEditor.contextMenu.selection.endIndex =
        e.target.selectionEnd;
      this.sourceCodeEditor.contextMenu.target = e.target;
    }
  }
};
</script>