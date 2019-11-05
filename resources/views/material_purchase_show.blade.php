@extends("layouts.app")

@section("links")
<link rel="stylesheet" href="{{asset("css/material_purchase_show.css")}}">
@endsection

@section("scripts")
<script src="{{asset("js/material_purchase_show.js")}}" defer></script>
@endsection

@include("components.navbar")

@section("app-content")
<div id="material-purchase-show" class="container">
    <div id="material-thumbnail-and-details" class="d-flex mt-3">
        <img id="material-thumbnail-image" src="{{url($material->thumbnail_image_path)}}">
        <div class="flex-grow-1 ml-4">
            <h3 id="material-title">{{$material->title}}</h3>
            <div id="material-author">{{$material->user->name}}</div>
            <div id="material-price">{{Helper::toAmountFormat($material->price)}}</div>
            <div class="text-right">
                <button type="button" class="btn btn-primary"
                    v-on:click="onClickPurchaseButton('{{route("material_purchase.purchase", $material->id)}}', {{Auth::user()->id}})">購入</button>
            </div>
        </div>
    </div>
    <div id="material-author">

    </div>
    <div id="material-evaluations"></div>
    <div id="material-comments"></div>
</div>
@endsection
