const init = (cron, models) => {
  const tasks = {}

  tasks.autoDownload = require("./autoDownload")(cron, models)
  tasks.autoSync = require("./autoSync")(cron, models)

  return tasks
}

module.exports = init
