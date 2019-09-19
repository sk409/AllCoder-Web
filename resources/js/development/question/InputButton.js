import Model from "../../models/Model.js";

export default class InputButton extends Model {
    static baseRoute() {
        return "input_buttons";
    }

    static index(parameters, completion) {
        Model.index(InputButton.baseRoute(), parameters, completion);
    }

    constructor(
        id,
        index,
        startIndex,
        endIndex,
        lineNumber,
        questionId,
        answer
    ) {
        super(InputButton.baseRoute());
        this.id = id;
        this.index = index;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.lineNumber = lineNumber;
        this.questionId = questionId;
        this.answer = answer;
    }

    parameters() {
        return {
            index: this.index,
            start_index: this.startIndex,
            end_index: this.endIndex,
            line_number: this.lineNumber,
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

    get lineNumber() {
        return this._lineNumber;
    }

    set lineNumber(value) {
        this._lineNumber = value;
    }

    get questionId() {
        return this._questionId;
    }

    set questionId(value) {
        this._questionId = value;
    }

    get answer() {
        return this._answer;
    }

    set answer(value) {
        this._answer = value;
    }
}
