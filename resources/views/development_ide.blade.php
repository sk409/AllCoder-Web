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
<div id="development" class="w-100 h-100">
    @if($mode === "creating")
    <development-ide title="{{$title}}" :lesson="{{json_encode($lesson)}}" mode="{{$mode}}"
        url-writing="{{route("development.writing", ["lesson" => $lesson->id])}}" :console-port="{{$consolePort}}"
        :host-ports="{{json_encode($hostPorts)}}" :container-ports="{{json_encode($containerPorts)}}">
    </development-ide>
    @else
<development-ide :title="{{$title}}" :user="{{json_encode($user)}}" :material="{{json_encode($material)}}" :lesson="{{json_encode($lesson)}}" :info="{{json_encode($info)}}" :mode="{{$mode}}"
        url-reading="{{route("development.reading", ["user_id" => $user->id, "material_id" => $material->id, "lesson_id" => $lesson->id])}}"
        :console-port="{{$consolePort}}">
    </development-ide>
    @endif
</div>
@endsection
