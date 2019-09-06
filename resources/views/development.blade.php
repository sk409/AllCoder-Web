@extends("layouts.app")

@section("links")
    <link rel="stylesheet" href="{{ asset("css/development.css") }}">
@endsection

@section("scripts")
    <script src="{{ asset("js/development.js") }}" defer></script>
@endsection

@section("app-content")
    <div id="development">
        <development-view
            :lesson-id="{{$lesson->id}}"
            lesson-title="{{$lesson->title}}"
            plus-button-url="{{asset("images/plus-button.png")}}"
            prev-button-url="{{asset("images/prev-button.png")}}"
            next-button-url="{{asset("images/next-button.png")}}"
            cross-button-url="{{asset("images/cross-button.png")}}"
        ></development-view>
    </div>
@endsection