const router = require('express').Router()

const user = require('./user')
const site = require('./site')
const api = require('./api')

router.use('/api', api)
router.use('/', user)
router.use('/site', site)

module.exports = router
