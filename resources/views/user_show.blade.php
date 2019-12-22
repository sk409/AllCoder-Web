@extends("layouts.app")

@section("scripts")
<script src="{{asset("js/user_show.js")}}" defer></script>
@endsection

@section("app-content")
<div id="user-show">
    <div>
        <div>
            <span>教材一覧</span>
        </div>
        @foreach($user->materials as $material)
        <div>
            <a href="{{route("material_purchase.show", ['material' => $material->id])}}">{{$material->title}}</a>
        </div>
        @endforeach
    </div>
</div>
@endsection
