@extends("layouts.app")

@section("links")
<link rel="stylesheet" href="{{ asset("css/materials/create.css") }}">
@endsection

@section("scripts")
<script src="{{ asset("js/materials/create.js") }}" defer></script>
@endsection

@section("app-content")
<div id="material-creation">
    <material-form :material="{
                user: {
                    id: '{{$user->id}}',
                    lessons: {{$user->lessons}},
                }
            }" page-title="新規教材作成" method="post" action="{{ route("materials.store") }}" submit-button-text="作成">
    </material-form>
</div>
@endsection
