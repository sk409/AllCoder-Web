import Model from "./model.js";

export default class CodeQuestion extends Model {
    static baseRoute() {
        return "code_questions";
    }

    static index(parameters, completion) {
        return Model.index(CodeQuestion.baseRoute(), parameters, completion);
    }

    constructor(filePath, startIndex, endIndex, text, score, correctComment, incorrectComment, lessonId) {
        super(CodeQuestion.baseRoute());
        this.filePath = filePath;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.text = text;
        this.score = score;
        this.correctComment = correctComment;
        this.incorrectComment = incorrectComment;
        this.lessonId = lessonId;
    }

    parameters() {
        return {
            file_path: this.filePath,
            start_index: this.startIndex,
            end_index: this.endIndex,
            text: this.text,
            score: this.score,
            correct_comment: this.correctComment,
            incorrect_comment: this.incorrectComment,
            lesson_id: this.lessonId,
        };
    }

}
