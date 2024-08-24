const express = require('express')
const router = express.Router()
const {addPlaque, getPlaque, deletePlaque, foundLocationCar} = require('../controllers/plaque')

router.post('/',addPlaque)
router.get('/',getPlaque)
router.delete('/:id', deletePlaque)

router.get('/found', foundLocationCar)


module.exports = router


