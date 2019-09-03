import createDescription from "./CreateDescription.js";

const descriptionFetchable = {
    methods: {
        fetchDescriptions(fileId, completion) {
            axios.get("/descriptions/fetch?file_id=" + fileId).then(response => {
                const descriptions = response.data.map(description => createDescription(
                    description.id,
                    description.index,
                    description.text,
                    description.file_id
                ));
                completion(descriptions);
            });
        }
    }
};

export default descriptionFetchable;