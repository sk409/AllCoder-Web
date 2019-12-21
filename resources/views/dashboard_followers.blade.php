@extends("layouts.dashboard")

@section("scripts")
<script src="{{asset("js/dashboard_followers.js")}}" defer></script>
@endsection

@section("dashboard-content")
FOLLOWERS
{{-- <div class="d-flex align-items-center">
    <div>
        全{{count($materials)}}件
</div>
<el-button type="primary" class="ml-auto" v-on:click="transition('{{route("materials.create")}}')">新規作成</el-button>
</div>
<el-divider></el-divider>
@foreach($materials as $material)
<el-card class="w-75 mx-auto mb-3">
    <div slot="header">
        <span>{{$material->title}}</span><span></span>
    </div>
    <div>
        <el-collapse v-model="expandedNames" class="mb-3">
            <el-collapse-item title="概要" name="{{$material->id}}">{{$material->description}}</el-collapse-item>
        </el-collapse>
        <div class="text-center">
            <el-button type="primary"
                v-on:click="transition('{{route("materials.edit", ["material" => $material->id])}}')">編集</el-button>
        </div>
    </div>
</el-card> --}}
{{-- @endforeach --}}
@endsection
