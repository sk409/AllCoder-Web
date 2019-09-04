export const deleteDescriptionTargets = function(ids) {
    const queryParameters = ids.map((id, index) => "ids[" + index + "]=" + id).join("&");
    axios.delete("/description_targets?" + queryParameters).then(response => {
        //console.log(response.data);
    });
};