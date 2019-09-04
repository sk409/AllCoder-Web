import {createDescriptionTarget} from "./CreateDescriptionTarget.js";

export function postDescriptionTarget(startIndex, endIndex, descriptionId, completion) {
    axios.post("/description_targets", {
        start_index: startIndex,
        end_index: endIndex,
        description_id: descriptionId,
    }).then(response => {
        const id = response.data;
        const descriptionTarget = createDescriptionTarget(id, startIndex, endIndex, descriptionId);
        completion(descriptionTarget);
    });
}