const robots = {
  initFileContent: require("./initFileContent"),
  state: require("./state")
}

const init = brand => {
  console.log("=> constructor")
  const contentFilePath = `./tmp/${brand.id}_temp.json`

  robots.initFileContent(brand, contentFilePath)
}

module.exports = init
