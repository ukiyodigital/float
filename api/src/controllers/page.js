const { ObjectID } = require('mongodb')

let { Site } = require('./../models/site')
let { Page } = require('./../models/page')

// create site POST
function createPage (req, res) {
  let { sid } = req.params

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid ID' })

  let { name, slug } = req.body

  let page = new Page({name, slug})

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists.'})

    if (!site.isUniquePageSlug(slug)) return res.status(400).send({message: 'Slug already exists.'})

    site.addPage(page).then(page => {
      res.send({page})
    })
  }).catch(e => res.status(400).send({message: e.message}))
}

// get by site and page id
function getPage (req, res) {
  let { sid, pid } = req.params

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid site id' })
  if (!ObjectID.isValid(pid)) return res.status(404).send({ message: 'Not a valid page id' })

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists.'})

    let page = site.pages.id(pid)
    if (!page) return res.status(404).send({message: 'No page exists.'})

    res.send({page})
  }).catch(e => res.status(400).send({message: e.message}))
}

// updates the name of the page
function updatePage (req, res) {
  let { sid, pid } = req.params
  let { name, slug } = req.body

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid site id' })
  if (!ObjectID.isValid(pid)) return res.status(404).send({ message: 'Not a valid page id' })

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists.'})

    let page = site.pages.id(pid)
    if (!page) return res.status(404).send({message: 'No page found with that id'})

    if (!site.isUniquePageSlug(slug)) return res.status(400).send({message: 'Slug already exists.'})

    page.name = name
    page.slug = slug
    site.save().then(() => {
      res.send({page})
    })
  }).catch(e => res.status(400).send({message: e.message}))
}

function deletePage (req, res) {
  let { sid, pid } = req.params

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid site id' })
  if (!ObjectID.isValid(pid)) return res.status(404).send({ message: 'Not a valid page id' })

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists.'})

    site.deletePageById(pid).then(page => {
      if (!page) return res.status(404).send({message: 'No page by given id exists.'})

      res.send({page})
    })
  }).catch(e => res.status(400).send({message: e.message}))
}

function addInput (req, res) {
  let { sid, pid } = req.params

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid site id' })
  if (!ObjectID.isValid(pid)) return res.status(404).send({ message: 'Not a valid page id' })

  let { name, slug, inputType } = req.body

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists.'})

    // validates fid, name, and slug
    let page = site.pages.id(pid)
    if (!page) return res.status(404).send({message: 'No flock by given id exists.'})

    if (!page.isUniqueInputName(name)) return res.status(404).send({message: 'Input name already exists for page.'})
    if (!page.isUniqueInputSlug(slug)) return res.status(404).send({message: 'Input slug already exists for page.'})

    let input = page.addInput(name, slug, inputType)

    site.save().then(() => {
      let status = 'Success'
      res.send({status, input})
    }).catch(e => res.status(400).send({message: e.message}))
  })
}

function updateInput (req, res) {
  let { sid, pid, iid } = req.params

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid site id' })
  if (!ObjectID.isValid(pid)) return res.status(404).send({ message: 'Not a valid page id' })
  if (!ObjectID.isValid(iid)) return res.status(404).send({ message: 'Not a valid input id' })

  let { name, slug, inputType } = req.body

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists.'})

    const page = site.pages.id(pid)
    if (!page) return res.status(404).send({message: 'No page by given id'})

    let input = page.inputs.id(iid)
    if (!input) return res.status(404).send({message: 'No input by given id'})

    input = page.updateInput(iid, name, slug, inputType)

    site.save().then(() => {
      let status = 'Success'
      res.send({status, input})
    }).catch(e => res.status(400).send({message: e.message}))
  })
}

function removeInput (req, res) {
  let { sid, pid, iid } = req.params

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid site id' })
  if (!ObjectID.isValid(pid)) return res.status(404).send({ message: 'Not a valid page id' })
  if (!ObjectID.isValid(iid)) return res.status(404).send({ message: 'Not a valid input id' })

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists.'})

    const page = site.pages.id(pid)
    if (!page) return res.status(404).send({message: 'No page by given id'})

    let input = page.removeInput(iid)
    if (!input) return res.status(404).send({message: 'No input by given id'})

    site.save().then(() => {
      let status = 'Success'
      res.send({status, input})
    })
  }).catch(e => res.status(400).send({message: e.message}))
}

function updateValues (req, res) {
  let { sid, pid } = req.params

  let { values } = req.body

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid site id' })
  if (!ObjectID.isValid(pid)) return res.status(404).send({ message: 'Not a valid page id' })

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site by given id exists.'})

    const page = site.pages.id(pid)
    if (!page) return res.status(404).send({message: 'No page by given id'})

    page.values = values

    site.save().then(() => {
      const status = 'Success'
      res.send({status, page})
    })
  })
}

function isUniqueSlug (req, res) {
  let { sid, slug } = req.params

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid site id' })

  Site.findById(sid).then(site => {
    if (!site) return res.status(404).send({message: 'No site found with that id'})

    let result = site.isUniquePageSlug(slug)
    res.send({result})
  })
}

module.exports = {
  createPage,
  getPage,
  updatePage,
  deletePage,
  addInput,
  updateInput,
  removeInput,
  updateValues,
  isUniqueSlug
}
