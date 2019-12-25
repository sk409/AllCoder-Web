import Model from "./model.js";

export default class InvitationRequest extends Model {
    static baseRoute() {
        return "invitation_requests";
    }

    static index(parameters, completion) {
        return Model.index(InvitationRequest.baseRoute(), parameters, completion);
    }

    constructor(senderUserId, receiverUserId, chatRoomId) {
        super(InvitationRequest.baseRoute());
        this.senderUserId = senderUserId;
        this.receiverUserId = receiverUserId;
        this.chatRoomId = chatRoomId;
    }

    parameters() {
        return {
            "sender_user_id": this.senderUserId,
            "receiver_user_id": this.receiverUserId,
            "chat_room_id": this.chatRoomId
        }
    }
}
