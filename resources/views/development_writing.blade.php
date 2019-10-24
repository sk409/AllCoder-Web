@extends("layouts.app")

@section("scripts")
<script src="{{asset("js/development_writing.js")}}" defer></script>
@endsection

<div id="development-writing">
    <development-writing lesson-id="{{$lesson->id}}"></development-writing>
</div>
