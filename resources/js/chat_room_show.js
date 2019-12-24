import ChatMessage from "./models/chat_message.js";
import User from "./models/user.js";

new Vue({
    el: "#chat-room-show",
    data: {
        text: "",
        user: null,
        room: null,
        messages: [],
    },
    mounted() {
        this.user = JSON.parse(document.getElementById("__user").textContent);
        this.room = JSON.parse(document.getElementById("__room").textContent);
        this.messages = JSON.parse(document.getElementById("__messages").textContent);
        const users = JSON.parse(document.getElementById("__users").textContent);
        users.forEach((user, index) => {
            this.messages[index].user = user;
        });
        window.Echo.channel("home").listen("NewChatMessage", e => {
            console.log(this.user);
            const message = e.chatMessage;
            if (message.user_id === this.user.id) {
                return;
            }
            User.index({
                "id": message.user_id
            }, response => {
                message.user = response.data[0];
                this.messages.push(message);
            });
        });
    },
    watch: {
        messages() {
            this.$nextTick(() => {
                this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
            });
        }
    },
    methods: {
        isIncomingMessage(message) {
            return message.user.id !== this.user.id;
        },
        growMessageBox(e) {
            if (!e.isComposing) {
                const messageBox = this.$refs.messageBox;
                ++messageBox.rows;
                if (messageBox.selectionStart !== messageBox.selectionEnd) {
                    const selectedText = this.text.substring(
                        messageBox.selectionStart,
                        messageBox.selectionEnd
                    );
                    messageBox.rows -= this.count(selectedText, "\n");
                }
            }
        },
        shrinkMessageBox(e) {
            const messageBox = this.$refs.messageBox;
            if (messageBox.selectionStart === messageBox.selectionEnd) {
                const c = this.text[messageBox.selectionStart - 1];
                if (c === "\n") {
                    --messageBox.rows;
                }
            } else {
                const selectedText = this.text.substring(
                    messageBox.selectionStart,
                    messageBox.selectionEnd
                );
                messageBox.rows -= this.count(selectedText, "\n");
            }
        },
        submitMessage(userId, chatRoomId) {
            const chatMessage = new ChatMessage(this.text, userId, chatRoomId);
            chatMessage.user = this.user;
            chatMessage.store(response => {
                this.messages.push(chatMessage);
                this.text = "";
            });
        }
    }
});
