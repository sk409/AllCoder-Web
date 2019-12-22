@extends("layouts.app")

@section("scripts")
<script src="{{asset("js/chat_room_show.js")}}" defer></script>
@endsection

@section("app-content")
<div id="chat-room-show" class="h-100 d-flex">
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
    <div class="fill d-flex flex-column">
        <div class="fill">
            @foreach($chatRoom->messages as $message)
            <div class="mt-3 p-2 d-flex">
                @if($message->user->id !== $user->id)
                <div class="mr-1">{{$message->user->name}}</div>
                @endif
                <div class="border border-dark p-1" :class="{'ml-auto': {{$message->user->id}} === {{$user->id}}}">
                    {{$message->text}}
                </div>
                @if($message->user->id === $user->id)
                <div class="ml-1">{{$message->user->name}}</div>
                @endif
            </div>
            @endforeach
        </div>
        <el-divider class="m-1"></el-divider>
        <div class="d-flex align-items-center p-2">
            <textarea ref="messageBox" v-model="message" class="resize-none w-100" rows="1" placeholder="Enterで改行、Shift+Enterで送信します" v-on:keydown.enter="growMessageBox"
                v-on:keydown.delete="shrinkMessageBox" v-on:keydown.enter.shift="submitMessage({{$user->id}}, {{$chatRoom->id}})"></textarea>
            <el-button type="primary" class="ml-3" v-on:click="submitMessage({{$user->id}}, {{$chatRoom->id}})">送信
            </el-button>
        </div>
    </div>
</div>
@endsection
