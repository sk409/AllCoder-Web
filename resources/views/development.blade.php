@extends("layouts.app")

@section("links")
<link rel="stylesheet" href="{{ asset("css/development.css") }}">
@endsection

@section("scripts")
<script src="{{ asset("js/ace/ace.js") }}" defer></script>
<script src="{{ asset("js/ace/ext-language_tools.js") }}" defer></script>
{{-- <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/ace.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/ext-language_tools.js"></script> --}}
<script src="{{ asset("js/development.js") }}" defer></script>
@endsection

@section("app-content")
<div id="development">
    <div id="development-header" class="border-bottom border-dark">
        <div>
            {{$lesson->title}}
            <a class="btn btn-light" href="http://localhost:{{$lesson->preview_port_number}}" target="_blank">プレビュー</a>
        </div>
    </div>
    <div id="development-body">
        <ul id="file-tree-view">
            <file-tree id="file-tree" :lesson="{{$lesson}}"></file-tree>
        </ul>
        <div id="center-view">
            <source-code-editor id="source-code-editor"></source-code-editor>
            <iframe id="console" src="http://localhost:{{$lesson->console_port_number}}"></iframe>
        </div>
    </div>
</div>
@endsection
