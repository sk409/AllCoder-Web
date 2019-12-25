@extends("layouts.dashboard")

@section("links")
<link rel="stylesheet" href="{{asset("css/dashboard.css")}}">
@endsection

@section("scripts")
<script src="{{asset("js/dashboard_followings.js")}}" defer></script>
@endsection

@section("dashboard-content")
<div class="w-75 mx-auto">
    <div class="d-flex align-items-center justify-content-between">
        <div>
            フォローしているユーザ一覧
        </div>
        <div>
            <el-button type="primary" v-on:click="showUserSearchDialog">検索</el-button>
        </div>
    </div>
    <el-divider class="my-2"></el-divider>
    <div>
        @foreach($user->followings as $following)
        <div>
            <img class="w-4 h-4"
                src="{{$following->profile_image_path ? $following->profile_image_path : asset('storage/no-image.png')}}">
            <a class="ml-1 fs-4" href="{{route("users.show", ["id" => $following->id])}}">{{$following->name}}</a>
        </div>
        <el-divider class="my-2"></el-divider>
        @endforeach
    </div>
    <el-dialog :visible.sync="userSearchDialog.isVisible">
        <div class="d-flex align-items-center">
            <el-input v-model="userSearchDialog.username" class="fill"></el-input>
            <el-button type="primary" v-on:click="searchUser" class="ml-3">検索</el-button>
        </div>
        <el-divider class="my-2"></el-divider>
        <div v-for="user in userSearchDialog.users" :key="user.id">
            <div class="d-flex align-items-center">
                <img class="w-4 h-4"
                    :src="user.profile_image_path ? user.profile_image_path : '{{asset("storage/no-image.png")}}'">
                <a class="ml-1 fs-4" :href="'/users/' + user.id" v-text="user.name"></a>
            </div>
        </div>
    </el-dialog>
</div>
@endsection
