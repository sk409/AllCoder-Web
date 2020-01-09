@extends("layouts.app")

{{-- @section("links")
<link rel="stylesheet" href="{{ asset("css/development_ide.css") }}">
@endsection --}}

{{-- @section("scripts")
<script src="{{ asset("js/development_ide_learning.js") }}" defer></script>
@endsection --}}

@section("scripts")
<script src="{{ asset("js/ace/ace.js") }}" defer></script>
<script src="{{ asset("js/ace/ext-language_tools.js") }}" defer></script>
<script src="{{ asset("js/development_ide_learning.js") }}" defer></script>
@endsection

@section("app-content")
<div id="development" class="w-100 h-100">
    {{-- <development-ide title="{{$title}}" :info="{{json_encode($info)}}" :lesson="{{json_encode($lesson)}}"
    markdown-title="説明文"
    markdown-url="{{route("development.reading", ["user_id" => $user->id, "material_id" => $material->id, "lesson_id" => $lesson->id])}}"
    :console-port="{{$consolePort}}" :host-ports="{{json_encode($hostPorts)}}"
    :container-ports="{{json_encode($containerPorts)}}" :questions="{{json_encode($questions)}}"
    :user-id="{{$user->id}}" :material-id="{{$material->id}}" file-path="{{$filePath ? $filePath : ''}}">
    </development-ide> --}}
    <development-ide title="{{$title}}" :lesson="{{json_encode($lesson)}}"
        :questions="{{json_encode($lesson->codeQuestions->all())}}" markdown-title="説明文"
        markdown-url="{{route("development.reading", ["lesson_id" => $lesson->id])}}" :console-port="{{$consolePort}}"
        :host-ports="{{json_encode($hostPorts)}}" :container-ports="{{json_encode($containerPorts)}}">
    </development-ide>
</div>
@endsection
