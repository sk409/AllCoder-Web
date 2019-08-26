@extends("layouts.app")

@section("metas")
    <meta name="lesson-id" content="{{ $lesson->id }}">
@endsection

@section("links")
    <link rel="stylesheet" href="{{ asset("css/development.css") }}">
@endsection

@section("scripts")
    <script src="{{ asset("js/development.js") }}" defer></script>
@endsection

@section("app-content")
    <div class="container-fluid vh-100">
        <div id="header" class="d-flex bg-light border-bottom p-2">
            <div class="d-flex align-items-center" contenteditable="true">
                {{ $lesson->title }}
            </div>
            <div class="ml-3 d-flex align-items-center">
                <button class="ml-2" type="button">ファイル</button>
                <button class="ml-2" type="button">ファイル</button>
                <button class="ml-2" type="button">ファイル</button>
            </div>
            <div class="ml-auto d-flex align-items-center">
                <a href="{{ route("dashboard.materials") }}" class="btn text-secondary">ホーム</a>
            </div>
        </div>
        <div id="body" class="row">
            <div class="col-9 h-100 p-0">
                <div class="h-75 d-flex">
                    <div id="folder-view" class="w-25 h-100 bg-primary">
                    </div>
                    <div class="w-75 h-100 bg-danger">
                        コード
                    </div>
                </div>
                <div class="h-25 d-flex">
                    <div class="w-25 bg-info">
                        問題
                    </div>
                    <div class="w-75 bg-secondary">
                        説明文
                    </div>
                </div>
            </div>
            <div class="col p-0 h-100 bg-dark">
                
            </div>
        </div>
    </div>
@endsection