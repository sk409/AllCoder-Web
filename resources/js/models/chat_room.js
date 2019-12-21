import Model from "./model.js";

export default class ChatRoom extends Model {

    static baseRoute() {
        return "chat_rooms";
    }

    static index(parameters, completion) {
        return Model.index(ChatRoom.baseRoute(), parameters, completion);
    }

    constructor(name) {
        super(ChatRoom.baseRoute());
        this.name = name;
    }

    parameters() {
        return {
            name: this.name,
        }
    }

}
