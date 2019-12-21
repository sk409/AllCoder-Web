<div id="header" class="d-flex align-items-center p-2">
    <a id="header-logo" class="text-white" href="{{ url('/') }}">
        {{ config('app.name', 'Laravel') }}
    </a>
    <a class="text-white ml-auto" href="{{ route('logout') }}" onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
        {{ __('Logout') }}
    </a>
    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
        @csrf
    </form>
    <el-divider direction="vertical" class="mx-3"></el-divider>
    <el-image id="header-user-profile-image"
        src="{{is_null($profileImagePath) ? asset("storage/no-image.png") : url($profileImagePath)}}" fit="contain">
    </el-image>
</div>
