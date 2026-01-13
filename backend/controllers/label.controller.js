const labelService = require("../services/label.service");

const labelController = {}

labelController.createLabel = async (req, res) => {
    try {
        console.log('Create Label endpoint hit | labelService.createLabel');
        const response = await labelService.createLabel(req.body, req.user.id);
        return res.status(200).send({
            message: "Create operation successful!",
            data: response,
            success: true
        });
    } catch (error) {
        console.log('Error in create', error);
        return res.status(400).send({
            message: "Create operation failed!",
            error: error.message,
            success: false
        }
        );
    }
}

labelController.listLabels = async (req, res) => {
    try {
        console.log('List Label endpoint hit | labelService.listLabels');
        const response = await labelService.listLabels(req.user.id);
        return res.status(200).send({
            message: "List operation successful!",
            data: response,
            success: true
        });
    } catch (error) {
        console.log('Error in list', error);
        return res.status(400).send({
            message: "List operation failed!",
            error: error.message,
            success: false
        }
        );
    }
}

labelController.updateLabel = async (req, res) => {
    try {
        console.log('Update Label endpoint hit | labelService.updateLabel');
        const response = await labelService.updateLabel(req.params.id, req.user.id, req.body);
        return res.status(200).send({
            message: "Update operation successful!",
            data: response,
            success: true
        });
    } catch (error) {
        console.log('Error in update', error);
        return res.status(400).send({
            message: "Update operation failed!",
            error: error.message,
            success: false
        }
        );
    }
}

labelController.deleteLabel = async (req, res) => {
    try {
        console.log('Delete Label endpoint hit | labelService.deleteLabel');
        const response = await labelService.deleteLabel(req.params.id, req.user.id);
        return res.status(200).send({
            message: "Delete operation successful!",
            data: response,
            success: true
        });
    } catch (error) {
        console.log('Error in delete', error);
        return res.status(400).send({
            message: "Delete operation failed!",
            error: error.message,
            success: false
        }
        );
    }
}

module.exports = labelController;
