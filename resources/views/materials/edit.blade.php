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
            :material="{{$material}}"
            :user="{{$user}}"
            :lessons="{{$lessons}}"
            :selected-lessons="{{$material->lessons}}"
            page-title="{{$pageTitle}}"
            method="{{$method}}"
            action="{{$action}}"
            submit-button-text="{{$submitButtonText}}"
        ></material-form>
    </div>
@endsection