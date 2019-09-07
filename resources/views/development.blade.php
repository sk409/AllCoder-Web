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
            :lesson="{
                id: {{$lesson->id}},
                title: '{{$lesson->title}}'
            }"
            :image-urls="{
                plusButton: '{{asset("images/plus-button.png")}}',
                prevButton: '{{asset("images/prev-button.png")}}',
                nextButton: '{{asset("images/next-button.png")}}',
                crossButton: '{{asset("images/cross-button.png")}}'
            }"
        ></development-view>
    </div>
@endsection