@extends("layouts.app")

@section("links")
<link rel="stylesheet" href="{{asset("css/user_show.css")}}">
@endsection

@section("scripts")
<script src="{{asset("js/user_show.js")}}" defer></script>
@endsection

@section("app-content")
<div id="user-show" class="w-75 mx-auto mt-3">
    <div>
        <div class="d-flex align-items-center">
            <img class="w-5 h-5"
                src="{{$user->profile_image_path ? $user->profile_image_path : asset("storage/no-image.png")}}">
            <div class="ml-2">{{$user->name}}</div>
            <div class="ml-auto">
                @if($user->id === Auth::user()->id)
                @elseif(in_array(Auth::user()->id, array_map(function($f) {return $f->id;}, $user->followers->all())))
                <el-button v-on:click="follow($event, {{$user->id}},{{Auth::user()->id}})" disabled>
                    フォロー済み
                </el-button>
                @else
                <el-button type="primary" v-on:click="follow($event,{{Auth::user()->id}}, {{$user->id}})">
                    フォロー
                </el-button>
                @endif
            </div>
        </div>
        <div>
            {{$user->bio_text}}
        </div>
    </div>
    <el-divider class="my-2"></el-divider>
    <div class="pl-2">
        <span>作成した教材一覧</span>
    </div>
    <div class="materials">
        @foreach($user->materials as $material)
        <div class="p-2">
            <el-card class="material" v-cloak>
                <div slot="header">
                    <a
                        href="{{route("material_purchase.show", ['material' => $material->id])}}">{{$material->title}}</a>
                </div>
                <el-collapse v-model="activeMaterialIds">
                    <el-collapse-item title="概要" name="{{$material->id}}">
                        {{$material->description}}
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </div>
        @endforeach
    </div>
</div>
@endsection
