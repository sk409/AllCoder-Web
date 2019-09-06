@extends("layouts.app")

@section("links")
    <link rel="stylesheet" href="{{ asset("css/materials/edit.css") }}">
@endsection

@section("scripts")
    <script src="{{ asset("js/materials/edit.js") }}" defer></script>
@endsection

@section("app-content")
    <div id="material-editing">
        <material-form
            :material="{
                title: '{{ $material->title }}',
                description: '{{ $material->description }}',
                price: '{{ $material->price }}',
                lessons: {{ $material->lessons }},
                user: {
                    id: '{{ $user->id }}',
                    lessons: {{ $user->lessons }},
                }
            }"
            page-title="教材編集"
            method="put"
            action="{{ route("materials.update", $material->id) }}"
            submit-button-text="適用"
        ></material-form>
    </div>
@endsection