import Model from "../../models/Model.js";

export default class InputButton extends Model {
    static baseRoute() {
        return "input_buttons";
    }

    static index(parameters, completion) {
        Model.index(InputButton.baseRoute(), parameters, completion);
    }

    constructor(id, index, startIndex, endIndex, questionId) {
        super(InputButton.baseRoute());
        this.id = id;
        this.index = index;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.questionId = questionId;
    }

    parameters() {
        return {
            index: this.index,
            start_index: this.startIndex,
            end_index: this.endIndex,
            question_id: this.questionId
        };
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get index() {
        return this._index;
    }

    set index(value) {
        this._index = value;
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

    get questionId() {
        return this._questionId;
    }

    set questionId(value) {
        this._questionId = value;
    }
}
