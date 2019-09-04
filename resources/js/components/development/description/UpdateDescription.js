export function updateDescription(id, index, text, fileId) {
    console.log(index);
    console.log(text);
    console.log(fileId);
    axios.put("/descriptions/" + id, {
        index,
        text,
        file_id: fileId
    }).then(response => {
        //console.log(response.data);
    });
}