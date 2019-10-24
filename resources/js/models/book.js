import Model from "./model.js";

export default class Book extends Model {
    static baseRoute() {
        return "books";
    }

    static index(parameters, completion) {
        return Model.index(Book.baseRoute(), parameters, completion);
    }

    constructor(id, text, lessonId) {
        super(Book.baseRoute());
        this.id = id;
        this.text = text;
        this.lessonId = lessonId;
    }

    parameters() {
        return {
            text: this.text,
            lesson_id: this.lessonId
        };
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }

    get lessonId() {
        return this._lessonId;
    }

    set lessonId(value) {
        this._lessonId = value;
    }
}
