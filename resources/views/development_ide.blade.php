@extends("layouts.app")

@section("links")
<link rel="stylesheet" href="{{ asset("css/development_ide.css") }}">
@endsection

@section("scripts")
<script src="{{ asset("js/ace/ace.js") }}" defer></script>
<script src="{{ asset("js/ace/ext-language_tools.js") }}" defer></script>
<script src="{{ asset("js/development_ide.js") }}" defer></script>
@endsection

@section("app-content")
<div id="development-ide">
    <div id="development-header" class="border-bottom border-dark">
        <div class="d-flex p-3">
            <h3>{{$title}}</h3>
            {{-- <a class="btn btn-light ml-auto" href="http://localhost:{{$previewPortNumber}}"
            target="_blank">プレビュー</a> --}}
            <a class="btn btn-light ml-auto">ポート</a>
            @if($mode === "creating")
            <a class="btn btn-light" href="{{route("development.writing", ["lesson" => $lesson->id])}}"
                target="_blank">執筆</a>
            @else
            <a class="btn btn-light"
                href="{{route("development.reading", ["user_id" => $user->id, "material_id" => $material->id, "lesson_id" => $lesson->id])}}"
                target="_blank">
                説明文
            </a>
            @endif
        </div>
    </div>
    <div id="development-body">
        <ul id="file-tree-view">
            {{-- <file-tree id="file-tree" host-app-directory-path="{{$hostAppDirectoryPath}}"
            container-app-directory-path="{{$containerAppDirectoryPath}}"
            delta-log-file-path="{{$deltaLogFilePath}}"></file-tree> --}}
            <file-tree id="file-tree" root="/" :lesson-id="{{$lesson->id}}"></file-tree>
        </ul>
        <div id="center-view">
            <source-code-editor id="source-code-editor"
                v-on:show-source-code-editor-context-menu="showSourceCodeEditorContextMenu"></source-code-editor>
            <iframe id="console" src="http://localhost:{{$consolePort}}"></iframe>
        </div>
    </div>
    <source-code-editor-context-menu id="source-code-editor-context-menu" v-show="sourceCodeEditorContextMenu.isShown"
        :style="sourceCodeEditorContextMenu.style" :start-index="sourceCodeEditorContextMenu.startIndex"
        :end-index="sourceCodeEditorContextMenu.endIndex" :lesson-id="{{$lesson->id}}"
        v-on:hide="hideSourceCodeEditorContextMenu">
    </source-code-editor-context-menu>
</div>
@endsection
