const init = (cron, models) => {
  const tasks = {}

  tasks.autoSync = require("./autoSync")(cron, models)

  return tasks
}

module.exports = init
