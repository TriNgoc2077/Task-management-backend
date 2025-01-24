const taskRoutes = require("./task.route");
const userRoutes = require('./user.route');
const authMiddlewares = require('../middlewares/auth.middleware');

module.exports = (app) => {
    const version = '/api/v1';

    app.use(version + '/tasks', authMiddlewares.requireAuth, taskRoutes);
    app.use(version + '/user', userRoutes);

}