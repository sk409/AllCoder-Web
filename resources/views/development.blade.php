@extends("layouts.app")

@section("links")
<link rel="stylesheet" href="{{ asset("css/development.css") }}">
@endsection

@section("scripts")
<script src="{{ asset("js/development.js") }}" defer></script>
@endsection

@section("app-content")

<div id="development" v-on:click="onclick" v-on:keydown.meta.90.stop.prevent="onundo">
    <div id="development-header" class="border-bottom border-dark">
        <div>{{$lesson->title}}</div>
    </div>
    <div id="development-body">
        <ul id="file-tree-view">
            <file-tree id="file-tree" :lesson-id="{{$lesson->id}}" v-on:show-context-menu="onShowFileTreeContextMenu"
                v-on:set-file="onSetFile"></file-tree>
        </ul>
        <div id="editing-view">
            <source-code-editor :file="file" :questions="questions" :description-targets="descriptionTargets"
                v-on:show-context-menu.stop.prevent="onShowSourceCodeEditorContextMenu"></source-code-editor>
            <description-editor v-show="file" :lesson-id="{{$lesson->id}}" :file="file" :image-urls="{
                plusButton: '{{asset("images/plus-button.png")}}',
                prevButton: '{{asset("images/prev-button.png")}}',
                nextButton: '{{asset("images/next-button.png")}}',
                crossButton: '{{asset("images/cross-button.png")}}'
            }" :selected-description="selectedDescription" :descriptions="descriptions"
                v-on:select-description="onSelectDescription"></description-editor>
        </div>
        <div id="inspector-view"></div>
    </div>
    <transition name="fade">
        <file-creation-view v-show="fileCreationView.isShown" :folder="fileTree.contextMenu.item"
            v-on:hide="onHideFileCreationView"></file-creation-view>
    </transition>
    <file-tree-context-menu v-show="fileTree.contextMenu.isShown" :left="fileTree.contextMenu.left"
        :top="fileTree.contextMenu.top" :item="fileTree.contextMenu.item"
        v-on:show-file-creation-view="onShowFileCreationView"></file-tree-context-menu>
    <source-code-editor-context-menu v-show="sourceCodeEditor.contextMenu.isShown"
        :left="sourceCodeEditor.contextMenu.left" :top="sourceCodeEditor.contextMenu.top"
        :start-index="sourceCodeEditor.contextMenu.selection.startIndex"
        :end-index="sourceCodeEditor.contextMenu.selection.endIndex" :file="file"
        :selected-description="selectedDescription"></source-code-editor-context-menu>
</div>


{{-- <div id="development">
        <development-view
            :lesson="{
                id: {{$lesson->id}},
title: '{{$lesson->title}}'
}"
:image-urls="{
plusButton: '{{asset("images/plus-button.png")}}',
prevButton: '{{asset("images/prev-button.png")}}',
nextButton: '{{asset("images/next-button.png")}}',
crossButton: '{{asset("images/cross-button.png")}}'
}"
></development-view>
</div> --}}
@endsection
