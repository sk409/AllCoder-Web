@extends("layouts.app")

@section("links")
<link rel="stylesheet" href="{{asset("css/material_show.css")}}">
@endsection

@section("scripts")
<script src="{{asset("js/material_show.js")}}" defer></script>
@endsection

@include("components.navbar")

@section("app-content")
<div id="material-show" class="container pb-5">
    <div id="material-thumbnail-and-details" class="d-flex mt-4">
        <img id="material-thumbnail-image" src="{{url($material->thumbnail_image_path)}}">
        <div class="flex-grow-1 ml-4">
            <h3 id="material-title" class="mb-3">{{$material->title}}</h3>
            <div id="material-description">{{$material->description}}</div>
        </div>
    </div>
    <hr>
    @foreach($material->lessons as $lesson)
    <?php
    $rate = Auth::user()->lessonRatings->where("id", $lesson->id)->all();
    if (empty($rate)) {
        $rate = 0;
    } else {
        $rate = array_shift($rate)->pivot->value;
    }
    ?>
    <purchased-material-lesson-card :lesson="{{json_encode($lesson)}}" :rate="{{$rate}}" url="{{ route("development.learning",
            [
                "user_id" => Auth::user()->id,
                "material_id" => $material->id,
                "lesson_id" => $lesson->id
                ]
            )
        }}" :user-id="{{Auth::user()->id}}" class="mb-5 mx-auto lesson-card">
    </purchased-material-lesson-card>
    @endforeach
</div>
@endsection
