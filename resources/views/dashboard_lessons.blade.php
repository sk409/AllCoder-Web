@extends("layouts.dashboard")

@section("scripts")
<script src="{{asset("js/dashboard_lessons.js")}}" defer></script>
@endsection

@section("dashboard-content")
@foreach($lessons as $lesson)
<el-card class="w-75 mx-auto mb-3">
    <div slot="header">
        <span>{{$lesson->title}}</span><span></span>
    </div>
    <div>
        <el-collapse v-model="expandedNames" class="mb-3">
            <el-collapse-item title="概要" name="{{$lesson->id}}">{{$lesson->description}}</el-collapse-item>
        </el-collapse>
        <div class="text-center">
            <el-button type="primary"
                v-on:click="transition('{{route("development.creating", ["lesson" => $lesson->id])}}')">編集</el-button>
        </div>
    </div>
</el-card>
@endforeach
@endsection
