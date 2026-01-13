const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    console.error('Supabase URL, Anon Key, and Service Role Key must be provided in .env.local');
}

// Regular client for Auth/Public operations
const supabase = createClient(supabaseUrl, anonKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Admin client for DB operations (Bypasses RLS)
const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

module.exports = { supabase, adminSupabase };
