import Model from "./Model.js";

export default class Folder extends Model {
    static baseRoute() {
        return "folders";
    }

    static index(parameters, completion) {
        Model.index(Folder.baseRoute(), parameters, completion);
    }

    constructor(id, name, parent, lessonId) {
        super(Folder.baseRoute());
        this.id = id;
        this.name = name;
        this.parent = parent;
        this.lessonId = lessonId;
        this.children = [];
    }

    parameters() {
        return {
            name: this.name,
            parent_folder_id: this.parent ? this.parent.id : null,
            lesson_id: this.lessonId
        };
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get parent() {
        return this._parent;
    }

    set parent(value) {
        this._parent = value;
    }

    get lessonId() {
        return this._lessonId;
    }

    set lessonId(value) {
        this._lessonId = value;
    }

    get children() {
        return this._children;
    }

    set children(value) {
        this._children = value;
    }
}
