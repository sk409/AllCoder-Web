import Model from "./model.js";

export default class Folder extends Model {
    static baseRoute() {
        return "folders";
    }

    static index(parameters, completion) {
        return Model.index(Folder.baseRoute(), parameters, completion);
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

    findBySuffix(suffix) {
        console.log("PATH: " + this.path);
        console.log("SUFFIX: " + suffix);
        // if (this.path.endsWith(suffix)) {
        //     return this;
        // }
        // for (let index = 0; index < this.children.length; ++index) {
        //     const result = this.children[index].findBySuffix(suffix);
        //     if (result) {
        //         return result;
        //     }
        // }
        // return null;
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
