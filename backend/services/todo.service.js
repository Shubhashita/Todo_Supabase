const todoService = {}
const todoRepo = require('../repositories/todo.repo');
const labelRepo = require('../repositories/label.repo');

todoService.create = async (data = {}, userId) => {
    try {
        // Parse JSON strings if they come from FormData
        if (typeof data.labels === 'string') {
            try { data.labels = JSON.parse(data.labels); } catch (e) { data.labels = []; }
        }
        if (typeof data.description === 'string' && data.description.startsWith('[')) {
            try { data.description = JSON.parse(data.description); } catch (e) { /* keep as string if not JSON */ }
        }

        // Normalize booleans from FormData
        if (data.isPinned === 'true') data.isPinned = true;
        if (data.isPinned === 'false') data.isPinned = false;
        if (data.isArchived === 'true') data.isArchived = true;
        if (data.isArchived === 'false') data.isArchived = false;

        // Ensure description is an array (multipart form data can send it as string)
        let description = data.description;
        if (description && typeof description === 'string') {
            description = [description];
        }

        const savedTodo = await todoRepo.createTodo(
            {
                ...data,
                description: description || [],
                userId: userId
            }
        );
        return {
            id: savedTodo.id,
            status: savedTodo.status
        }

    } catch (error) {
        console.log("error in create", error);
        throw error;
    }
}

todoService.list = async (query, userId) => {
    try {
        const { status, title, from, to, label } = query;
        const filter = { userId: userId };

        if (status) {
            filter.status = status;
        }

        if (title) {
            filter.title = title;
        }

        if (from) {
            filter.from = from;
        }
        if (to) {
            filter.to = to;
        }

        if (label) {
            filter.labelId = label;
        }

        // default do not return deleted todos
        filter.isDeleted = false;

        const todoList = await todoRepo.listTodos(filter);
        return todoList;
    } catch (error) {
        console.log("error in list", error);
        throw error;
    }
}

todoService.update = async (id, data = {}) => {
    try {
        // Fetch current todo
        const currentTodo = await todoRepo.getTodo(id);
        if (!currentTodo) throw new Error('Todo not found!');

        // Parse JSON strings if they come from FormData
        if (typeof data.labels === 'string') {
            try { data.labels = JSON.parse(data.labels); } catch (e) { data.labels = []; }
        }
        if (typeof data.description === 'string' && data.description.startsWith('[')) {
            try { data.description = JSON.parse(data.description); } catch (e) { /* keep as string if not JSON */ }
        }

        // Normalize booleans from FormData
        if (data.isPinned === 'true') data.isPinned = true;
        if (data.isPinned === 'false') data.isPinned = false;
        if (data.isArchived === 'true') data.isArchived = true;
        if (data.isArchived === 'false') data.isArchived = false;

        // Ensure description is an array
        let description = data.description;
        if (description && typeof description === 'string') {
            description = [description];
        }

        const updateData = { ...data };

        const updatedTodo = await todoRepo.updateTodo(id, {
            ...updateData,
            description: description !== undefined ? description : currentTodo.description
        });

        if (!updatedTodo) {
            throw new Error('Todo not found!');
        }

        // Return full updated object
        return updatedTodo;


    } catch (error) {
        console.error("Error in update:", error);
        throw error;
    }
}

todoService.delete = async (id, action = 'bin') => {
    try {
        // 1️⃣ Fetch the todo first
        const todo = await todoRepo.getTodo(id);
        if (!todo) {
            throw new Error('Todo not found!');
        }

        // 2️⃣ Handle actions
        if (action === 'bin') {
            if (todo.status === 'bin') {
                // already in bin → permanently delete
                await todoRepo.deleteTodo(id);
                return { message: 'Todo permanently deleted' };
            } else {
                // move to bin
                const updatedTodo = await todoRepo.updateTodo(id, { status: 'bin' });
                return { message: 'Todo moved to bin', id: updatedTodo.id, status: updatedTodo.status };
            }
        } else if (action === 'restore') {
            if (todo.status !== 'bin') {
                throw new Error('Only todos in bin can be restored!');
            }
            const restoredTodo = await todoRepo.updateTodo(id, { status: 'open' });
            return { message: 'Todo restored from bin', id: restoredTodo.id, status: restoredTodo.status };
        } else if (action === 'permanent') {
            if (todo.status !== 'bin') {
                throw new Error('Todo not in bin!');
            }
            await todoRepo.deleteTodo(id);
            return { message: 'Todo permanently deleted' };
        } else {
            throw new Error('Invalid action specified!');
        }

    } catch (error) {
        console.log("error in delete", error);
        throw error;
    }
};

todoService.addLabelToTodo = async (todoId, labelId, userId) => {
    try {
        const todo = await todoRepo.getTodo(todoId);
        if (!todo) {
            throw new Error('Todo not found!');
        }
        const label = await labelRepo.getLabel(labelId, userId);
        if (!label) {
            throw new Error('Label not found!');
        }
        await todoRepo.addLabelToTodo(todoId, labelId);
        // Re-fetch todo to get updated labels
        const updatedNote = await todoRepo.getTodo(todoId);
        return {
            id: updatedNote.id,
            labels: updatedNote.labels
        };
    } catch (error) {
        console.log("error in addLabelToTodo", error);
        throw error;
    }
};

todoService.removeLabelFromTodo = async (todoId, labelId, userId) => {
    try {
        const todo = await todoRepo.getTodo(todoId);
        if (!todo) {
            throw new Error('Todo not found!');
        }
        const label = await labelRepo.getLabel(labelId, userId);
        if (!label) {
            throw new Error('Label not found!');
        }
        await todoRepo.removeLabelFromTodo(todoId, labelId);
        const updatedNote = await todoRepo.getTodo(todoId);
        return {
            id: updatedNote.id,
            labels: updatedNote.labels
        };
    } catch (error) {
        console.log("error in removeLabelFromTodo", error);
        throw error;
    }
};

todoService.filterTodosByLabel = async (labelId, userId) => {
    try {
        const todos = await todoRepo.filterTodosByLabel(labelId, userId);
        return todos;
    } catch (error) {
        console.log("error in filterTodosByLabel", error);
        throw error;
    }
};


module.exports = todoService;
