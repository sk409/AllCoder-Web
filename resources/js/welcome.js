import StarRatings from "./components/atoms/StarRatings.vue"

new Vue({
    el: "#welcome",
    components: {
        StarRatings
    },
    methods: {
        clickedPopularMaterial(href) {
            location.href = href;
        }
    }
})
