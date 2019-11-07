new Vue({
    el: "#welcome",
    methods: {
        clickedPopularMaterial(href) {
            location.href = href;
        }
    }
})
