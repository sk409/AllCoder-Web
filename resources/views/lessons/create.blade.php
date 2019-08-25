@extends("layouts.app")

@section("app-content")
    <div class="container mt-4">
        <div class="card">
            <div class="card-header text-center">
                <h1>新規レッスン作成</h1>
            </div>
            <div class="card-body">
                {!! Form::model($lesson, ["route" => "lessons.store"]) !!}
                    @csrf
                    {!! Form::hidden("user_id", $user->id) !!}
                    <div class="form-group">
                        {!! Form::text("title", "", ["class" => "form-control", "placeholder" => "タイトル"]) !!}
                    </div>
                    <div class="form-group">
                        {!! Form::textarea("description", "", ["class" => "form-control", "placeholder" => "説明文"]) !!}
                    </div>
                    <div class="text-center">
                        {!! Form::submit("作成", ["class" => "btn btn-primary"]) !!}
                    </div>
                {!! Form::close() !!}
            </div>
        </div>
    </div>
@endsection