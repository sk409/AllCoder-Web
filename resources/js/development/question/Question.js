import Model from "../../models/Model.js";

export default class Question extends Model {
    static baseRoute() {
        return "questions";
    }

    static index(parameters, completion) {
        Model.index(Question.baseRoute(), parameters, completion);
    }

    constructor(id, index, descriptionId, inputButtons = []) {
        super(Question.baseRoute());
        this.id = id;
        this.index = index;
        this.descriptionId = descriptionId;
        this.inputButtons = inputButtons;
        this.hasUpdated = false;
        this.hasDeleted = false;
    }

    parameters() {
        return {
            index: this.index,
            description_id: this.descriptionId
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

    get descriptionId() {
        return this._descriptionId;
    }

    set descriptionId(value) {
        this._descriptionId = value;
    }

    get inputButtons() {
        return this._inputButtons;
    }

    set inputButtons(value) {
        this._inputButtons = value;
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
