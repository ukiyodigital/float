const router = require('express').Router()

const api = require('./../controllers/api')

router.get('/:token', api.getSiteByToken)
router.get('/:token/page/:slug', api.getPage)
router.get('/:token/flock/:slug', api.getFlock)

module.exports = router
