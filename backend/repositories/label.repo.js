const { adminSupabase: supabase } = require("../config/supabase.config");

const labelRepo = {
    createLabel: async (data, userId) => {
        const { data: label, error } = await supabase
            .from('labels')
            .insert([{ ...data, user_id: userId }])
            .select()
            .single();
        if (error) throw error;
        return label;
    },

    getLabel: async (id, userId) => {
        const { data: label, error } = await supabase
            .from('labels')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .eq('is_deleted', false)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return label;
    },

    listLabels: async (userId) => {
        const { data, error } = await supabase
            .from('labels')
            .select('*')
            .eq('user_id', userId)
            .eq('is_deleted', false);
        if (error) throw error;
        return data;
    },

    updateLabel: async (id, userId, data) => {
        const { data: label, error } = await supabase
            .from('labels')
            .update(data)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();
        if (error) throw error;
        return label;
    },

    deleteLabel: async (id, userId) => {
        const { data: label, error } = await supabase
            .from('labels')
            .update({ is_deleted: true })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();
        if (error) throw error;
        return label;
    },

    findOneWithDeleted: async (name, userId) => {
        const { data, error } = await supabase
            .from('labels')
            .select('*')
            .eq('name', name)
            .eq('user_id', userId)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },
};

module.exports = labelRepo;
