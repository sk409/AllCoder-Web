@extends('layouts.app')

@include("partials.navbar")

@section('app-content')
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-9 p-4 border shadow">
                <div class="d-flex border-bottom pb-4">
                    <div class="">
                        <i class="fas fa-user display-1"></i>
                    </div>
                    <div class="ml-4 flex-grow-1">
                        <div class="d-flex align-items-center">
                            <div>{{ $user->name }}</div>
                            <a href="#" class="ml-auto">フォロー</a>
                            <a class="ml-4" href="#">フォロワー</a>
                            <a class="ml-4 btn btn-link border-primary rounded-pill" href="#" >編集</a>
                        </div>
                        <p class="mt-2">{{ $user->bio_text }}</p>
                    </div>
                </div>
                <div class="mt-3">
                    <ul class="nav nav-tabs">
                        <li class="nav-item"><a class="nav-link {{ Request::is("home/materials") ? "active" : "" }}" href="{{ route("home.materials") }}">教材</a></li>
                        <li class="nav-item"><a class="nav-link {{ Request::is("home/lessons") ? "active" : "" }}" href="{{ route("home.lessons") }}">レッスン</a></li>
                    </ul>
                    @yield("dashboard-content")
                </div>
            </div>
            <div class="col-3">
                <div class="d-flex flex-column">
                    <a href="#" class="btn btn-primary mx-auto w-50">教材作成</a>
                    <a href="{{ route("lessons.create") }}" class="btn btn-primary mx-auto mt-3 w-50">レッスン作成</a>
                </div>
            </div>
        </div>
    </div>
@endsection
