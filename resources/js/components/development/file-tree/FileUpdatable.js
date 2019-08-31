import Axios from "axios";

const fileTextUpdatable = {
    methods: {
        updateFileText(fileId, fileText) {
            Axios.put("/files/" + fileId, {
                text: fileText
            }).then(response => {
                console.log(response);
            });
        },
    }
}

export default fileTextUpdatable;