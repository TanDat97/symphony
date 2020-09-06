const router = require('express').Router();

const trackController = require("../../controllers/api/trackController");

router.get('/:trackID', trackController.getTrack)
router.post('/', trackController.uploadTrack)

module.exports = router