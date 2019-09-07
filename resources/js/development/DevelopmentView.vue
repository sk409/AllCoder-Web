<template>
  <div
    id="development"
    class="container-fluid vh-100"
    v-on:click="onclick"
    v-on:keydown.meta.90.stop.prevent="onundo"
  >
    <div id="development-header" class="d-flex bg-light border-bottom border-dark row">
      <div class="d-flex align-items-center" contenteditable="true">{{ lesson.title }}</div>
      <div class="ml-3 d-flex align-items-center">
        <!-- <button class="ml-2" type="button">ファイル</button>
                <button class="ml-2" type="button">ファイル</button>
        <button class="ml-2" type="button">ファイル</button>-->
      </div>
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
              :description-targets="description.targets"
              @show-context-menu.stop.prevent="onShowSourceCodeEditorContextMenu"
            ></source-code-editor>
          </div>
        </div>
        <div id="development-body-bottom" class="d-flex">
          <div id="questions-view" class="w-25 border-right border-dark">
            <question-item
              v-for="question in questions"
              :key="question.id"
              :answer="question.answer"
            ></question-item>
          </div>
          <div class="w-75">
            <description-editor
              v-show="file"
              :file-id="file ? file.id : null"
              :descriptions="description.descriptions"
              :image-urls="imageUrls"
              @set-selected-description="onSetSelectedDescription"
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
      :description-targets="description.targets"
      :selected-description="description.selectedDescription"
    ></source-code-editor-context-menu>
  </div>
</template>

<script>
import Description from "./description/Description.js";
import DescriptionEditor from "./description/DescriptionEditor.vue";
import DescriptionTarget from "./description/DescriptionTarget.js";
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
    // lessonId: Number,
    // lessonTitle: String,
    // plusButtonUrl: String,
    // prevButtonUrl: String,
    // nextButtonUrl: String,
    // crossButtonUrl: String
    lesson: Object,
    imageUrls: Object
  },
  data: function() {
    return {
      file: null,
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
      },
      questions: [],
      description: {
        selectedDescription: null,
        descriptions: [],
        targets: []
      }
    };
  },
  components: {
    FileTreeContextMenu,
    FileTree,
    FileCreationView,
    SourceCodeEditorContextMenu,
    QuestionItem,
    SourceCodeEditor,
    DescriptionEditor
  },
  created() {
    this.fileTree.items = File.index({ lesson_id: this.lesson.id });
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
    onSetSelectedDescription(selectedDescription) {
      this.description.selectedDescription = selectedDescription;
    },
    onSetFile(file) {
      this.file = file;
      const that = this;
      Question.index({ file_id: file.id }, response => {
        that.questions = response.data.map(question => {
          return new Question(
            question.id,
            question.start_index,
            question.end_index,
            question.file_id,
            file.text.substring(question.strat_index, question.end_index)
          );
        });
      });
      Description.index({ file_id: file.id }, response => {
        that.description.descriptions = response.data.map(description => {
          return new Description(
            description.id,
            description.index,
            description.text,
            description.file_id
          );
        });
        that.description.targets = [];
        that.description.descriptions.forEach(description => {
          DescriptionTarget.index(
            { description_id: description.id },
            response => {
              that.description.targets.push(
                ...response.data.map(descriptionTarget => {
                  console.log(
                    this.file.text.substring(
                      descriptionTarget.start_index,
                      descriptionTarget.end_index
                    )
                  );
                  return new DescriptionTarget(
                    descriptionTarget.id,
                    descriptionTarget.start_index,
                    descriptionTarget.end_index,
                    description.id
                  );
                })
              );
            }
          );
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