<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class FileDeltaController extends Controller
{


    public function delta(Request $request)
    {
        $request->validate([
            "delta_log_file_path" => "required"
        ]);
        $logFilePath = $request->delta_log_file_path;
        $appChanges = File::get($logFilePath, true);
        File::put($logFilePath, "");
        $pattern = "/(\\/opt\\/app\\/.*?) (CREATE|DELETE|MODIFY)(,ISDIR)? (.*)/u";
        preg_match_all($pattern, $appChanges, $matches);
        return $matches;
    }
}
