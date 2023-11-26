import express from "express";
import formidable from "formidable";
import * as db from "./db.js";
import * as s3 from "./s3.js";

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

app.get("/admin", async (req, res) => {
  const tours = await db.listTour();
  console.dir(tours);
  res.render(req.url.slice(1), {
    tours: tours,
  });
});

app.get("/admin/*", async (req, res) => {
  res.render(req.url.slice(1), {
    subject: "EJS template template engine",
    name: "our templated",
    link: "https://google.com",
  });
});

app.post("/admin/panorama", (req, res) => {
  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.json({
        error: err,
        msg: "failed to upload file",
      });
      return;
    }

    const tour = await db.createTour(
      fields.panoramaName[0],
      files.panoramaFile[0].originalFilename
    );

    res.json({ fields, files, tour });
  });
});
