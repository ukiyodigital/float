const router = require('express').Router()

const { authenticate } = require('./../middleware/authenticate')
const site = require('./../controllers/site')

const page = require('./../controllers/page')
const flock = require('./../controllers/flock')

router.use(authenticate)
router.post('/new', site.createSite)
router.get('/:id', site.getSite)
router.patch('/:sid', site.updateSite)
router.delete('/:sid', site.deleteSite)

// pages
router.post('/:sid/page/new', page.createPage)
router.get('/:sid/page/:pid', page.getPage)
router.patch('/:sid/page/:pid', page.updatePage)
router.delete('/:sid/page/:pid', page.deletePage)
router.get('/:sid/page/slug/:slug', page.isUniqueSlug)

// page inputs
router.post('/:sid/page/:pid/input', page.addInput)
router.patch('/:sid/page/:pid/input/:iid', page.updateInput)
router.delete('/:sid/page/:pid/input/:iid', page.removeInput)

router.patch('/:sid/page/:pid/values', page.updateValues)

// flocks
router.post('/:sid/flock/new', flock.createFlock)
router.get('/:sid/flock/:fid', flock.getFlock)
router.patch('/:sid/flock/:fid', flock.updateFlock)
router.delete('/:sid/flock/:fid', flock.deleteFlock)

// flock items
router.get('/:sid/flock/:fid/item/:iid', flock.getFlockItem)
router.post('/:sid/flock/:fid/item', flock.addFlockItem)
router.patch('/:sid/flock/:fid/item/:iid', flock.updateFlockItem)
router.delete('/:sid/flock/:fid/item/:iid', flock.deleteFlockItem)

// flock inputs
router.post('/:sid/flock/:fid/input', flock.addInput)
router.patch('/:sid/flock/:fid/input/:iid', flock.updateInput)
router.delete('/:sid/flock/:fid/input/:iid', flock.removeInput)

router.get('/:sid/flock/slug/:slug', flock.isUniqueSlug)

module.exports = router
