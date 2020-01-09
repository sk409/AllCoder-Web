@extends("layouts.app")

@section("links")
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/xcode.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.0/katex.min.css">
@endsection

@section("scripts")
<script src="{{asset("js/development_reading.js")}}" defer></script>
@endsection

<div id="development-reading" class="w-100 h-100">
    <development-reading markdown-text="{{$markdownText}}"></development-reading>
    {{-- <markdown-editor></markdown-editor> --}}
    {{-- <markdown-editor lesson-id="{{$lesson->id}}">
    </markdown-editor> --}}
</div>
