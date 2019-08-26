@extends("layouts.dashboard")

@section("dashboard-content")
    @include("partials.lessons", ["lessons" => $lessons])
@endsection