const express = require("express");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const sanitize = require("sanitize");

const indexRouter = require("./routes/index");
const chainRouter = require("./routes/chain");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const whoamiRouter = require("./routes/whoami");
const userRouter = require("./routes/user");
const departmentRouter = require("./routes/departments");
const partnersRouter = require("./routes/partners");
const transcriptsRouter = require("./routes/transcripts");
const outgoingsRouter = require("./routes/outgoings");
const incomingsRouter = require("./routes/incomings");

const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet()); // https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
if (process.env.CORS_ORIGIN) {
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
    })
  );
} else {
  app.use(cors());
}
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sanitize.middleware);

app.use("/", indexRouter);
app.use("/api", indexRouter);
app.use("/api/chain", chainRouter);
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/whoami", whoamiRouter);
app.use("/api/user", userRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/partners", partnersRouter);
app.use("/api/transcripts", transcriptsRouter);
app.use("/api/outgoings", outgoingsRouter);
app.use("/api/incomings", incomingsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError.NotFound());
});

// pass any unhandled errors to the error handler
app.use(errorHandler);

module.exports = app;
