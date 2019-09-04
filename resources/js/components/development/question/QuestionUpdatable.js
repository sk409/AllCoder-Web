const questionUpdatable = {
    methods: {
        updateQuestion(id, parameters) {
            // console.log(id);
            // console.log(parameters);
            //console.log("will Update");
            axios.put("/questions/" + id, parameters).then(response => {
                //console.log(response);
                //console.log("Updated");
            });
        },
    },
};

export default questionUpdatable;