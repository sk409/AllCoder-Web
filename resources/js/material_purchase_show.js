import LessonDetailsCard from "./components/atoms/LessonDetailsCard.vue"

new Vue({
    el: "#material-purchase-show",
    components: {
        LessonDetailsCard
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
