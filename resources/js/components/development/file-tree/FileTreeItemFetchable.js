const fileTreeItemFetchable = {
    methods: {
        buildFileTree(lessonId, root) {
            axios.get('/folders/fetch?' + "lesson_id=" + lessonId).then(response => {
                const fileTreeBuilder = function (current, items) {
                    const children = items.filter(item => item.parentFolderId === current.id);
                    current.children = children.map(item => {
                        return {
                            id: item.id,
                            name: item.name,
                            parentFolderId: current.id,
                            children: [],
                        }
                    });
                    children.forEach(child => {
                        delete items[items.indexOf(child)];
                    });
                    if (items.length) {
                        current.children.forEach(child => {
                            fileTreeBuilder(child, items);
                        });
                    }
                };
                const itemPropertyMapper = function (data, key) {
                    return {
                        id: data[key].id,
                        name: data[key].name,
                        parentFolderId: data[key].parent_folder_id,
                    }
                };
                fileTreeBuilder(
                    root,
                    Object.keys(response.data).map(key => itemPropertyMapper(response.data, key))
                );
            }).catch((error) => {
                console.log(error);
            });
        }
    }
}

export default fileTreeItemFetchable;