@extends("layouts.dashboard")

@section("scripts")
<script src="{{asset("js/dashboard_chat_rooms.js")}}" defer></script>
@endsection

@section("links")
<link rel="stylesheet" href="{{asset("css/dashboard.css")}}">
<link rel="stylesheet" href="{{asset("css/dashboard_chat_rooms.css")}}">
@endsection

@section("dashboard-content")
<div class="mx-auto w-75">
    <div id="__user" hidden>{{json_encode($user)}}</div>
    <div id="__chat-rooms" hidden>{{json_encode($user->chatRooms->all())}}</div>
    <div id="__invitation-requests" hidden>{{json_encode($user->receivedInvitationRequests->all())}}</div>
    <div id="__users-sent-invitation-request" hidden>
        {{json_encode(array_map(function($r) {return $r->sender;}, $user->receivedInvitationRequests->all()))}}</div>
    <div id="__invited-rooms" hidden>
        {{json_encode(array_map(function($r) {return $r->room;}, $user->receivedInvitationRequests->all()))}}</div>
    <div v-if="invitationRequests && invitationRequests.length != 0">
        <div class="link" v-on:click="showInvitationRequestsDialog">チャットルームへの招待が届いています(<span
                v-text="invitationRequests.length"></span>)
        </div>
        <el-divider class="mt-2 mb-4"></el-divider>
    </div>
    <div class="d-flex align-items-center">
        <div>チャットルーム一覧</div>
        <div class="ml-auto">
            <el-button type="primary" v-on:click="transition('{{route("chat_rooms.create")}}')">新規作成</el-button>
        </div>
    </div>
    <el-divider class="my-2">
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
                <div v-if="user">
                    <tr v-for="chatRoom in (user ? user.chatRooms : [])" :key="chatRoom.id">
                        <td class="border border-dark p-3"><a :href="'/chat_rooms/' + chatRoom.id"
                                v-text="chatRoom.name"></a></td>
                        <td class="border border-dark p-3" v-text="chatRoom.created_at"></td>
                    </tr>
                </div>
            </tbody>
        </table>
    </div>
    <el-dialog :title="'チャットルームへの招待が届いています(' + invitationRequests.length + ')'"
        :visible.sync="invitationRequestsDialog.isVisible">
        <table class="table border-table border-collapse">
            <tr>
                <th>招待者</th>
                <th>チャットルーム</th>
                <th>操作</th>
            </tr>
            <tr v-for="invitationRequest in invitationRequests" :key="invitationRequest.id">
                <td><a :href="'/users/' + invitationRequest.sender.id" v-text="invitationRequest.sender.name"></a>
                </td>
                <td v-text="invitationRequest.room.name"></td>
                <td>
                    <div>
                        <el-button type="primary" v-on:click="attend(invitationRequest.id, invitationRequest.room.id)">
                            参加</el-button>
                    </div>
                    <div class="mt-1">
                        <el-button type="danger" v-on:click="destoryInvitationRequest(invitationRequest.id)">拒否
                        </el-button>
                    </div>
                </td>
            </tr>
        </table>
    </el-dialog>
</div>
@endsection
