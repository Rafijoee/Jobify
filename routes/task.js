const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/task');
const middleware = require('../middlewares/restrict');

router.get('/tasks', middleware.allUser, TaskController.getAll);
router.get('/task/:id', middleware.allUser, TaskController.getById);
router.get('/task', middleware.allUser, TaskController.getByUser);
router.post('/task/:id', middleware.admin, TaskController.create);
router.put('/task-change/:id', middleware.user, TaskController.updateStatus);
router.put('/task/:id', middleware.admin, TaskController.update);
router.delete('/task/:id', middleware.admin, TaskController.delete);

module.exports = router;