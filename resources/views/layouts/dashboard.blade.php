@extends('layouts.app')

@include("components.navbar")

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
                        <li class="nav-item"><a class="nav-link {{ Request::is("dashboard/materials") ? "active" : "" }}" href="{{ route("dashboard.materials") }}">教材</a></li>
                        <li class="nav-item"><a class="nav-link {{ Request::is("dashboard/lessons") ? "active" : "" }}" href="{{ route("dashboard.lessons") }}">レッスン</a></li>
                    </ul>
                    @yield("dashboard-content")
                </div>
            </div>
            <div class="col-3">
                <div class="d-flex flex-column">
                    <a class="btn btn-primary mx-auto w-50" href="{{ route("materials.create") }}" target="_blank">教材作成</a>
                    <a class="btn btn-primary mx-auto mt-3 w-50" href="{{ route("lessons.create") }}" target="_blank">レッスン作成</a>
                </div>
            </div>
        </div>
    </div>
@endsection
