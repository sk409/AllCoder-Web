@extends("layouts.dashboard")

@section("scripts")
<script src="{{asset("js/dashboard_chat_rooms.js")}}" defer></script>
@endsection

@section("dashboard-content")
<div class="mx-auto">
    <div>
        <span>チャットルーム一覧</span>
        <el-button type="primary">新規作成</el-button>
    </div>
    <el-divider class="m-1"></el-divider>
</div>
@endsection
