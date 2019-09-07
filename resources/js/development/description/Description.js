import Model from "../../models/Model.js";

export default class Description extends Model {
    static baseRoute() {
        return "descriptions";
    }

    static index(parameters, completion) {
        Model.index(Description.baseRoute(), parameters, completion);
    }

    constructor(id, index, text, fileId) {
        super(Description.baseRoute());
        this.id = id;
        this.index = index;
        this.text = text;
        this.fileId = fileId;
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
}
