@extends("layouts.app")

@section("links")
<link rel="stylesheet" href="{{asset("css/chat_room_show.css")}}">
@endsection

@section("scripts")
<script src="{{asset("js/chat_room_show.js")}}" defer></script>
@endsection

@section("app-content")
<div id="chat-room-show" class="h-100 d-flex overflow-hidden">
    <div id="__user" hidden>{{json_encode($user)}}</div>
    <div id="__room" hidden>{{json_encode($chatRoom)}}</div>
    <div id="__messages" hidden>{{json_encode($chatRoom->messages)}}</div>
    <div id="__users" hidden>
        {{json_encode(array_map(function($messages) {return $messages->user;},$chatRoom->messages()->get()->all()))}}
    </div>
    <div class="bg-d3 w-25 h-100 pt-1 pb-3 d-flex flex-column justify-content-between">
        <div class="text-center text-light">メンバ一覧</div>
        <el-divider class="my-2"></el-divider>
        <div class="fill overflow-auto">
            @foreach($chatRoom->users as $member)
            <div class="d-flex align-items-center justify-content-center mb-2">
                <el-image
                    src="{{is_null($member->profile_image_path) ? url("storage/no-image.png") : url($member->profile_image_path)}}"
                    fit="contain" class="w-4 h-4 mr-2"></el-image>
                <a href="{{route("users.show", ["id" => $member->id])}}">{{$member->name}}</a>
            </div>
            @endforeach
        </div>
        <el-divider class="my-2"></el-divider>
        <div class="text-center">
            <el-button type="primary" v-on:click="showInvitationDialog">招待</el-button>
        </div>
    </div>
    <div class="w-75 h-100">
        <div class="messages" ref="messages">
            <div v-if="messages">
                <div v-for="message in messages" :key="message.id" class="d-flex mb-3">
                    <span v-if="!isIncomingMessage(message)" class="mr-3" v-text="message.user.name"></span>
                    <span :class="{'incoming': isIncomingMessage(message), 'outgoing': !isIncomingMessage(message)}"
                        class="message" v-html="parseText(message.text, message.user)">
                    </span>
                    <span v-if="isIncomingMessage(message)" class="ml-3" v-text="message.user.name"></span>
                </div>
            </div>
        </div>
        <div class="message-composer">
            <textarea ref="messageBox" v-model="text" class="resize-none w-100" rows="1"
                placeholder="Enterで改行、Shift+Enterで送信します" v-on:keydown.enter="growMessageBox"
                v-on:keydown.delete="shrinkMessageBox"
                v-on:keydown.enter.shift="submitMessage({{$user->id}}, {{$chatRoom->id}})"></textarea>
            <el-button type="primary" class="ml-3" v-on:click="submitMessage({{$user->id}}, {{$chatRoom->id}})">送信
            </el-button>
        </div>
    </div>
    <el-dialog :visible.sync="invitationDialog.isVisible" v-cloak>
        <el-tabs type="card">
            <el-tab-pane label="フォロー">
                @foreach($user->followings as $following)
                <div class="d-flex align-items-center px-2">
                    <img class="w-4 h-4"
                        src="{{$following->profile_image_path ? $following->profile_image_path : asset("storage/no-image.png")}}">
                    <div class="fs-3 ml-2">{{$following->name}}</div>
                    <div class="ml-auto">
                        @if(in_array($chatRoom->id, array_map(function($r) {return $r->id;},
                        $following->chatRooms->all())))
                        <el-button disabled>参加済み</el-button>
                        @elseif(in_array($following->id, array_map(function($i) {return $i->receiver_user_id;},
                        $chatRoom->invitationRequests->all())))
                        <el-button type="primary" disabled>招待済み</el-button>
                        @else
                        <el-button type="primary" v-on:click="invite($event, {{$following->id}})">招待</el-button>
                        @endif
                    </div>
                </div>
                <el-divider class="my-2"></el-divider>
                @endforeach
            </el-tab-pane>
            <el-tab-pane label="フォロワー"></el-tab-pane>
        </el-tabs>
    </el-dialog>
</div>
@endsection
