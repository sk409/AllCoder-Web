import Axios from "axios";

class URI {
    constructor(baseRoute) {
        this.baseRoute = baseRoute;
    }

    index(parameters) {
        const names = Object.keys(parameters);
        return (
            "/" +
            this.baseRoute +
            "?" +
            names.map(name => name + "=" + parameters[name]).join("&")
        );
    }

    store() {
        return "/" + this.baseRoute;
    }

    create() {
        return "/" + this.baseRoute + "/create";
    }

    destroy(id) {
        return "/" + this.baseRoute + "/" + id;
    }

    update(id) {
        return "/" + this.baseRoute + "/" + id;
    }

    show(id) {
        return "/" + this.baseRoute + "/" + id;
    }

    edit(id) {
        return "/" + this.baseRoute + "/" + id + "edit";
    }
}

export default class Model {
    static uri(baseRoute) {
        return new URI(baseRoute);
    }

    static index(baseRoute, parameters, completion) {
        Axios.get(Model.uri(baseRoute).index(parameters)).then(response => {
            Model.handleResponse(response, completion);
        });
    }

    static handleResponse(response, completion) {
        if (!completion) {
            return;
        }
        completion(response);
    }

    constructor(baseRoute) {
        this.baseRoute = baseRoute;
    }

    store(completion) {
        const that = this;
        Axios.post(this.uri.store(), this.parameters()).then(response => {
            that.id = response.data;
            Model.handleResponse(response, completion);
        });
    }

    destroy(completion) {
        Axios.delete(this.uri.destroy(this.id)).then(response => {
            Model.handleResponse(response, completion);
        });
    }

    update(completion) {
        Axios.put(this.uri.update(this.id), this.parameters()).then(
            response => {
                Model.handleResponse(response, completion);
            }
        );
    }

    get baseRoute() {
        return this._baseRoute;
    }

    set baseRoute(value) {
        this._baseRoute = value;
        this._uri = Model.uri(value);
    }

    get uri() {
        return this._uri;
    }
}
