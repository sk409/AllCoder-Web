@extends("layouts.dashboard")

@section("scripts")
<script src="{{asset("js/dashboard_purchased_materials.js")}}" defer></script>
@endsection

@section("dashboard-content")
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
                v-on:click="transition('{{route("materials.show", ["material" => $material->id])}}')">詳細</el-button>
        </div>
    </div>
</el-card>
@endforeach
@endsection
