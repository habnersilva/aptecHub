const sync = require("../sync")

module.exports = function(cron, models) {
  async function syncAllProducts() {
    try {
      const brands = await models.Brands.findAll()

      await Promise.all(
        brands.map(async brand => {
          await sync(brand).start()
        })
      )
    } catch (err) {
      console.error(err)
    }
  }

  let job = new cron.CronJob({
    cronTime: "*/3 * * * * *", // The time pattern when you want the job to start
    onTick: syncAllProducts, // Task to run
    onComplete: () => console.log("Sync Task Completed"), // When job is completed and It stops.
    start: false, // immediately starts the job.
    timeZone: "America/Sao_Paulo" // The timezone
  })

  return job
}
