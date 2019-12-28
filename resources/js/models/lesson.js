import Model from "./model.js";

export default class Lesson extends Model {
    static baseRoute() {
        return "lessons";
    }

    static index(parameters, completion) {
        return Model.index(Lesson.baseRoute(), parameters, completion);
    }

    constructor(title, description, book, dockerContainerId, userName, consolePort, userId) {
        super(Lesson.baseRoute());
        this.title = title;
        this.description = description;
        this.book = book;
        this.dockerContainerId = dockerContainerId;
        this.userName = userName;
        this.consolePort = consolePort;
        this.userId = userId;
    }

    parameters() {
        return {
            title: this.title,
            description: this.description,
            book: this.book,
            docker_container_id: this.dockerContainerId,
            user_name: this.userName,
            console_port: this.consolePort,
            user_id: this.userId
        };
    }


}
