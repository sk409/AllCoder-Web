@extends('layouts.app')


@section('app-content')
<div id="dashboard" class="h-100">
    <el-container class="h-100" v-cloak>
        <el-aside class="h-100">
            <el-menu class="text-center h-100" default-active="{{$activeIndex}}" background-color="#545c64"
                text-color="#fff" active-text-color="#ffd04b">
                <el-menu-item index="1">
                    <div v-on:click="transition('{{route("dashboard.purchased_materials")}}')">取得した教材</div>
                </el-menu-item>
                <el-menu-item index="2">
                    <div v-on:click="transition('{{route("dashboard.created_materials")}}')">作成した教材</div>
                </el-menu-item>
                <el-menu-item index="3">
                    <div v-on:click="transition('{{route("dashboard.lessons")}}')">作成したレッスン</div>
                </el-menu-item>
                <el-menu-item index="4">
                    <div v-on:click="transition('{{route("dashboard.following")}}')">フォロー</div>
                </el-menu-item>
                <el-menu-item index="5">
                    <div v-on:click="transition('{{route("dashboard.follower")}}')">フォロワー</div>
                </el-menu-item>
                <el-menu-item index="6">
                    <div v-on:click="transition('{{route("dashboard.chat_rooms")}}')"
                        class="d-flex align-items-center justify-content-center">
                        チャットルーム
                    </div>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
            @yield("dashboard-content")
        </el-main>
    </el-container>
</div>
@endsection
