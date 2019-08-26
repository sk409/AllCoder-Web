@extends("layouts.dashboard")

@section("dashboard-content")
    @include("partials.materials", ["materials" => $materials])
@endsection