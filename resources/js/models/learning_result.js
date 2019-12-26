import Model from "./model.js";

export default class LearningResult extends Model {
    static baseRoute() {
        return "learning_results";
    }

    static index(parameters, completion) {
        return Model.index(LearningResult.baseRoute(), parameters, completion);
    }

    constructor(evaluation, count, userId, materialId, lessonId, codeQuestionId) {
        super(LearningResult.baseRoute());
        this.evaluation = evaluation;
        this.count = count;
        this.userId = userId;
        this.materialId = materialId;
        this.lessonId = lessonId;
        this.codeQuestionId = codeQuestionId;
    }

    parameters() {
        return {
            id: this.id,
            evaluation: this.evaluation,
            count: this.count,
            user_id: this.userId,
            material_id: this.materialId,
            lesson_id: this.lessonId,
            code_question_id: this.codeQuestionId
        };
    }

}
