const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const authenticationRouter = require('./routes/authentication.router');
const profileRouter = require('./routes/profile.router');
const datasetRouter = require('./routes/datasets.router');
const fileRouter = require('./routes/file.router');
const commentRouter = require('./routes/comment.router');
const commonRouter = require('./routes/common.router');
const mongoose = require('mongoose');
const cors = require('cors');
const { connectDatabase } = require('./utils/connect-database');

require('dotenv/config');
const app = express();

//set cors
app.use(cors());

//connect mongodb
connectDatabase();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Router
app.use('/api/auth', authenticationRouter);
app.use('/api/profile', profileRouter);
app.use('/api/dataset', datasetRouter);
app.use('/api/file', fileRouter);
app.use('/api/comment', commentRouter);
app.use('/api/common', commonRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.send(res.locals.message);
});

var port = process.env.PORT || '3000';
app.listen('port', () => {
  console.log(`Server running at ${port}`);
});
