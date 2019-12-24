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
    <div class="bg-d3 w-25 h-100">
        <div>メンバ一覧</div>
        <div>
            @foreach($chatRoom->users as $member)
            <div>
                <a href="{{route("users.show", ["id" => $member->id])}}">{{$member->name}}</a>
            </div>
            @endforeach
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
</div>
@endsection
