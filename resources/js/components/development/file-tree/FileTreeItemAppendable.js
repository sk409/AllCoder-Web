function isUniqueFolderName(children, itemName) {
    return children.filter(child => child.name === itemName).length === 0
}

function appendFileTreeItem(lessonId, parentFolderId, children, itemName, url, isFile) {
    const queryParameters = {
        parent_folder_id: parentFolderId === null ? "" : parentFolderId,
        lesson_id: lessonId
    };
    const completion = function (id, name) {
        const child = {
            isFile: isFile,
            id: id,
            name: name,
            parentFolderId: parentFolderId,
            children: [],
        };
        if (isFile) {
            child.text = "";
        }
        children.push(child);
    };
    if (!isUniqueFolderName(children, itemName)) {
        let suffix = 2;
        while (!isUniqueFolderName(children, itemName + suffix)) {
            ++suffix;
        }
        itemName += suffix;
    }
    queryParameters.name = itemName;
    if (isFile) {
        queryParameters.text = "";
    }
    axios.post(url, queryParameters).then(response => {
        //console.log(response);
        const id = response.data;
        completion(id, itemName);
    });
}

const fileTreeItemAppendable = {
    methods: {
        appendFolder(lessonId, parentFolderId, children) {
            appendFileTreeItem(
                lessonId,
                parentFolderId,
                children,
                "New Folder",
                "/folders",
                false
            );
        },
        appendFile(lessonId, parentFolderId, children, fileName) {
            appendFileTreeItem(
                lessonId,
                parentFolderId,
                children,
                fileName,
                "/files",
                true
            );
        }
    }
}

export default fileTreeItemAppendable;