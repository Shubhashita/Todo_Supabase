const userService = {}
const userRepo = require('../repositories/user.repo');
const { supabase } = require('../config/supabase.config');

userService.onboard = async (data) => {
    try {
        // SignUp with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    name: data.name
                }
            }
        });

        if (authError) throw authError;

        // The 'profiles' entry is created via SQL Trigger on 'auth.users' table
        // But let's return the user data
        return {
            id: authData.user.id,
            email: authData.user.email,
            name: data.name
        };
    } catch (error) {
        console.log("error in onboard", error);
        throw error;
    }
}

userService.login = async (data) => {
    try {
        // SignIn with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password
        });

        if (authError) throw authError;

        // Fetch profile data
        let profile = await userRepo.findUserById(authData.user.id);

        if (!profile) {
            console.log('Profile not found for authenticated user. Attempting to create one (self-healing)...');
            // Self-healing: Create profile if missing (helps if trigger was not run)
            try {
                profile = await userRepo.createUser({
                    id: authData.user.id,
                    email: authData.user.email,
                    name: authData.user.user_metadata?.name || 'User',
                    status: 'active'
                });
            } catch (createError) {
                console.error('Self-healing profile creation failed:', createError);
                throw new Error('User profile not found and could not be created!');
            }
        }

        if (profile.is_deleted) {
            throw new Error('Account has been deleted!');
        }

        if (profile.status === 'inactive') {
            throw new Error('Account is inactive!');
        }

        return {
            token: authData.session.access_token,
            name: profile.name,
            email: profile.email,
            id: profile.id
        };
    } catch (error) {
        console.log("error in login", error);
        throw error;
    }
}

userService.getProfile = async (userId) => {
    try {
        const user = await userRepo.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status
        };
    } catch (error) {
        console.log("error in getProfile", error);
        throw error;
    }
}

userService.updateProfile = async (userId, data) => {
    try {
        const updateData = {};
        if (data.name) updateData.name = data.name;

        const updatedUser = await userRepo.updateUser(userId, updateData);
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email
        };
    } catch (error) {
        console.log("error in updateProfile", error);
        throw error;
    }
}

userService.updateAccount = async (userId, status) => {
    try {
        const isExists = await userRepo.findUserById(userId);
        if (!isExists) {
            throw new Error('User not found!');
        }
        if (isExists.status === status) {
            throw new Error(`Account account is already ${status}!`);
        }
        const data = { status: status };
        const response = await userRepo.updateUser(userId, data);
        return { id: response.id, status: response.status };
    } catch (error) {
        console.log("error in updateAccount", error);
        throw error;
    }
}

userService.removeAccount = async (userId) => {
    try {
        const isExists = await userRepo.findUserById(userId);
        if (!isExists || isExists.is_deleted) {
            throw new Error('Account already deleted');
        }

        const data = { isDeleted: true };
        const response = await userRepo.updateUser(userId, data);
        return { id: response.id, isDeleted: response.is_deleted };

    } catch (error) {
        console.log("error in removeAccount", error);
        throw error;
    }
}
module.exports = userService;