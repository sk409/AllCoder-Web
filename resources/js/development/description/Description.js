import Model from "../../models/Model.js";

export default class Description extends Model {
    static baseRoute() {
        return "descriptions";
    }

    static index(parameters, completion) {
        Model.index(Description.baseRoute(), parameters, completion);
    }

    constructor(
        id,
        index,
        text,
        fileId,
        isSelected = false,
        targets = [],
        questions = []
    ) {
        super(Description.baseRoute());
        this.id = id;
        this.index = index;
        this.text = text;
        this.fileId = fileId;
        this.isSelected = isSelected;
        this.targets = targets;
        this.questions = questions;
    }

    parameters() {
        return {
            index: this.index,
            text: this.text,
            file_id: this.fileId
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

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }

    get fileId() {
        return this._fileId;
    }

    set fileId(value) {
        this._fileId = value;
    }

    get isSelected() {
        return this._isSelected;
    }

    set isSelected(value) {
        this._isSelected = value;
    }

    get targets() {
        return this._targets;
    }

    set targets(value) {
        this._targets = value;
    }

    get questions() {
        return this._questions;
    }

    set questions(value) {
        this._questions = value;
    }
}
