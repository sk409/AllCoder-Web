@extends("layouts.app")

@section("scripts")
<script src="{{asset("js/development_writing.js")}}" defer></script>
@endsection

<div id="development-writing">
    <markdown-editor lesson-id="{{$lesson->id}}">
    </markdown-editor>
</div>
