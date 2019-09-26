@extends("layouts.app")

@section("links")
<link rel="stylesheet" href="{{ asset("css/development.css") }}">
@endsection

@section("scripts")
<script src="{{ asset("js/development.js") }}" defer></script>
@endsection

@section("app-content")
<div id="development">
    <development-view :lesson="{{$lesson}}">
    </development-view>
</div>
@endsection
