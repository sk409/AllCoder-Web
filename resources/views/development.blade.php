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
    <development-view :lesson="{{$lesson}}">
    </development-view>
</div>
@endsection
