import Model from "./model.js";

export default class ChatMessage extends Model {
    static baseRoute() {
        return "chat_messages";
    }

    static index(parameters, completion) {
        return Model.index(ChatMessage.baseRoute(), parameters, completion);
    }

    constructor(text, userId, chatRoomId) {
        super(ChatMessage.baseRoute());
        this.text = text;
        this.userId = userId;
        this.chatRoomId = chatRoomId;
    }

    parameters() {
        return {
            text: this.text,
            user_id: this.userId,
            chat_room_id: this.chatRoomId,
        };
    }
}
