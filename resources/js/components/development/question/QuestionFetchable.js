const questionFetchable = {
    methods: {
        fetchQuestions(fileId, completion) {
            axios.get("/questions/fetch?file_id=" + fileId).then(response => {
                completion(response);
            });
        }
    },
};

export default questionFetchable;