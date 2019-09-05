@extends("layouts.app")

@section("links")
    <link rel="stylesheet" href="{{ asset("css/materials/create.css") }}">
@endsection

@section("scripts")
    <script src="{{ asset("js/materials/create.js") }}" defer></script>
@endsection

@section("app-content")
    <div id="material-creation">
        <material-form
            :material="{{$material}}"
            :user="{{$user}}"
            :lessons="{{$lessons}}"
            page-title="{{$pageTitle}}"
            method="{{$method}}"
            action="{{$action}}"
            submit-button-text="{{$submitButtonText}}"
        ></material-form>
    </div>
@endsection