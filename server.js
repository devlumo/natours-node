import "./config.js";
import app from "./app.js";

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on http://127.0.0.1:${port}`);
});
