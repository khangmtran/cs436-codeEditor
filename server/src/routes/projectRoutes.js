const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticate = require('../middleware/authenticate');

router.post('/create',authenticate,projectController.createProject);
router.get('/:id', projectController.getProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.get('/:projectId/files', projectController.getProjectFiles);
router.post('/addUser/:projectId', projectController.addCollaborator);

module.exports = router;
