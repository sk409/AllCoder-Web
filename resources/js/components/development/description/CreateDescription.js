
function createDescription(id, index, text, fileId) {
    return {
        id,
        index,
        text,
        file_id: fileId
    }
}

export default createDescription;