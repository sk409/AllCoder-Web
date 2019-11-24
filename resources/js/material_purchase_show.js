import LessonDetailsCard from "./components/atoms/LessonDetailsCard.vue"

new Vue({
    el: "#material-purchase-show",
    components: {
        LessonDetailsCard
    },
    data: {
        loading: false,
    },
    methods: {
        onClickPurchaseButton(url, userId) {
            this.loading = true;
            const that = this;
            axios.post(url, {
                user_id: userId,
            }).then(response => {
                console.log(response);
                that.loading = false;
                if (response.status === 200) {
                    that.$notify({
                        message: "購入に成功しました",
                        type: "success",
                        duration: 0
                    })
                } else {
                    that.$notify.error({
                        message: "購入に失敗しました",
                        duration: 1500
                    })
                }
            })
        }
    }
})
