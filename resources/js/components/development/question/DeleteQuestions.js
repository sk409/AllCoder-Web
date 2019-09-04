export const deleteQuestions = function(ids) {
    const queryString = ids.map((id, index) => "ids[" + index + "]=" + id).join("&");
    axios.delete("/questions?" + queryString).then(response => {
        //console.log(response.data);
    });
}