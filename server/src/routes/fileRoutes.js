// Imports
const express = require('express')
const router = express.Router()
const fileController = require('../controllers/fileController')

// Functionality
router.post('/:projectId/file', fileController.createFile);
router.get('/:id', fileController.getFile)
router.put('/:id', fileController.updateFile)
router.delete('/:id', fileController.deleteFile)
router.post('/:id/rename/:newName', fileController.renameFile)

module.exports = router