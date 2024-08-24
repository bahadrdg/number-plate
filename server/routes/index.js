const express = require('express')
const router = express.Router()

const user = require('./user')
router.use('/users', user)

const plaque = require('./plaque')
router.use('/plaque', plaque)


module.exports = router


