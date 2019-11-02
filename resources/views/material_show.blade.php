@extends("layouts.app")

@section("links")
@endsection

@section("scripts")
@endsection

@section("app-content")
<h1>{{$material->title}}</h1>
@foreach($material->lessons as $lesson)
<div>
    <a
        href="{{ route("development.learning", ["user_id" => $material->user->id, "material_id" => $material->id, "lesson_id" => $lesson->id]) }}">
        {{$lesson->title}}
    </a>
</div>
@endforeach
@endsection
