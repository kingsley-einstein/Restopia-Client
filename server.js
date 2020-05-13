const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "build"), {
  setHeaders: (res, p, loc) => {
    res.set("Service-Worker-Allowed", "/");
  }
}));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server is running. App is ready to launch");
});
