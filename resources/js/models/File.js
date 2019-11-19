import Model from "./model.js";

export default class File extends Model {
    static baseRoute() {
        return "files";
    }

    static index(parameters, completion) {
        return Model.index(File.baseRoute(), parameters, completion);
    }

    constructor(path, text, dockerContainerId) {
        super(File.baseRoute());
        this.path = path;
        this.text = text;
        this.dockerContainerId = dockerContainerId;
        // this.isNameEditable = false;
    }

    parameters() {
        return {
            path: this.path,
            text: this.text,
            docker_container_id: this.dockerContainerId
        };
    }

    findBySuffix(suffix) {
        return this.path.endsWith(suffix);
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

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }

    get dockerContainerId() {
        return this._dockerContainerId;
    }

    set dockerContainerId(value) {
        this._dockerContainerId = value;
    }

    // get isNameEditable() {
    //     return this._isNameEditable;
    // }

    // set isNameEditable(value) {
    //     this._isNameEditable = value;
    // }
}
