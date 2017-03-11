
module.exports = {
  getRoot (req, res) {
    res.status(200).json({
      version: require('../../../package.json').version
    })
  }
}
