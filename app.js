const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = 8989
const DB_URL = "mongodb+srv://root:b3lJHkLHeqpc7RSs@cluster0.ewctvwt.mongodb.net/forex?retryWrites=true&w=majority"

const indexRouter = require('./routes/index');
const authMiddleware = require("./middlewares/auth");
const {initScheduledJobs} = require("./schedule");
const getRandomInt = require("./utils/getRandomInt");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(authMiddleware);
app.use('/api', indexRouter);

const start = async () => {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // initScheduledJobs();

        await app.listen(PORT, () => {
            console.log('Server started at port ' + PORT);
        })
    } catch (e) {
        console.log(e)
    }
}

start();

module.exports = app;