import ChatMessage from "./models/chat_message.js";

new Vue({
    el: "#chat-room-show",
    data: {
        message: ""
    },
    methods: {
        growMessageBox(e) {
            if (!e.isComposing) {
                const messageBox = this.$refs.messageBox;
                ++messageBox.rows;
                if (messageBox.selectionStart !== messageBox.selectionEnd) {
                    const selectedText = this.message.substring(messageBox.selectionStart, messageBox.selectionEnd);
                    messageBox.rows -= this.count(selectedText, "\n");
                }
            }
        },
        shrinkMessageBox(e) {
            const messageBox = this.$refs.messageBox;
            if (messageBox.selectionStart === messageBox.selectionEnd) {
                const c = this.message[messageBox.selectionStart - 1];
                if (c === "\n") {
                    --messageBox.rows;
                }
            } else {
                const selectedText = this.message.substring(messageBox.selectionStart, messageBox.selectionEnd);
                console.log(this.count(selectedText, "\n"))
                messageBox.rows -= this.count(selectedText, "\n");
            }
        },
        submitMessage(userId, chatRoomId) {
            const chatMessage = new ChatMessage(this.message, userId, chatRoomId);
            chatMessage.store(response => {
                console.log(response);
            });
        }
    }
})
