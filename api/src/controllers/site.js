const { ObjectID } = require('mongodb')

let { Site } = require('./../models/site')

// create site POST
function createSite (req, res) {
  let { name, slug } = req.body

  let site = new Site({name, slug})
  let role = 1
  site.users.push({_id: req.user._id, role})
  site.save().then(site => {
    req.user.sites.push(site._id)
    req.user.save().then(() => {
      let message = `The site, ${site.name}, has been generated`
      res.send({
        message,
        site
      })
    })
  }).catch(error => res.status(400).send({error}))
}

// get site :id
function getSite (req, res) {
  let id = req.params.id

  if (!ObjectID.isValid(id)) return res.status(404).send({ message: 'Not a valid ID' })

  Site.findById(id).then(site => {
    if (!site) return res.status(404).send({ message: 'No site found with that ID' })

    res.send({site})
  }).catch(error => res.status(400).send({error}))
}

// can update name, slug
function updateSite (req, res) {
  let { body } = req
  let { sid } = req.params

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid ID' })

  Site.findByIdAndUpdate(sid, {$set: body}, {new: true}).then(site => {
    res.send({site})
  }).catch(error => res.status(400).send({error}))
}

// delete site
function deleteSite (req, res) {
  let { sid } = req.params

  if (!ObjectID.isValid(sid)) return res.status(404).send({ message: 'Not a valid site ID' })

  Site.findByIdAndDelete(sid).then(site => {
    res.send({site})
  }).catch(error => res.status(400).send({error}))
}

module.exports = {
  createSite,
  getSite,
  updateSite,
  deleteSite
}
