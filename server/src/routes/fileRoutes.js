// Imports
const express = require('express')
const router = express.Router()
const fileController = require('../controllers/fileController')

// Functionality
router.post('/', fileController.createFile)
router.get('/:id', fileController.getFile)
router.put('/:id', fileController.updateFile)
router.delete('/:id', fileController.deleteFile)

// Export
module.exports = router