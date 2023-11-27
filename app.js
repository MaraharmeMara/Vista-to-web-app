import express from "express";
import formidable from "formidable";
import * as db from "./db.js";
import * as s3 from "./s3.js";

const port = 3000;
const app = express();
app.use("/assets", express.static("assets"));
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
  // console.dir(tours);
  tours.forEach((element) => {
    element.panorama_file = s3.getFilePath(element.panorama_file);
  });
  res.render(req.url.slice(1), {
    tours: tours,
  });
});

// admin view, list tour
app.get("/admin", async (req, res) => {
  res.render(req.url.slice(1), {
    subject: "EJS template template engine",
    name: "our templated",
    link: "https://google.com",
  });
});

// create new tour view
app.get("/admin/tour", async (req, res) => {
  console.log(req.params);
  res.render("admin/tour", {
    subject: "EJS template template engine",
    name: "our templated",
    link: "https://google.com",
  });
});

// create new tour
app.post("/admin/tour", async (req, res) => {
  const form = formidable({ fileWriteStreamHandler: s3.uploadFile });
  try {
    const [fields, files] = await form.parse(req);
    console.log(files);
    const result = await db.createTour(
      fields.panoramaName[0],
      files.panoramaFile[0].uuid
    );

    console.log("done!");
    res.json({ result });
  } catch (e) {
    console.error("error write file", e);
    res.json({ error: e });
  }
});

// edit tour view
app.get("/admin/tour-edit/:id", async (req, res) => {
  const tour = await db.getTour(req.params.id);
  console.log(req.params, tour);
  res.render("admin/tour-edit", {
    id: req.params.id,
    name: "our templated",
  });
});

// add new hotspot
app.post("/admin/tour-edit/:id/hotspot", async (req, res) => {
  const form = formidable();

  try {
    const [fields] = await form.parse(req);
    res.json({ form_id: req.params.id, fields });
  } catch (e) {
    console.error(e);
    res.json({ error: e });
  }
});
