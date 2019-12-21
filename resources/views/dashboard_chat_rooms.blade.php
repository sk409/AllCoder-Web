@extends("layouts.dashboard")

@section("scripts")
<script src="{{asset("js/dashboard_chat_rooms.js")}}" defer></script>
@endsection

@section("dashboard-content")
<div class="mx-auto w-75">
    <div class="d-flex">
        <div>チャットルーム一覧</div>
        <div class="ml-auto">
            <el-button type="primary" v-on:click="transition('{{route("chat_rooms.create")}}')">新規作成</el-button>
        </div>
    </div>
    <el-divider class="m-1">
    </el-divider>
</div>
@endsection
