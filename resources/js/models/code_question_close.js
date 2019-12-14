import Model from "./model.js";

export default class CodeQuestionClose extends Model {
    static baseRoute() {
        return "code_question_closes";
    }

    static index(parameters, completion) {
        return Model.index(CodeQuestionClose.baseRoute(), parameters, completion);
    }

    constructor(text, score, comment, codeQuestionId) {
        super(CodeQuestionClose.baseRoute());
        this.text = text;
        this.score = score;
        this.comment = comment;
        this.codeQuestionId = codeQuestionId;
    }

    parameters() {
        return {
            text: this.text,
            score: this.score,
            comment: this.comment,
            code_question_id: this.codeQuestionId,
        };
    }

}
