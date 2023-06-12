const CronJob = require("node-cron");
const TargetModel = require("../models/target-model");
const getRandomInt = require("../utils/getRandomInt");

exports.initScheduledJobs = async () => {
    const scheduledJobFunction = CronJob.schedule("*/1 * * * *", async () => {
        console.log("Schedule started");

        // Every minute update active targets statistics
        const targets = await TargetModel.find({isActive: true})

        targets.forEach(async target => {
            target.clicks = target.clicks + (getRandomInt(0, 10) * (target.amount > 10000 ? (target.amount / 10000) : 1).toFixed()).toFixed()
            target.visits = target.visits + (getRandomInt(0, 3) * (target.amount > 10000 ? (target.amount / 10000) : 1).toFixed()).toFixed()
            target.online = (getRandomInt(0, 25) * (target.amount > 10000 ? (target.amount / 10000) : 1).toFixed()).toFixed()
            target.middleTime = getRandomInt(1, 10)

            await target.save()
        })
    });

    scheduledJobFunction.start();
}