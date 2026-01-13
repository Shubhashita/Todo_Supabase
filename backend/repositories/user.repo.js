const { adminSupabase: supabase } = require("../config/supabase.config");

const userRepo = {}

userRepo.createUser = async (data) => {
    // Note: Creating a user in the 'profiles' table. 
    // Usually, the auth user is created first, and then a trigger creates the profile.
    // If we are doing it manually:
    const { data: user, error } = await supabase
        .from('profiles')
        .insert([{
            id: data.id, // ID from Supabase Auth
            name: data.name,
            email: data.email,
            status: data.status
        }])
        .select()
        .single();

    if (error) throw error;
    return user;
}

userRepo.findUserByEmail = async (email) => {
    const { data: user, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return user;
}

userRepo.findUserById = async (id) => {
    const { data: user, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return user;
}



userRepo.updateUser = async (id, data) => {
    // Map snake_case if necessary, assuming profiles table has snake_case
    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.status) updateData.status = data.status;
    if (data.isDeleted !== undefined) updateData.is_deleted = data.isDeleted;

    const { data: user, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return user;
}

module.exports = userRepo;
