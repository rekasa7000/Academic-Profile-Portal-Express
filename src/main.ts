import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoute";
import portfolioRoute from "./routes/portfolioRoute";
import session from "express-session";
import accountRoute from "./routes/accountRoute";

const app = express();
const PORT = process.env.PORT || 8000;

declare module "express-session" {
  interface SessionData {
    user: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
    };
  }
}

app.use(express.json());
app.use(
  session({
    secret: "your-secret-key", // replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // set to true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

app.use("/", authRoute);
app.use("/", portfolioRoute);
app.use("/", accountRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
