import {createDescriptionTarget} from "./CreateDescriptionTarget.js";

export function fetchDescriptionTargets(descriptionId, completion) {
    axios.get("/description_targets/fetch?description_id=" + descriptionId).then(response => {
        const descriptionTargets = response.data.map(descriptionTarget => {
            return createDescriptionTarget(descriptionTarget.id, descriptionTarget.start_index, descriptionTarget.end_index, descriptionId);
        });
        completion(descriptionTargets);
    });
}