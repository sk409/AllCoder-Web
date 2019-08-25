@extends("layouts.app")

@section("links")
    <link rel="stylesheet" href="{{ asset("css/development.css") }}">
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
                <a href="{{ route("home.materials") }}" class="btn text-secondary">ホーム</a>
            </div>
        </div>
        <div id="body" class="row">
            <div class="col-9">
                <div class="h-75 d-flex">
                    <div class="w-25 bg-primary resizable">
                        ファイル
                    </div>
                    <div class="w-75 bg-danger">
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
            <div class="col-3 h-100 bg-dark">
                
            </div>
        </div>
    </div>
@endsection