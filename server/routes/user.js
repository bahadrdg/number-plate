const express = require('express')
const router = express.Router()

const userControllers = require('../controllers/user')
const authValidations = require('../middlewares/validations/auth.validations')
const authMiddlewares = require('../middlewares/auth')

const upload = require('../middlewares/lib/multer')


router.post('/register', authValidations.register, userControllers.register)
router.post('/login', authValidations.login, userControllers.login)

router.get('/test', authMiddlewares.checkToken, userControllers.test)

router.post('/upload', upload.array('avatar',3), userControllers.uploadTest)

router.post('/forgot-password', userControllers.forgotPassword)
router.post('/forgot-password-check', userControllers.forgotPasswordCheckCode)
router.post('/reset-password', userControllers.resetPassword)









module.exports = router


