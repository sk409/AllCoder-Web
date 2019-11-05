new Vue({
    el: "#material-purchase-show",
    methods: {
        onClickPurchaseButton(url, userId) {
            axios.post(url, {
                user_id: userId,
            }).then(response => {
                console.log(response);
            })
        }
    }
})
