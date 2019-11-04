@extends("layouts.app")

@section("links")
<link rel="stylesheet" href="{{asset("css/welcome.css")}}">
@endsection

@section("scripts")
<script src="{{asset("js/welcome.js")}}" defer></script>
@endsection

@include("components.navbar")

@section("app-content")

<div id="welcome" class="container mt-4">
    <div id="popular-materials">
        <h3>人気の教材</h3>
        <div class="d-flex justify-content-between">
            @foreach($popularMaterials as $popularMaterial)
            <div class="popular-material border shadow" v-on:click="clickedPopularMaterial">
                <img class="material-thumbnail-image border-bottom" src="{{$popularMaterial->thumbnail_image_path}}">
                <div class="mt-1 p-2">
                    <div class="material-title">{{$popularMaterial->title}}</div>
                    <div class="material-author-name">{{$popularMaterial->user->name}}</div>
                    <div class="material-price">{{Helper::toAmountFormat($popularMaterial->price)}}</div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</div>

@endsection


{{-- <!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Laravel</title>


    <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">


    <style>
        html,
        body {
            background-color: #fff;
            color: #636b6f;
            font-family: 'Nunito', sans-serif;
            font-weight: 200;
            height: 100vh;
            margin: 0;
        }

        .full-height {
            height: 100vh;
        }

        .flex-center {
            align-items: center;
            display: flex;
            justify-content: center;
        }

        .position-ref {
            position: relative;
        }

        .top-right {
            position: absolute;
            right: 10px;
            top: 18px;
        }

        .content {
            text-align: center;
        }

        .title {
            font-size: 84px;
        }

        .links>a {
            color: #636b6f;
            padding: 0 25px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: .1rem;
            text-decoration: none;
            text-transform: uppercase;
        }

        .m-b-md {
            margin-bottom: 30px;
        }

    </style>


</head>

<body>
    <div class="flex-center position-ref full-height">
        @if (Route::has('login'))
        <div class="top-right links">
            @auth
            <a href="{{ route("dashboard.purchased_materials") }}">Home</a>
            @else
            <a href="{{ route('login') }}">Login</a>

            @if (Route::has('register'))
            <a href="{{ route('register') }}">Register</a>
            @endif
            @endauth
        </div>
        @endif

        <div class="content">
            <div class="title m-b-md">
                Laravel
            </div>

            <div class="links">
                <a href="https://laravel.com/docs">Docs</a>
                <a href="https://laracasts.com">Laracasts</a>
                <a href="https://laravel-news.com">News</a>
                <a href="https://blog.laravel.com">Blog</a>
                <a href="https://nova.laravel.com">Nova</a>
                <a href="https://forge.laravel.com">Forge</a>
                <a href="https://github.com/laravel/laravel">GitHub</a>
            </div>
        </div>
    </div>
</body>

</html> --}}
