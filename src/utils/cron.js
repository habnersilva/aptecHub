require("dotenv").config()
const sync = require("../sync")
const CronJob = require("cron").CronJob

async function syncAllBrands(Brands) {
  const brands = await Brands.findAll()

  await Promise.all(
    brands.map(async brand => {
      await sync(brand).start()
    })
  )
}

const init = async ({ Brands }) => {
  console.log("**** CronJob Inicializado ****")

  const job = new CronJob(
    process.env.CRON_INTERVAL,
    () => {
      syncAllBrands(Brands)
    },
    null,
    true,
    "America/Sao_Paulo"
  )
}

module.exports = init
