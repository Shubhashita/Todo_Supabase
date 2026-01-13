const labelRepo = require("../repositories/label.repo");
const todoRepo = require("../repositories/todo.repo");

const labelService = {}

labelService.createLabel = async (data, userId) => {
    try {
        const savedLabel = await labelRepo.createLabel(data, userId);
        return savedLabel;
    } catch (error) {
        // Handle duplicate key error (E11000)
        if (error.code === 11000) {
            // Check if label exists but is deleted
            const existingLabel = await labelRepo.findOneWithDeleted(data.name, userId);
            if (existingLabel && existingLabel.isDeleted) {
                // Reactivate it
                return await labelRepo.updateLabel(existingLabel._id, userId, { isDeleted: false });
            }
            throw new Error("Label already exists");
        }
        console.log("error in create", error);
        throw error;
    }
}

labelService.listLabels = async (userId) => {
    try {
        const labels = await labelRepo.listLabels(userId);
        return labels;
    } catch (error) {
        console.log("error in list", error);
        throw error;
    }
}

labelService.updateLabel = async (id, userId, data) => {
    try {
        const updatedLabel = await labelRepo.updateLabel(id, userId, data);
        return updatedLabel;
    } catch (error) {
        console.log("error in update", error);
        throw error;
    }
}

labelService.deleteLabel = async (id, userId) => {
    try {
        // Remove this label from all associated notes (Unlabel them)
        await todoRepo.removeLabelFromTodos(id, userId);

        const deletedLabel = await labelRepo.deleteLabel(id, userId);
        return deletedLabel;
    } catch (error) {
        console.log("error in delete", error);
        throw error;
    }
}



module.exports = labelService;