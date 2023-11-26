import express from "express";
import formidable from "formidable";

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
  res.render("index.ejs", {
    subject: "EJS template template engine",
    name: "our templated",
    link: "https://google.com",
  });
}

app.get("/admin*", (req, res) => {
  console.log(req.params);
  console.log(req.url);
  res.render(req.url.slice(1), {
    subject: "EJS template template engine",
    name: "our templated",
    link: "https://google.com",
  });
});

app.post("/admin/panorama", (req, res) => {
  const form = formidable({});

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.json({
        error: err,
        msg: "failed to upload file",
      });
      return;
    }

    res.json({ fields, files });
  });
});
