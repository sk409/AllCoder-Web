const questionAddable = {
    methods: {
        addQuestion(startIndex, endIndex, fileId, completion) {
            axios.post("/questions", {
                start_index: startIndex,
                end_index: endIndex,
                file_id: fileId,
            }).then(response => {
                completion(response.data);
            });
        },
    },
};

export default questionAddable;