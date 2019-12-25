import Follower from "./models/follower.js";

new Vue({
    el: "#user-show",
    data: {
        activeMaterialIds: []
    },
    methods: {
        follow(e, follower_user_id, following_user_id) {
            const follower = new Follower(follower_user_id, following_user_id);
            follower.store(response => {
                if (response.status === 200) {
                    this.$notify.success({
                        message: "フォローしました",
                        duration: 3000,
                    });
                    e.target.textContent = "フォロー済み";
                    e.target.setAttribute("disabled", "disabled");
                    e.target.classList.add("is-disabled");
                    // e.target.parentNode.setAttribute("disabled", "disabled");
                    // e.target.parentNode.classList.add("is-disabled");
                } else {
                    this.$notify.success({
                        message: "フォローに失敗しました",
                        duration: 3000,
                    });
                }
            })
        }
    }
})
