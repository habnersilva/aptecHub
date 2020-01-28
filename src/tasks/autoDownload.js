const syncXML = require("../syncXML")

module.exports = function(cron, models) {
  const syncAllProducts = async () => {
    try {
      const brands = await models.Brands.findAll()

      await Promise.all(
        brands.map(async brand => {
          await syncXML(brand).download()
        })
      )
    } catch (err) {
      console.error(err)
    }
  }

  let job = new cron.CronJob({
    cronTime: process.env.CRON_INTERVAL_SYNC_DOWNLOAD, // The time pattern when you want the job to start
    onTick: syncAllProducts, // Task to run
    onComplete: () => console.log("Download Task Completed"), // When job is completed and It stops.
    start: false, // immediately starts the job.
    timeZone: "America/Sao_Paulo" // The timezone
  })

  return job
}
