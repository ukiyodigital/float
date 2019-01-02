const { ObjectID } = require('mongodb')
const { ObjectId } = require('mongoose').Types

let { Site } = require('./../models/site')
let { Flock } = require('./../models/flock')

// create site POST
function createFlock (req, res) {
  let { sid } = req.params

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid ID' })

  let { name, slug } = req.body

  let flock = new Flock({name, slug})

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists.'})

    if (!site.isUniqueFlockSlug(slug)) return res.status(400).send({message: `Flock with slug ${slug} already exists.`})

    site.addFlock(flock).then(flock => {
      res.send({flock})
    }).catch(e => res.status(400).send({message: e.message}))
  }).catch(e => res.status(400).send({message: e.message}))
}

// get by site and flock id
function getFlock (req, res) {
  let { sid, fid } = req.params

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid site id' })
  if (!ObjectID.isValid(fid)) return res.status(404).send({ message: 'Not a valid flock id' })

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists.'})

    let flock = site.flocks.id(fid)
    if (!flock) return res.status(404).send({message: 'No flock exists.'})

    res.send({flock})
  }).catch(e => res.status(400).send({message: e.message}))
}

// updates the name of the flock
function updateFlock (req, res) {
  let { sid, fid } = req.params
  let { name, slug } = req.body

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid site id' })
  if (!ObjectID.isValid(fid)) return res.status(404).send({ message: 'Not a valid flock id' })

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists.'})

    let flock = site.flocks.id(fid)
    if (!flock) return res.status(404).send({message: 'No flock found with that id'})

    if (!site.isUniqueFlockSlug(slug)) return res.status(400).send({message: `Flock with slug ${slug} already exists.`})

    flock.name = name
    flock.slug = slug
    site.save().then(() => {
      res.send({flock})
    })
  }).catch(e => res.status(400).send({message: e.message}))
}

function deleteFlock (req, res) {
  let { sid, fid } = req.params

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid site id' })
  if (!ObjectID.isValid(fid)) return res.status(404).send({ message: 'Not a valid flock id' })

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists.'})

    site.deleteFlockById(fid).then(flock => {
      if (!flock) return res.status(404).send({message: 'No flock by given id exists.'})

      res.send({flock})
    })
  }).catch(e => res.status(400).send({message: e.message}))
}

function addInput (req, res) {
  let { sid, fid } = req.params

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid site id' })
  if (!ObjectID.isValid(fid)) return res.status(404).send({ message: 'Not a valid flock id' })

  let { name, slug, inputType } = req.body

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists.'})

    // validates fid, name, and slug
    let flock = site.flocks.id(fid)
    if (!flock) return res.status(404).send({message: 'No flock by given id exists.'})

    if (!flock.isUniqueInputName(name)) return res.status(404).send({message: 'Input name already exists for flock.'})
    if (!flock.isUniqueInputSlug(slug)) return res.status(404).send({message: 'Input slug already exists for flock.'})

    let input = flock.addInput(name, slug, inputType)

    site.save().then(() => {
      let status = 'Success'
      res.send({status, input})
    }).catch(e => res.status(400).send({message: e.message}))
  })
}

function updateInput (req, res) {
  let { sid, fid, iid } = req.params

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid site id' })
  if (!ObjectID.isValid(fid)) return res.status(404).send({ message: 'Not a valid flock id' })
  if (!ObjectID.isValid(iid)) return res.status(404).send({ message: 'Not a valid input id' })

  let { name, slug, inputType } = req.body

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists.'})

    const flock = site.flocks.id(fid)
    if (!flock) return res.status(404).send({message: 'No flock by given id'})

    if (!flock.inputs.id(iid)) return res.status(404).send({message: 'No input by given id'})

    const input = flock.updateInput(iid, name, slug, inputType)

    site.save().then(() => {
      let status = 'Success'
      res.send({status, input})
    }).catch(e => res.status(400).send({message: e.message}))
  })
}

function removeInput (req, res) {
  let { sid, fid, iid } = req.params

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid site id' })
  if (!ObjectID.isValid(fid)) return res.status(404).send({ message: 'Not a valid flock id' })
  if (!ObjectID.isValid(iid)) return res.status(404).send({ message: 'Not a valid input id' })

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists.'})

    let flock = site.flocks.id(fid)
    if (!flock) return res.status(404).send({message: 'No flock by given id'})

    let input = flock.removeInput(iid)
    if (!input) return res.status(404).send({message: 'No input by given id'})

    site.save().then(() => {
      let status = 'Success'
      res.send({status, input})
    })
  }).catch(e => res.status(400).send({message: e.message}))
}

function getFlockItem (req, res) {
  let { sid, fid, iid } = req.params

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists'})

    let flock = site.flocks.id(fid)
    if (!flock) return res.status(404).send({message: 'No flock by given id'})

    const item = flock.items.find(i => i._id.equals(iid))

    res.send({item})
  }).catch(e => res.status(400).send({message: e.message}))
}

function addFlockItem (req, res) {
  let { sid, fid } = req.params

  let { item } = req.body

  item._id = ObjectId()

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists'})

    let flock = site.flocks.id(fid)
    if (!flock) return res.status(404).send({message: 'No flock by given id'})

    flock.items.push(item)

    site.save().then(() => {
      let status = 'Success'
      res.send({status, flock})
    })
  }).catch(e => res.status(400).send({message: e.message}))
}

function updateFlockItem (req, res) {
  let { sid, fid, iid } = req.params

  let { item } = req.body

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists'})

    const flock = site.flocks.id(fid)
    if (!flock) return res.status(404).send({message: 'No flock by given id'})

    flock.items = flock.items.filter(i => !i._id.equals(iid))

    item._id = ObjectId(iid)
    flock.items.push(item)

    site.save().then(() => {
      let status = 'Success'
      res.send({status, flock})
    })
  }).catch(e => res.status(400).send({message: e.message}))
}

function deleteFlockItem (req, res) {
  let { sid, fid, iid } = req.params

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists'})

    const flock = site.flocks.id(fid)
    if (!flock) return res.status(404).send({message: 'No flock by given id'})

    flock.items = flock.deleteItemById(iid)

    site.save().then(() => {
      let status = 'Success'
      res.send({status, flock})
    })
  }).catch(e => res.status(400).send({message: e.message}))
}

function isUniqueSlug (req, res) {
  let { sid, slug } = req.params

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid site id' })

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site found with that id'})

    let result = site.isUniqueFlockSlug(slug)
    res.send({result})
  }).catch(e => res.status(400).send({message: e.message}))
}

module.exports = {
  createFlock,
  getFlock,
  updateFlock,
  deleteFlock,
  addInput,
  updateInput,
  removeInput,
  getFlockItem,
  addFlockItem,
  updateFlockItem,
  deleteFlockItem,
  isUniqueSlug
}
