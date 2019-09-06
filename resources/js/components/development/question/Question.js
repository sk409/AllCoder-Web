import Axios from "axios";

/*
TODO: クエリパラメータの名前をキャメルケースに変更
*/

class URI {

    constructor(name) {
        this.name = name;
    }

    /*
        TODO: /無くしてみる
    */

    index(parameters) {
        const names = Object.keys(parameters);
        return "/" + this.name + "?" + names.map(name => name + "=" + parameters[name]).join("&");
    }

    store() {
        return "/" + this.name;
    }

    create() {
        return "/" + this.name + "/create";
    }

    destroy(id) {
        return "/" + this.name + "/" + id;
    }

    update(id) {
        return "/" + this.name + "/" + id;
    }

    show(id) {
        return "/" + this.name + "/" + id;
    }

    edit(id) {
        return "/" + this.name + "/" + id + "edit";
    }

}

export default class Question {

    static uri() {
        return new URI("questions");
    }

    static index(parameters, completion) {
        Axios.get(Question.uri().index(parameters)).then(response => {
            Question.handleResponse(response);
        });
    }

    static handleResponse(completion, response) {
        if (!completion) {
            return;
        }
        completion(response);
    }

    constructor(id, startIndex, endIndex, fileId) {
        this.id = id;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.fileId = fileId;
    }

    store(completion) {
        Axios.post(Question.uri().store(), {
            startIndex,
            endIndex,
            fileId,
        }).then(response => {
            Question.handleResponse(completion);
        });
    }

    destory(completion) {
        Axios.delete(Question.uri().destroy(this.id)).then(response => {
            Question.handleResponse(completion);
        });
    }

    update(completion) {
        Axios.put(Question.uri().update(this.id)).then(response => {
            Question.handleResponse(completion);
        });
    }

}