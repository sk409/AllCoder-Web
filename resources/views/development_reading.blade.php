@extends("layouts.app")

@section("scripts")
<script src="{{asset("js/development_reading.js")}}" defer></script>
@endsection

<div id="development-reading" class="w-100 h-100">
    <development-reading markdown-text="{{$markdownText}}"></development-reading>
</div>
