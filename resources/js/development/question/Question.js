import Model from "../../Model.js";

export default class Question extends Model {
    static baseRoute() {
        return "questions";
    }

    static index(parameters, completion) {
        Model.index(Question.baseRoute(), parameters, completion);
    }

    constructor(id, startIndex, endIndex, fileId, answer) {
        super(Question.baseRoute());
        this.id = id;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.fileId = fileId;
        this.answer = answer;
        this.hasUpdated = false;
        this.hasDeleted = false;
    }

    parameters() {
        return {
            start_index: this.startIndex,
            end_index: this.endIndex,
            file_id: this.fileId
        };
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
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

    get fileId() {
        return this._fileId;
    }

    set fileId(value) {
        this._fileId = value;
    }

    get answer() {
        return this._answer;
    }

    set answer(value) {
        this._answer = value;
    }

    get hasUpdated() {
        return this._hasUpdated;
    }

    set hasUpdated(value) {
        this._hasUpdated = value;
    }

    get hasDeleted() {
        return this._hasDeleted;
    }

    set hasDeleted(value) {
        this._hasDeleted = value;
    }
}
