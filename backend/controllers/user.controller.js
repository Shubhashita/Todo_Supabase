const userService = require('../services/user.service');

const userController = {}

userController.login = async (req, res) => {
    try {
        console.log('Login endpoint hit | userService.login');
        const response = await userService.login(req.body);
        return res.status(200).send(
            {
                message: "Login successful",
                data: response,
                success: true
            }
        );
    } catch (error) {
        console.log('Error in login', error);
        return res.status(401).send(
            {
                message: "Login operation failed!",
                error: error.message,
                success: false
            }
        );
    }
}

userController.onboard = async (req, res) => {
    try {
        console.log('Onboard endpoint hit | userService.onboard');
        const response = await userService.onboard(req.body);
        return res.status(200).send({
            message: "Onboard operation successful!",
            data: response,
            success: true
        });
    } catch (error) {
        console.log('Error in onboard', error);
        return res.status(400).send(
            {
                message: "Onboard operation failed!",
                error: error.message,
                success: false
            }
        );
    }
}

userController.updateAccount = async (req, res) => {
    try {
        console.log('Update Account endpoint hit | userService.updateAccount');

        const response = await userService.updateAccount(req.user.id, req.body.status);
        return res.status(200).send({
            message: "Update Account operation successful!",
            data: response,
            success: true
        });
    } catch (error) {
        console.log('Error in updateAccount', error);
        return res.status(400).send(
            {
                message: "Update Account operation failed!",
                error: error.message,
                success: false
            }
        );
    }
}

userController.removeAccount = async (req, res) => {
    try {
        console.log('Remove Account endpoint hit | userService.removeAccount');
        const response = await userService.removeAccount(req.user.id);
        return res.status(200).send({
            message: "Remove Account operation successful!",
            data: response,
            success: true
        });
    } catch (error) {
        console.log('Error in removeAccount', error);
        return res.status(400).send(
            {
                message: "Remove Account operation failed!",
                error: error.message,
                success: false
            }
        );
    }
}




userController.getProfile = async (req, res) => {
    try {
        console.log('Get Profile endpoint hit | userService.getProfile');
        const response = await userService.getProfile(req.user.id);
        return res.status(200).send({
            message: "Get Profile successful!",
            data: response,
            success: true
        });
    } catch (error) {
        console.log('Error in getProfile', error);
        return res.status(400).send({
            message: "Get Profile failed!",
            error: error.message,
            success: false
        });
    }
}

userController.updateProfile = async (req, res) => {
    try {
        console.log('Update Profile endpoint hit | userService.updateProfile');
        const response = await userService.updateProfile(req.user.id, req.body);
        return res.status(200).send({
            message: "Update Profile successful!",
            data: response,
            success: true
        });
    } catch (error) {
        console.log('Error in updateProfile', error);
        return res.status(400).send({
            message: "Update Profile failed!",
            error: error.message,
            success: false
        });
    }
}

module.exports = userController;