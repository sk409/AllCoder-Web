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
    ?>
    <purchased-material-lesson-card :lesson="{{json_encode($lesson)}}"
        :rate="{{0 === count($rate) ? 0 : $rate[0]->pivot->value}}" url="{{ route("development.learning",
            [
                "user_id" => Auth::user()->id,
                "material_id" => $material->id,
                "lesson_id" => $lesson->id
                ]
            )
        }}" :user-id="{{Auth::user()->id}}" class="mb-5 mx-auto lesson-card">
    </purchased-material-lesson-card>
    @endforeach
    {{-- <hr>
    <div id="material-author" class="d-flex">
        <div id="material-author-profile-image-container">
            <img id="material-author-profile-image" src="{{url($material->user->profile_image_path)}}">
</div>
<div>
    <div>{{$material->user->name}}</div>
    <div>{{$material->user->bio_text}}</div>
</div>
</div>
<hr>
<div class="text-center mt-4 mb-4">
    <h3>レッスン一覧</h3>
</div> --}}
{{-- @foreach($material->lessons as $lesson)
    <lesson-details-card :lesson="{{json_encode($lesson)}}" :ratings="{{json_encode($lesson->ratings)}}"
:rank="{{json_encode(Rating::rank($lesson))}}">
</lesson-details-card>
@endforeach --}}
</div>
@endsection
