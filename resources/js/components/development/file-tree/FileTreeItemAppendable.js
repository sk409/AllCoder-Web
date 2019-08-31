function isUniqueFolderName(children, itemName) {
    return children.filter(child => child.name === itemName).length === 0
}

function appendFileTreeItem(children, itemName, url, queryParameters, completion) {
    if (!isUniqueFolderName(children, itemName)) {
        let suffix = 2;
        while (!isUniqueFolderName(children, itemName + suffix)) {
            ++suffix;
        }
        itemName += suffix;
    }
    queryParameters.name = itemName;
    axios.post(url, queryParameters).then(response => {
        const id = response.data;
        completion(id, itemName);
    });
}

const fileTreeItemAppendable = {
    methods: {
        appendFolder(lessonId, parentFolderId, children) {
            const queryParameters = {
                parent_folder_id: parentFolderId === null ? "" : parentFolderId,
                lesson_id: lessonId
            };
            const completion = function (id, name) {
                children.push({
                    id: id,
                    name: name,
                    parentFolderId: parentFolderId,
                    children: [],
                });
            };
            appendFileTreeItem(
                children,
                "New Folder",
                "/folders",
                queryParameters,
                completion
            );
        }
    }
}

export default fileTreeItemAppendable;