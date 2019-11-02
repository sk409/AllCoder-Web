@extends('layouts.app')

@section("links")
<link rel="stylesheet" href="{{ asset("css/dashboard/dashboard.css") }}">
@endsection

@include("components.navbar")

@section('app-content')
<div id="container">
    <div id="left-container">
        <div id="profile">
            <div id="profile-image-container">
                {{-- {{$user->profile_image_path}} --}}
                @if($user->profile_image_path)
                <img id="profile-image" src={{asset($user->profile_image_path)}} alt="プロフィール画像">
                @else
                <i class="fas fa-user display-1"></i>
                @endif
            </div>
            <div id="profile-buttons-container">
                <div class="d-flex align-items-center">
                    <div>{{ $user->name }}</div>
                    <a id="follow-button" class="profile-button" href="#">フォロー</a>
                    <a class="profile-button" href="#">フォロワー</a>
                    <a class="profile-button" href="#">編集</a>
                </div>
                <p id="bio-text">{{ $user->bio_text }}</p>
            </div>
        </div>
        <div id="items">
            <ul class="nav nav-tabs">
                <li class="nav-item"><a
                        class="nav-link {{ Request::is("dashboard/purchased_materials") ? "active" : "" }}"
                        href="{{ route("dashboard.purchased_materials") }}">購入した教材</a></li>
                <li class="nav-item"><a
                        class="nav-link {{ Request::is("dashboard/created_materials") ? "active" : "" }}"
                        href="{{ route("dashboard.created_materials") }}">作成した教材</a></li>
                <li class="nav-item"><a class="nav-link {{ Request::is("dashboard/lessons") ? "active" : "" }}"
                        href="{{ route("dashboard.lessons") }}">レッスン</a></li>
            </ul>
            @yield("dashboard-content")
        </div>
    </div>
    <div id="right-container">
        <a href="{{ route("materials.create") }}">教材作成</a>
        <a href="{{ route("lessons.create") }}" target="_blank">レッスン作成</a>
    </div>
</div>
@endsection
