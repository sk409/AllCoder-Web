<?php

namespace App\Helpers;

use App\Lesson;

class Rating
{

    public static function rank(Lesson $lesson): array
    {
        $maxStarCount = 5;
        $r = [];
        $m = [];
        for ($i = 1; $i <= $maxStarCount; ++$i) {
            $r[$i] = 0;
            $m[$i] = 0;
        }
        $total = count($lesson->ratings);
        if ($total === 0) {
            return $r;
        }
        foreach ($lesson->ratings as $rating) {
            $m[$rating->pivot->value] += 1;
        }
        foreach ($m as $index => $sum) {
            $r[$index] = $sum / $total;
        }
        return $r;
    }
}
