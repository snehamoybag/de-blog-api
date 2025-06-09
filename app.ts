import "dotenv/config";
import express from "express";
import handle404 from "./middlewares/handle-404.middleware";
import handlerError from "./middlewares/handle-error.middleware";
import * as routes from "./routes";

const app = express();

// BODY PARSERS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTES
app.use("/", routes.home);
app.use("/signup", routes.signup);
app.use("/login", routes.login);
app.use("/blogs", routes.blogs);

// ERROR HANDLER
app.use(handlerError);

// 404 HANDLER
app.use(handle404);

// SERVER
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
