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
            <el-image id="user-profile-image"
                src="{{is_null($user->profile_image_path) ? asset("storage/no-image.png") : url($user->profile_image_path)}}"
                fit="contain"></el-image>
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
@endsection
