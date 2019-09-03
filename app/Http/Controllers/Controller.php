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

    protected static function narrowDownFromConditions(Request $request, callable $all, callable $where) {
        $conditions = $request->all();
        if (!$conditions) {
            return call_user_func($all);
        }
        $result = null;
        foreach ($conditions as $conditionKey => $conditionValue) {
            if (is_null($result)) {
                $result = call_user_func($where, $conditionKey, $conditionValue);
            } else {
                $result = $result->where($conditionKey, $conditionValue);
            }
        }
        return $result->get();
    }
}
