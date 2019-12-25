import Axios from "axios";
import InvitationRequest from "./models/invitation_request";
import ChatRoom from "./models/chat_room";

new Vue({
    el: "#dashboard",
    data: {
        invitationRequests: [],
        invitationRequestsDialog: {
            isVisible: false,
        },
        user: null,
    },
    mounted() {
        this.user = JSON.parse(document.getElementById("__user").textContent);
        this.invitationRequests = JSON.parse(document.getElementById("__invitation-requests").textContent);
        const chatRooms = JSON.parse(document.getElementById("__chat-rooms").textContent);
        this.user.chatRooms = chatRooms;
        const usersSentInvitationRequest = JSON.parse(document.getElementById("__users-sent-invitation-request").textContent);
        usersSentInvitationRequest.forEach((userSentInvitationRequest, index) => {
            this.invitationRequests[index].sender = userSentInvitationRequest;
        });
        const invitedRooms = JSON.parse(document.getElementById("__invited-rooms").textContent);
        invitedRooms.forEach((invitedRoom, index) => {
            this.invitationRequests[index].room = invitedRoom;
        });
    },
    methods: {
        transition(url) {
            location.href = url;
        },
        attend(invitationRequestId, chatRoomId) {
            Axios.post("/chat_room_user", {
                "user_id": this.user.id,
                "chat_room_id": chatRoomId
            }).then(response => {
                if (response.status === 200) {
                    this.destoryInvitationRequest(invitationRequestId);
                    ChatRoom.index({
                        "id": chatRoomId
                    }, response => {
                        const chatRoom = new ChatRoom(response.data[0].name);
                        chatRoom.id = response.data[0].id;
                        chatRoom.created_at = response.data[0].created_at;
                        this.user.chatRooms.push(chatRoom);
                    });
                }
            });
        },
        destoryInvitationRequest(invitationRequestId) {
            InvitationRequest.index({
                "id": invitationRequestId
            }, response => {
                const invitationRequest = new InvitationRequest(response.data.sender_user_id, response.data.receiver_user_id, response.data.chat_room_id);
                invitationRequest.id = invitationRequestId;
                invitationRequest.destroy(response => {
                    // console.log(response);
                });
            });
            this.invitationRequests = this.invitationRequests.filter(invitationRequest => invitationRequest.id !== invitationRequestId);
        },
        showInvitationRequestsDialog() {
            this.invitationRequestsDialog.isVisible = true;
        }
    }
})
