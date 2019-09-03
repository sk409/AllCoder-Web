import create from "./CreateDescription.js";

const descriptionCreatable = {
    methods: {
        createDescription(index, text, fileId, completion) {
            console.log(index);
            console.log(text);
            console.log(fileId);
            axios.post("/descriptions", {
                index,
                text,
                file_id: fileId,
            }).then(response => {
                const id = response.data;
                const description = create(id, index, text, fileId);
                completion(description);
            });
        }
    }
};

export default descriptionCreatable;