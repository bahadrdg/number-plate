const APIError = require('../utils/Error')

const errorHandler = (err,req,res,next) => {
    if(err instanceof APIError) { //* APIerror, err sınıfına ait ise
        return res.status(err.statusCode || 400).json({ 
            success : false,
            message : err.message  //* APIError kalıtım yoluyla message'ı ayarlamıştı, bu yüzden err.messagge diyerek APIError message'ına ulaşıyoruz
        })
    }
    return res.status(500).json({
        success : false,
        message : err.message,   
    })
}

module.exports = errorHandler