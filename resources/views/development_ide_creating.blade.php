@extends("layouts.app")

{{-- @section("links")
<link rel="stylesheet" href="{{ asset("css/development_ide.css") }}">
@endsection --}}

@section("scripts")
<script src="{{ asset("js/ace/ace.js") }}" defer></script>
<script src="{{ asset("js/ace/ext-language_tools.js") }}" defer></script>
<script src="{{ asset("js/development_ide_creating.js") }}" defer></script>
@endsection

@section("app-content")
<div id="development" class="w-100 h-100">
    <development-ide title="{{$title}}" :lesson="{{json_encode($lesson)}}"
        :questions="{{json_encode($lesson->codeQuestions->all())}}" markdown-title="執筆"
        markdown-url="{{route("development.writing", ["lesson" => $lesson->id])}}" :console-port="{{$consolePort}}"
        :host-ports="{{json_encode($hostPorts)}}" :container-ports="{{json_encode($containerPorts)}}">
    </development-ide>
</div>
@endsection
