@extends("layouts.dashboard")

@section("dashboard-content")
@foreach($lessons as $lesson)
<div>
    <a href="{{ route("development.creating", ["lesson" => $lesson->id]) }}" target="_blank">{!! $lesson->title
        !!}</a>
</div>
@endforeach
@endsection
