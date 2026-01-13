const { adminSupabase: supabase } = require('../config/supabase.config');

const todoRepo = {}

todoRepo.createTodo = async (data) => {
    const { labels, userId, ...todoData } = data;

    // 1. Insert Todo
    const { data: todo, error: todoError } = await supabase
        .from('todos')
        .insert([{
            user_id: userId,
            title: todoData.title,
            description: todoData.description,
            status: todoData.status,
            due_date: todoData.dueDate,
            is_pinned: todoData.isPinned,
            is_archived: todoData.isArchived
        }])
        .select()
        .single();

    if (todoError) throw todoError;

    // 2. Insert Labels if any
    if (labels && labels.length > 0) {
        const labelInserts = labels.map(labelId => ({ todo_id: todo.id, label_id: labelId }));
        const { error: labelError } = await supabase.from('todo_labels').insert(labelInserts);
        if (labelError) throw labelError;
    }

    return todo;
}

todoRepo.getTodo = async (id) => {
    const { data: todo, error } = await supabase
        .from('todos')
        .select(`
            *,
            labels:todo_labels(label_id, label:labels(*))
        `)
        .eq('id', id)
        .single();

    if (error) throw error;

    // Map labels to correct format
    if (todo.labels) {
        todo.labels = todo.labels.map(l => l.label);
    }
    return todo;
}

todoRepo.listTodos = async (filter) => {
    let query = supabase
        .from('todos')
        .select(`
            *,
            labels:todo_labels(label_id, label:labels(*))
        `)
        .order('created_at', { ascending: false });

    if (filter.userId) query = query.eq('user_id', filter.userId);
    if (filter.status) query = query.eq('status', filter.status);
    if (filter.isDeleted !== undefined) query = query.eq('is_deleted', filter.isDeleted);
    if (filter.isArchived !== undefined) query = query.eq('is_archived', filter.isArchived);
    if (filter.isPinned !== undefined) query = query.eq('is_pinned', filter.isPinned);

    // Advanced filters
    if (filter.title) query = query.ilike('title', `%${filter.title}%`);
    if (filter.from) query = query.gte('created_at', filter.from);
    if (filter.to) query = query.lte('created_at', filter.to);

    if (filter.labelId) {
        const { data: todoIds } = await supabase.from('todo_labels').select('todo_id').eq('label_id', filter.labelId);
        if (todoIds) {
            query = query.in('id', todoIds.map(t => t.todo_id));
        }
    }

    const { data: todos, error } = await query;
    if (error) throw error;

    return todos.map(todo => ({
        ...todo,
        labels: todo.labels ? todo.labels.map(l => l.label) : []
    }));
}

todoRepo.updateTodo = async (id, data) => {
    const { labels, ...updateData } = data;

    const mappedData = {};
    if (updateData.title !== undefined) mappedData.title = updateData.title;
    if (updateData.description !== undefined) mappedData.description = updateData.description;
    if (updateData.status !== undefined) mappedData.status = updateData.status;
    if (updateData.dueDate !== undefined) mappedData.due_date = updateData.dueDate;
    if (updateData.isPinned !== undefined) mappedData.is_pinned = updateData.isPinned;
    if (updateData.isArchived !== undefined) mappedData.is_archived = updateData.isArchived;
    if (updateData.isDeleted !== undefined) mappedData.is_deleted = updateData.isDeleted;

    const { data: todo, error } = await supabase
        .from('todos')
        .update(mappedData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    // Handle labels update if provided
    if (labels) {
        await supabase.from('todo_labels').delete().eq('todo_id', id);
        if (labels.length > 0) {
            const labelInserts = labels.map(labelId => ({ todo_id: id, label_id: labelId }));
            await supabase.from('todo_labels').insert(labelInserts);
        }
    }

    return todo;
}

todoRepo.deleteTodo = async (id) => {
    const { data, error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return data;
}

todoRepo.addLabelToTodo = async (todoId, labelId) => {
    const { data, error } = await supabase
        .from('todo_labels')
        .insert([{ todo_id: todoId, label_id: labelId }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

todoRepo.removeLabelFromTodo = async (todoId, labelId) => {
    const { data, error } = await supabase
        .from('todo_labels')
        .delete()
        .eq('todo_id', todoId)
        .eq('label_id', labelId);

    if (error) throw error;
    return data;
}

todoRepo.filterTodosByLabel = async (labelId, userId) => {
    const { data: todoIds, error: joinError } = await supabase
        .from('todo_labels')
        .select('todo_id')
        .eq('label_id', labelId);

    if (joinError) throw joinError;

    const ids = todoIds.map(t => t.todo_id);
    if (ids.length === 0) return [];

    const { data: todos, error } = await supabase
        .from('todos')
        .select(`
            *,
            labels:todo_labels(label_id, label:labels(*))
        `)
        .in('id', ids)
        .eq('user_id', userId)
        .eq('is_deleted', false);

    if (error) throw error;

    return todos.map(todo => ({
        ...todo,
        labels: todo.labels ? todo.labels.map(l => l.label) : []
    }));
}

todoRepo.trashTodosByLabel = async (labelId, userId) => {
    const { data: todoIds, error: joinError } = await supabase
        .from('todo_labels')
        .select('todo_id')
        .eq('label_id', labelId);

    if (joinError) throw joinError;

    const ids = todoIds.map(t => t.todo_id);
    if (ids.length === 0) return { matchedCount: 0, modifiedCount: 0 };

    const { data, error } = await supabase
        .from('todos')
        .update({ status: 'bin' })
        .in('id', ids)
        .eq('user_id', userId);

    if (error) throw error;
    return data;
}

todoRepo.removeLabelFromTodos = async (labelId, userId) => {
    const { data: todoIds, error: joinError } = await supabase
        .from('todos')
        .select('id')
        .eq('user_id', userId);

    if (joinError) throw joinError;
    const ids = todoIds.map(t => t.id);

    const { data, error } = await supabase
        .from('todo_labels')
        .delete()
        .eq('label_id', labelId)
        .in('todo_id', ids);

    if (error) throw error;
    return data;
}

module.exports = todoRepo;