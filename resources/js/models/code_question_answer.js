import Model from "./model.js";

export default class CodeQuestionAnswer extends Model {
    static baseRoute() {
        return "code_question_answers";
    }

    static index(parameters, completion) {
        return Model.index(CodeQuestionAnswer.baseRoute(), parameters, completion);
    }

    constructor(text, userId, materialId, lessonId, codeQuestionId) {
        super(CodeQuestionAnswer.baseRoute());
        this.text = text;
        this.userId = userId;
        this.materialId = materialId;
        this.lessonId = lessonId;
        this.codeQuestionId = codeQuestionId;
    }

    parameters() {
        return {
            text: this.text,
            user_id: this.userId,
            material_id: this.materialId,
            lesson_id: this.lessonId,
            code_question_id: this.codeQuestionId
        };
    }

}
