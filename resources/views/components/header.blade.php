<div id="header" class="d-flex align-items-center p-2">
    <a id="header-logo" class="text-white" href="{{ url('/') }}">
        {{ config('app.name', 'Laravel') }}
    </a>
    <div id="header-separator" class="ml-auto"></div>
    <img id="header-user-profile-image" data-toggle="dropdown" aria-haspopup="true" axis-expanded="false"
        src="{{is_null($profileImagePath) ? url("storage/no-image.png") : url($profileImagePath)}}">
    <div class="dropdown-menu" aria-labelledby="header-user-profile-image">
        <a href="{{ route('logout') }}" onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
            ログアウト
        </a>
    </div>
    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
        @csrf
    </form>
</div>
{{-- <div class="dropdown">
    <!-- 切替ボタンの設定 -->
    <button type="button" class="btn btn-secondary dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">
        ドロップダウンボタン
    </button>
    <!-- ドロップメニューの設定 -->
    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="#">メニュー1</a>
        <a class="dropdown-item" href="#">メニュー2</a>
        <a class="dropdown-item" href="#">メニュー3</a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" href="#">その他リンク</a>
    </div><!-- /.dropdown-menu -->
</div><!-- /.dropdown --> --}}
