import ChatMessage from "./models/chat_message.js";
import InvitationRequest from "./models/invitation_request.js";
import User from "./models/user.js";
import Axios from "axios";

new Vue({
    el: "#chat-room-show",
    data: {
        appendingMaterialLinkDialog: {
            isVisible: false,
            material: null,
            lesson: null,
            filePath: "",
            step: 1
        },
        invitationDialog: {
            isVisible: false,
        },
        messageComposer: {
            menu: {
                isVisible: false,
            }
        },
        messages: [],
        room: null,
        text: "",
        user: null,
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
                if (!this.$refs.messages) {
                    return;
                }
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
                this.$refs.messageBox.rows = 1;
            });
        },
        parseText(text, user) {
            const regex = /@{([0-9]+):([0-9]+):(.+)}/g
            let match = regex.exec(text);
            while (match) {
                text = `<pre>${text.substring(0, match.index)}</pre>` + `<a href="/development/learning?user_id=${user.id}&material_id=${match[1]}&lesson_id=${match[2]}&file_path=${match[3]}" target="_blank">OK</a>` + `<pre>${text.substring(match.index + match[0].length)}</pre>`;
                match = regex.exec(text);
            }
            return text;
        },
        invite(e, receiverUserId) {
            const invitationRequest = new InvitationRequest(this.user.id, receiverUserId, this.room.id);
            invitationRequest.store(response => {
                if (response.status === 200) {
                    this.$notify.success({
                        message: "招待しました",
                        duration: 3000,
                    });
                    e.target.textContent = "招待済み";
                    e.target.setAttribute("disabled", "disabled");
                    e.target.classList.add("is-disabled");
                } else {
                    this.$notify.error({
                        message: "招待に失敗しました",
                        duration: 3000,
                    });
                }
            })
        },
        selectMaterial(material) {
            Axios.get("/lesson_material?material_id=" + material.id).then(response => {
                material.lessons = response.data;
                this.appendingMaterialLinkDialog.material = material;
                this.appendingMaterialLinkDialog.step = 2;
            });
        },
        selectLesson(lesson) {
            this.appendingMaterialLinkDialog.lesson = lesson;
            this.appendingMaterialLinkDialog.step = 3;
        },
        appendMaterialLink() {
            this.text += `@{${this.appendingMaterialLinkDialog.material.id}:${this.appendingMaterialLinkDialog.lesson.id}:${this.appendingMaterialLinkDialog.filePath}}`;
            this.appendingMaterialLinkDialog.material = null;
            this.appendingMaterialLinkDialog.lesson = null;
            this.appendingMaterialLinkDialog.filePath = "";
            this.appendingMaterialLinkDialog.step = 1;
            this.appendingMaterialLinkDialog.isVisible = false;
        },
        closeAppendingMaterialLinkDialog() {
            this.messageComposer.menu.isVisible = false;
        },
        showAppendingMaterialLinkDialog() {
            this.appendingMaterialLinkDialog.isVisible = true;
        },
        showInvitationDialog() {
            this.invitationDialog.isVisible = true;
        },
        toggleMessageComposerMenu() {
            this.messageComposer.menu.isVisible = !this.messageComposer.menu.isVisible;
        }
    }
});
