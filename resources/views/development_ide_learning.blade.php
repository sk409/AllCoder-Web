@extends("layouts.app")

{{-- @section("links")
<link rel="stylesheet" href="{{ asset("css/development_ide.css") }}">
@endsection --}}

@section("scripts")
<script src="{{ asset("js/development_ide_learning.js") }}" defer></script>
@endsection

@section("app-content")
<div id="development" class="w-100 h-100">
    <development-ide-learning title="{{$title}}" :info="{{json_encode($info)}}"
        url-reading="{{route("development.reading", ["user_id" => $user->id, "material_id" => $material->id, "lesson_id" => $lesson->id])}}"
        :console-port="{{$consolePort}}" :host-ports="{{json_encode($hostPorts)}}"
        :container-ports="{{json_encode($containerPorts)}}" :questions="{{json_encode($questions)}}">
    </development-ide-learning>
</div>
@endsection
