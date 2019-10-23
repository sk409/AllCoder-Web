@extends("layouts.dashboard")

@section("dashboard-content")
    @foreach($materials as $material)
        <div>
            <a href="{{ route("materials.edit", $material->id) }}">{{$material->title}}</a>
        </div>
    @endforeach
@endsection