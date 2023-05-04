const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// const hpp = require("hpp");
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser())
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const taskRouter = require('./routes/tasksRouter');
const userRouter = require('./routes/usersRouter');
const viewsRouter = require('./routes/viewsRouter');
const globalErrorHandler = require('./utils/globalErrHandler');

app.use(helmet());

const limiter = rateLimit({
    max: 1000, // max requests number
    windowMs: (60 * 60 * 1000),
    message: "Too Many requests from this IP, please try again latter",
    // legacyHeaders: false, // to hide the requests count from headers
})
app.use('/api', limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }))

app.use(mongoSanitize());

app.use(xss());

// Preventing Parameter Pollution
// app.use(hpp({
//     whitelist: 
//     ['duration', 'price', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty']
// }));
app.set('trust proxy', true);


app.use(morgan('dev'))

app.use('/api/tasks', taskRouter);
app.use('/api/users', userRouter);

app.use(('/'), viewsRouter)



app.use(globalErrorHandler);

module.exports = app;