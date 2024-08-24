const Plaque = require('../models/plaque')
const Response = require('../utils/Response')
const APIError = require('../utils/Error')

const addPlaque = async (req, res) => {

    const control = await Plaque.findOne({plaqueName : req.body.plaque})
    if(control) return new Response(null, 'Bu plaka zaten aranıyor').c_403(res)

    const plaque = new Plaque({
        plaqueName: req.body.plaque
    })
    const response = await plaque.save()
    return new Response(response, 'başarılı').success(res)
    
}

const getPlaque = async (req, res) => {
    const plaques = await Plaque.find()
    if (!plaques) throw new APIError('aranan plaka yok.')
    return new Response(plaques, 'aranan plakalar').success(res)
}

const deletePlaque = async(req,res) => {
    console.log(req.params.id)
    const control = await Plaque.findById(req.params.id)
    if(!control) throw new APIError('silmek istediğiniz plaka veritabanında bulunamadı', 404)
    
    const deleted = await Plaque.findByIdAndDelete(req.params.id)
    return new Response(deleted, 'silinen kayıt').success(res)
    
}


const foundLocationCar = async(req,res) => {
    const data = await Plaque.find()
    
    const result = data.filter(res => {
        if(res.foundLocation.length >0) return res.foundLocation
        
    })


    
    if(result.length>0) return new Response(result, 'dat').success(res)
    else return new Response(null, 'aranan plakalarda herhangi bir bulunan konum yok').c_404(res)
}



module.exports = {
    addPlaque, getPlaque, deletePlaque, foundLocationCar
}