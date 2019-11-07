@extends("layouts.app")

@section("links")
<link rel="stylesheet" href="{{asset("css/material_purchase_show.css")}}">
@endsection

@section("scripts")
<script src="{{asset("js/material_purchase_show.js")}}" defer></script>
@endsection

@include("components.navbar")

@section("app-content")
<div id="material-purchase-show" class="container pb-5">
    <div id="material-thumbnail-and-details" class="d-flex mt-3">
        <img id="material-thumbnail-image" src="{{url($material->thumbnail_image_path)}}">
        <div class="flex-grow-1 ml-4">
            <h3 id="material-title" class="mb-1">{{$material->title}}</h3>
            <el-rate :value="{{$material->rating}}" :allow-half="true" class="mb-1" disabled></el-rate>
            <div class="mb-1">
                <i class="el-icon-download mr-1"></i>
                <span>{{count($material->purchases)}}</span>
            </div>
            <div id="material-price" class="mb-2">{{Helper::toAmountFormat($material->price)}}</div>
            <div class="text-right">
                @if(1 === count(Auth::user()->purchases->where("id", $material->id)->all()))
                <button type="button" class="btn btn-success" disabled>購入済み</button>
                @elseif(Auth::user()->id === $material->user->id)
                <a href="{{route("materials.edit", ["material"=>$material->id])}}" class="btn btn-success">編集する</a>
                @else
                <button type="button" class="btn btn-primary"
                    v-on:click="onClickPurchaseButton('{{route("material_purchase.purchase", $material->id)}}', {{Auth::user()->id}})">購入</button>
                @endif
            </div>
        </div>
    </div>
    <hr>
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
    </div>
    @foreach($material->lessons as $lesson)
    <lesson-details-card :lesson="{{json_encode($lesson)}}" :ratings="{{json_encode($lesson->ratings)}}"
        :rank="{{json_encode(Rating::rank($lesson))}}">
    </lesson-details-card>
    @endforeach
    {{-- <div id="material-comments"></div> --}}
</div>
@endsection
