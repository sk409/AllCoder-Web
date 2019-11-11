@extends('layouts.app')

@section("links")
<link rel="stylesheet" href="{{asset("css/dashboard.css")}}">
@endsection

@section('app-content')
<div id="dashboard" class="h-100">
    <el-container class="h-100">
        <el-header id="dashboard-header" class="d-flex align-items-center">
            <a id="dashboard-header-logo" class="text-white" href="{{ url('/') }}">
                {{ config('app.name', 'Laravel') }}
            </a>
            <a class="text-white ml-auto" href="{{ route('logout') }}" onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                {{ __('Logout') }}
            </a>
            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                @csrf
            </form>
            <el-divider direction="vertical" class="mx-3"></el-divider>
            <el-image id="user-profile-image" src="{{url($user->profile_image_path)}}" fit="contain"></el-image>
        </el-header>
        <el-container>
            <el-aside class="h-100">
                <el-menu class="text-center h-100" default-active="{{$activeIndex}}" background-color="#545c64"
                    text-color="#fff" active-text-color="#ffd04b">
                    <el-menu-item index="1">
                        <div v-on:click="transition('{{route("dashboard.purchased_materials")}}')">購入した教材</div>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <div v-on:click="transition('{{route("dashboard.created_materials")}}')">作成した教材</div>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <div v-on:click="transition('{{route("dashboard.lessons")}}')">作成したレッスン</div>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                @yield("dashboard-content")
            </el-main>
        </el-container>
    </el-container>
</div>
{{-- <div id="container">
    <div id="left-container">
        <div id="profile">
            <div id="profile-image-container">
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
        <li class="nav-item"><a class="nav-link {{ Request::is("dashboard/purchased_materials") ? "active" : "" }}"
                href="{{ route("dashboard.purchased_materials") }}">購入した教材</a></li>
        <li class="nav-item"><a class="nav-link {{ Request::is("dashboard/created_materials") ? "active" : "" }}"
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
</div> --}}
@endsection
