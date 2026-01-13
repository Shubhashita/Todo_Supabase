const { supabase } = require("../config/supabase.config");

const authorization = async (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token missing" });
    }

    const token = header.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = {
        id: user.id,
        email: user.email,
        ...user.user_metadata
    };
    next();
};

module.exports = { authorization };
