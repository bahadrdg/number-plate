const User = require('../models/User')
const bcrypt = require('bcrypt')
const APIError = require('../utils/Error')
const Response = require('../utils/Response')
const jwt = require('jsonwebtoken')
const authMiddlewares = require('../middlewares/auth')
const sendMail = require('../utils/sendMail')
const crypto = require('crypto');
const moment = require('moment')


const register = async (req, res) => {
    const checkUser = await User.findOne({ email: req.body.email })

    if (!checkUser) {
        const password = await bcrypt.hash(req.body.password, 10)

        const user = new User({
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            password
        })
        await user.save()
            .then(savedUser => {return new Response(savedUser, 'Kayıt başarıyla oluşturuldu').created(res)})
            .catch((err) => {throw new APIError('Kayıt sırasında bir hata meydana geldi.', 500) })
    }
    else {
        return new Response(null, 'email zaten kullanımda !',).c_400(res)
    }
}

const login = async (req, res) => {

    const user = await User.findOne({ email: req.body.email })

    if (user && await bcrypt.compare(req.body.password, user.password)) {
        authMiddlewares.createToken(user, res) //* token oluşturuldu.
    }
    else  return new Response(null, 'Giriş Bilgileri Hatalı').c_400(res)    
}


const test = async (req, res) => {
    return new Response(null, 'test! yetki var.').success(res)
}


const uploadTest = async (req, res) => {
    const file = req.savedImages

    if (file) return new Response(file, 'Fotoğraf başarıyla yüklendi.').success(res)
    else throw new APIError('Dosya yüklenemedi', 400)

}



const forgotPassword = async (req, res) => {
    const email = req.body.email

    const user = await User.findOne({ email })

    if (!user) {throw new APIError('Böyle bir email adresi mevcut değildir.')}

    const resetCode = crypto.randomBytes(3).toString('hex'); 

    const mailOptions = {
        from: process.env.EMAIL_ADRESS,
        to: email,
        subject: "Şifre Sıfırlama",
        text: "Şifre Sıfırlama Kodunuz " + resetCode
    }

    await sendMail(mailOptions)

    await User.updateOne({email}, {reset : {code : resetCode, time : moment(new Date()).add(15,'minute').format('YYYY-MM-DD HH:mm:ss')}  }) //*şuanki zamnın üstüne 15dk ekle ve database kaydet.

    return new Response(true, 'Şifre sıfırlama kodunuz mail adresinize gönderildi.').success(res)


}

const forgotPasswordCheckCode = async (req,res) => {
    const email = req.body.email
    const code = req.body.code

    const user = await User.findOne({email})
    if(!user || code !== user.reset.code) throw new APIError('Email veya kod hatalı', 404)

    const nowTime = moment(new Date()) //* şuanki saati aldık.
    const dbTime = moment(user.reset.time) //* veritabanına kaydedilen zamanı aldık.
    const timeDiff = dbTime.diff(nowTime, 'minutes') //* veritabanındakı zamandan şuanki zamanı çıkarttık. -15 sonucunu almamız lazım.

    if(timeDiff >=0 && code){
        const temporaryToken = await authMiddlewares.createTemporaryToken(user)

        return new Response({temporaryToken}, 'İşlem başarılı, Şifre sıfırlama yapabilirsiniz.').success(res)
    }
    else return new Response(false, 'İşlem başarısız, Gönderilen kod zaman aşımına uğradı.').c_403(res)
    
}

const resetPassword = async(req,res) => {
    const password = req.body.password
    const temporaryToken = req.body.temporaryToken

    const decodedToken = await authMiddlewares.decodedTemporaryToken(temporaryToken)
    console.log("çözümlenmiş token", decodedToken)

    if(!decodedToken) throw new APIError('Token Yok', 401)

    const hashPassword = await bcrypt.hash(password,10)

    await User.findByIdAndUpdate({_id : decodedToken._id}, {reset : {code : null, time : null}, password : hashPassword})

    return new Response(true, 'Şifre sıfırlama işlemi başarılı.').success(res)
}




module.exports = {
    register, login, test, uploadTest, forgotPassword,forgotPasswordCheckCode,resetPassword
}