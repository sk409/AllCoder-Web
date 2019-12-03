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
    <development-ide-creating title="{{$title}}" :lesson="{{json_encode($lesson)}}"
        url-writing="{{route("development.writing", ["lesson" => $lesson->id])}}" :console-port="{{$consolePort}}"
        :host-ports="{{json_encode($hostPorts)}}" :container-ports="{{json_encode($containerPorts)}}">
    </development-ide-creating>
</div>
@endsection
