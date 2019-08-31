const fileTreeItemFetchable = {
    methods: {
        buildFileTree(lessonId, root) {
            axios.get('/folders/fetch?' + "lesson_id=" + lessonId).then(response => {
                const fileTreeBuilder = function (current, items, isFile) {
                    const children = items.filter(item => item.parentFolderId === current.id);
                    current.children.push(...children.map(item => {
                        const child = {
                            isFile: isFile,
                            id: item.id,
                            name: item.name,
                            parentFolderId: current.id,
                            children: [],
                        }
                        if (isFile) {
                            child.text = item.text;
                        }
                        return child;
                    }));
                    children.forEach(child => {
                        delete items[items.indexOf(child)];
                    });
                    if (items.length) {
                        current.children.forEach(child => {
                            fileTreeBuilder(child, items, isFile);
                        });
                    }
                };
                const itemPropertyMapper = function (data, key, isFile) {
                    const mapped = {
                        id: data[key].id,
                        name: data[key].name,
                        parentFolderId: data[key].parent_folder_id,
                    }
                    if (isFile) {
                        mapped.text = data[key].text;
                    }
                    return mapped;
                };
                fileTreeBuilder(
                    root,
                    Object.keys(response.data).map(key => itemPropertyMapper(response.data, key, false)),
                    false
                );
                axios.get("/files/fetch?" + "lesson_id=" + lessonId).then(response=> {
                    fileTreeBuilder(
                        root,
                        Object.keys(response.data).map(key => itemPropertyMapper(response.data, key, true)),
                        true
                    );
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }
}

export default fileTreeItemFetchable;