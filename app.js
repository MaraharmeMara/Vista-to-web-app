const express = require("express");
const port = 3000;
const app = express();
app.use("/img", express.static("img"));
app.use("/numbers", express.static("numbers"));
app.set("view engine", "ejs");

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

app.get("/", index);
app.get("/index", index);
async function index(req, res) {
  res.render("index", {
    subject: "EJS template template engine",
    name: "our templated",
    link: "https://google.com",
  });
}
