@extends("layouts.dashboard")

@section("scripts")
<script src="{{asset("js/dashboard_review.js")}}" defer></script>
@endsection

@section("dashboard-content")
<div class="w-75 mx-auto">
    <div class="text-center fs-4">今日学習すると最適な教材</div>
    <el-divider class="mt-2 mb-3"></el-divider>
    <div>
        @foreach ($review as $r)
        <?php
        $materialId = $r->material->id;
        ?>
        <el-card class="mb-3">
            <div slot="header">{{$r->material->title}}</div>
            <div>
                @foreach($r->lessons as $lesson)
                <?php
                $lessonId = $lesson->object->id;
                ?>
                @foreach($lesson->codeQuestions as $filePath => $codeQuestions)
                <?php
                $codeQuestionIds = "";
                foreach($codeQuestions as $codeQuestion) {
                    $codeQuestionIds .= "code_question_ids[]=$codeQuestion->id&";
                }
                ?>
                <div class="d-flex align-items-center">
                    <div>{{$filePath}}</div>
                    <a class="btn btn-primary ml-auto" href="
                        {{"/review?user_id=$user->id&material_id=$materialId&lesson_id=$lessonId&file_path=$filePath&$codeQuestionIds"}}
                    ">復習</a>
                </div>
                <el-divider class="my-2"></el-divider>
                @endforeach
                @endforeach
            </div>
        </el-card>
        @endforeach
    </div>
</div>
@endsection
