new Vue({
    el: "#dashboard",
    data: {
        expandedNames: [],
    },
    methods: {
        transition(url) {
            location.href = url;
        }
    }
})
