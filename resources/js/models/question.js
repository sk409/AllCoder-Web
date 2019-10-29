import Model from "./model.js";

export default class Question extends Model {

    static baseRoute() {
        return "questions";
    }

    static index(parameters, completion) {
        return Model.index(Question.baseRoute(), parameters, completion);
    }

    constructor(id, path, startIndex, endIndex, answer, lessonId) {
        super(Question.baseRoute());
        this.id = id;
        this.path = path;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.answer = answer;
        this.input = "";
        this.lessonId = lessonId;
    }

    parameters() {
        return {
            path: this.path,
            start_index: this.startIndex,
            end_index: this.endIndex,
            answer: this.answer,
            input: this.input,
            lesson_id: this.lessonId
        };
    }

    get path() {
        return this._path;
    }

    set path(value) {
        this._path = value;
    }

    get startIndex() {
        return this._startIndex;
    }

    set startIndex(value) {
        this._startIndex = value;
    }

    get endIndex() {
        return this._endIndex;
    }

    set endIndex(value) {
        this._endIndex = value;
    }

    get answer() {
        return this._answer;
    }

    set answer(value) {
        this._answer = value;
    }

    get input() {
        return this._input;
    }

    set input(value) {
        this._input = value;
    }

    get lessonId() {
        return this._lessonId;
    }

    set lessonId(value) {
        this._lessonId = value;
    }
}
