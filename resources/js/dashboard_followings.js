import User from "./models/user.js";

new Vue({
    el: "#dashboard",
    data: {
        userSearchDialog: {
            isVisible: false,
            username: "",
            users: [],
        }
    },
    methods: {
        transition(url) {
            location.href = url;
        },
        showUserSearchDialog() {
            this.userSearchDialog.isVisible = true;
        },
        searchUser() {
            User.index({
                name: this.userSearchDialog.username
            }, response => {
                this.userSearchDialog.users = response.data;
            });
        }
    }
})
