import Model from "./model.js";

export default class Lesson extends Model {
    static baseRoute() {
        return "lessons";
    }

    static index(parameters, completion) {
        return Model.index(Lesson.baseRoute(), parameters, completion);
    }

    constructor(id, title, descriptions, book) {
        super(Lesson.baseRoute());
        this.id = id;
        this.title = title;
        this.descriptions = descriptions;
        this.book = book;
    }

    parameters() {
        return {
            id: this.id,
            title: this.title,
            descriptions: this.descriptions,
            book: this.book
        };
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get book() {
        return this._book;
    }

    set book(value) {
        this._book = value;
    }


}
