@extends("layouts.dashboard")

@section("scripts")
<script src="{{asset("js/dashboard_chat_rooms.js")}}" defer></script>
@endsection

@section("links")
<link rel="stylesheet" href="{{asset("css/dashboard_chat_rooms.css")}}">
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
    <div>
        <table class="border-collapse w-100 mx-auto mt-3">
            <thead>
                <tr>
                    <th class="border border-dark p-3">名前</th>
                    <th class="border border-dark p-3">作成日</th>
                </tr>
            </thead>
            <tbody>
                @foreach($user->chatRooms->all() as $chatRoom)
                <tr>
                    <td class="border border-dark p-3"><a
                            href="{{route("chat_rooms.show", ["id" => $chatRoom->id])}}">{{$chatRoom->name}}</a></td>
                    <td class="border border-dark p-3">{{$chatRoom->created_at}}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection
