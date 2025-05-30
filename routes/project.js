const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/project');
const restrict = require('../middlewares/restrict');

router.get('/projects', restrict.allUser, ProjectController.getAll);
router.get('/project/:id', restrict.allUser, ProjectController.getById);
router.get('/project', restrict.allUser, ProjectController.getByUser);
router.post('/project', restrict.admin, ProjectController.create);
router.put('/project/:id', restrict.admin, ProjectController.update);
router.delete('/project/:id', restrict.admin, ProjectController.delete);

module.exports = router;