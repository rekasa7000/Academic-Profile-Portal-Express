import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoute";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

app.use("/", authRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
