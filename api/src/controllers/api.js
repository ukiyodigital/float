let { Site } = require('./../models/site')

function getSiteByToken (req, res) {
  let { token } = req.params

  Site.findByToken(token).then(site => {
    res.send({site})
  })
}

async function getPage (req, res) {
  let { token, slug } = req.params

  const site = await Site.findByToken(token)

  let page = site.pages.find(page => page.slug === slug)
  const { name, values } = page

  const data = { name, values }

  res.send({data})
}

async function getFlock (req, res) {
  let { token, slug } = req.params

  const site = await Site.findByToken(token)

  const flock = site.flocks.find(flock => flock.slug === slug)
  const { name, items } = flock
  const data = { name, items }
  res.send({data})
}

module.exports = {
  getSiteByToken,
  getPage,
  getFlock
}
