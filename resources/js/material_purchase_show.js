import StarRatings from "./components/atoms/StarRatings.vue"

new Vue({
    el: "#material-purchase-show",
    components: {
        StarRatings
    },
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
