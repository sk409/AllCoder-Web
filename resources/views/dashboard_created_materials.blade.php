@extends("layouts.dashboard")

@section("scripts")
<script src="{{asset("js/dashboard_created_materials.js")}}" defer></script>
@endsection

@section("dashboard-content")
@foreach($materials as $material)
<el-card class="w-75 mx-auto mb-3">
    <div slot="header">
        <span>{{$material->title}}</span><span></span>
    </div>
    <div>
        <el-collapse v-model="expandedNames" class="mb-3">
            <el-collapse-item title="概要" name="1">{{$material->description}}</el-collapse-item>
        </el-collapse>
        <div class="text-center">
            <el-button type="primary">編集</el-button>
        </div>
    </div>
</el-card>
@endforeach
@endsection
