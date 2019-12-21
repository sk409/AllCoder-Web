@extends("layouts.app")

@section("scripts")
<script src="{{asset("js/chat_room_create.js")}}" defer></script>
@endsection

@section("app-content")
<div id="chat-room-create">
    @include("components.header", ["profileImagePath"=>$user->profile_image_path])
    <el-card class="w-75 mx-auto mt-5">
        <div slot="header">チャットルーム作成</div>
        <chat-room-create redirect-url="{{route("dashboard.chat_rooms")}}"></chat-room-create>
    </el-card>
</div>
@endsection
