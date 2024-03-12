const router = require('express').Router()

const TerritoriosController = require('../controllers/TerritoriosController')
const verificarToken = require('../helpers/verificarToken')

router.post('/subir', verificarToken, TerritoriosController.Subir)
router.get('/update', TerritoriosController.Update)

module.exports = router