const todoService = require('../services/todo.service');

const todoController = {}

todoController.create = async (req, res) => {
    try {
        console.log('Create Todo endpoint hit | todoService.create');
        const response = await todoService.create(req.body, req.user.id);
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

todoController.list = async (req, res) => {
    try {
        console.log('List Todo endpoint hit | todoService.list');
        const response = await todoService.list(req.query, req.user.id);
        console.log(`List Todo: Found ${response.length} items for user ${req.user.id}`);
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
todoController.update = async (req, res) => {
    try {
        console.log('Update Todo endpoint hit | todoService.update');
        console.log('Req body:', req.body);

        const response = await todoService.update(req.params.id, req.body);
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
todoController.delete = async (req, res) => {
    try {

        console.log('Delete Todo endpoint hit | todoService.delete');
        const { action } = req.query; // 'bin', 'restore', 'permanent'
        const response = await todoService.delete(req.params.id, action);
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

todoController.addLabelToTodo = async (req, res) => {
    try {
        console.log('Add Label to Todo endpoint hit | todoService.addLabelToTodo');
        const { labelId } = req.body;
        const response = await todoService.addLabelToTodo(req.params.id, labelId, req.user.id);
        return res.status(200).send({
            message: "Add Label to Todo operation successful!",
            data: response,
            success: true
        });
    } catch (error) {
        console.log('Error in addLabelToTodo', error);
        return res.status(400).send({
            message: "Add Label to Todo operation failed!",
            // error: error.message,
            error: error.message,
            success: false
        }
        );
    }
}

todoController.removeLabelFromTodo = async (req, res) => {
    try {
        console.log('Remove Label from Todo endpoint hit | todoService.removeLabelFromTodo');
        const { labelId } = req.body;
        const response = await todoService.removeLabelFromTodo(req.params.id, labelId, req.user.id);
        return res.status(200).send({
            message: "Remove Label from Todo operation successful!",
            data: response,
            success: true
        });
    } catch (error) {
        console.log('Error in removeLabelFromTodo', error);
        return res.status(400).send({
            message: "Remove Label from Todo operation failed!",
            error: error.message,
            success: false
        }
        );
    }
}

todoController.filterTodosByLabel = async (req, res) => {
    try {
        console.log('Filter Todos by Label endpoint hit | todoService.filterTodosByLabel');
        const response = await todoService.filterTodosByLabel(req.params.id, req.user.id);
        return res.status(200).send({
            message: "Filter Todos by Label operation successful!",
            data: response,
            success: true
        });
    } catch (error) {
        console.log('Error in filterTodosByLabel', error);
        return res.status(400).send({
            message: "Filter Todos by Label operation failed!",
            error: error.message,
            success: false
        }
        );
    }
}

module.exports = todoController;