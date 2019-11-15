@extends("layouts.app")

@section("scripts")
<script src="{{asset("js/lesson_create.js")}}" defer></script>
@endsection

@section("app-content")
<div id="lesson-create" class="container mt-4">
    <el-card>
        <div slot="header" class="text-center">
            <h1>新規レッスン作成</h1>
        </div>
        <div>
            <lesson-form action="{{route("lessons.store")}}" :user-id="{{$user->id}}" :lesson="{}"></lesson-form>
            {{-- {!! Form::model($lesson, ["route" => "lessons.store"]) !!}
            @csrf
            {!! Form::hidden("user_id", $user->id) !!}
            <div class="form-group">
                {!! Form::label("lesson-title", "タイトル") !!}
                {!! Form::text("title", "", ["id" => "lesson-title", "class" => "form-control"]) !!}
            </div>
            <div class="form-group">
                {!! Form::label("lesson-description", "説明文") !!}
                {!! Form::textarea("description", "", ["id" => "lesson-description", "class" => "form-control"]) !!}
            </div>
            <div class="form-group">
                <el-card>
                    <div slot="header">環境設定</div>
                    <div>
                        <div>
                            <p>OS</p>
                            <div class="text-center">
                                <el-button type="success">設定</el-button>
                            </div>
                            <el-divider></el-divider>
                            <p>その他</p>
                        </div>
                        <div class="text-center">
                            <el-button type="success" v-on:click="showEnvironmentModal">追加</el-button>
                        </div>
                    </div>
                </el-card>
            </div>
            <el-divider></el-divider>
            <div class="text-center">{!! Form::submit("作成", ["class" => "btn btn-primary"]) !!}</div>
            {!! Form::close() !!} --}}
        </div>
    </el-card>
</div>
@endsection
