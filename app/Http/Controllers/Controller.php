<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class Controller extends BaseController
{

    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected static function narrowDownFromConditions(Request $request, Collection $all, array $conditions) {
        return $all->where("lesson_id", $request->lesson_id);
        // foreach ($conditions as $condition) {
        //     if (!$request->has($condition)) {
        //         continue;
        //     }
        //     $all = $all->where($condition, $request[$condition]);
        // }
        // return $all;
    }
}
