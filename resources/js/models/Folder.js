import Model from "./Model.js";

export default class Folder extends Model {
    static baseRoute() {
        return "folders";
    }

    static index(parameters, completion) {
        Model.index(Folder.baseRoute(), parameters, completion);
    }

    constructor(path) {
        super(Folder.baseRoute());
        this.path = path;
        this.children = [];
        this.isNameEditable = false;
    }

    parameters() {
        return {
            path: this.path
        };
    }

    get name() {
        return this._name;
    }

    get path() {
        return this._path;
    }

    set path(value) {
        this._path = value;
        this._name = value.split("/").slice(-1)[0];
    }

    get children() {
        return this._children;
    }

    set children(value) {
        this._children = value;
    }

    get isNameEditable() {
        return this._isNameEditable;
    }

    set isNameEditable(value) {
        this._isNameEditable = value;
    }
}
