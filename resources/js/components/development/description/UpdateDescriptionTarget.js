export function updateDescriptionTarget(id, startIndex, endIndex, descriptionId) {
    axios.put("/description_targets/" + id, {
        start_index: startIndex,
        end_index: endIndex,
        description_id: descriptionId
    }).then(response => {
        //console.log(response.data);
    });
};