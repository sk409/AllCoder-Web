import Model from "./model.js";

export default class LessonRating extends Model {
    static baseRoute() {
        return "lesson_ratings";
    }

    static index(parameters, completion) {
        return Model.index(LessonRating.baseRoute(), parameters, completion);
    }

    constructor(lessonId, userId, value) {
        super(LessonRating.baseRoute());
        this.lessonId = lessonId;
        this.userId = userId;
        this.value = value;
    }

    parameters() {
        return {
            lesson_id: this.lessonId,
            user_id: this.userId,
            value: this.value
        };
    }

    get lessonId() {
        return this._lessonId;
    }

    set lessonId(value) {
        this._lessonId = value;
    }

    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId = value;
    }

    get value() {
        return this._value;
    }

    set value(v) {
        return this._value = v;
    }

}
