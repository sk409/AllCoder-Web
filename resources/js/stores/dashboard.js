const store = new Vuex.Store({
    state: {
        message: null,
    },
    mutations: {
        setMessage(state, message) {
            state.message = message;
        }
    }
})

export default store;
