export function createDescriptionTarget(id, startIndex, endIndex, descriptionId) {
    return {
        id,
        startIndex,
        endIndex,
        descriptionId,
        hasUpdated: false,
        hasDeleted: false,
    }
}