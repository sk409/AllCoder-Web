@foreach($lessons as $lesson)
    <div>
        <a href="{{route("development", $lesson->id)}}" target="_blank">{{$lesson->title}}</a>
    </div>
@endforeach