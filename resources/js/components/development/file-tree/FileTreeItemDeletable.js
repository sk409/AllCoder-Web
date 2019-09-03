const fileTreeItemDeletable = {
    methods: {
        deleteFolder(id) {
            axios.delete("/folders/" + id).then(response => {

            });
        },
        deleteFile(id) {
            axios.delete("/files/" + id).then(response => {

            });
        }
    }
};

export default fileTreeItemDeletable;