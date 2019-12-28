@extends("layouts.app")

@section("scripts")
<script src="{{asset("js/development_writing.js")}}" defer></script>
@endsection

<div id="development-writing">
    <development-writing lesson-id="{{$lesson->id}}" :questions="{{json_encode($lesson->codeQuestions->all())}}">
    </development-writing>
</div>
