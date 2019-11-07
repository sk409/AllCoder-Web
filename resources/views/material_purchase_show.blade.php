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
            <h3 id="material-title">{{$material->title}}</h3>
            <div id="material-author-name">{{$material->user->name}}</div>
            <star-ratings :rating="{{$material->rating}}"></star-ratings>
            <div id="material-price">{{Helper::toAmountFormat($material->price)}}</div>
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
    <div class="card w-50 mx-auto">
        <div class="card-header">
            <div class="d-flex">
                <div>
                    {{$lesson->title}}
                </div>
                <div class="ml-auto">
                    <star-ratings :rating="3.3"></star-ratings>
                </div>
            </div>
        </div>
        <div class="card-body">
            @foreach(Rating::rank($lesson) as $rank => $rate)
            <div class="d-flex w-50 mx-auto">
                <star-ratings :rating="{{$rank}}"></star-ratings>
                <span class="ml-auto">{{(string)($rate * 100) . "%"}}</span>
            </div>
            @endforeach
            <hr>
            <div class="text-center">
                全{{count($lesson->ratings)}}件
            </div>
        </div>
    </div>
    @endforeach
    {{-- <div id="material-comments"></div> --}}
</div>
@endsection
