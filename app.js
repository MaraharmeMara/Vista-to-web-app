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
  const emj = await db.getFirstTour() 
  console.log(emj)
  res.render("index.ejs", {
    subject: "EJS template template engine",
    name: "our templated",
    link: "https://google.com", 
        winter: s3.getFilePath(emj.panorama_file), 
        summer: "http://localhost:3000/assets/img/panorama/Keskusta kesä.jpg",
        autumn: "http://localhost:3000/assets/img/panorama/Keskusta syksy.jpg"
  });
}
app.get("/login", async (req, res) => {
  res.render(req.url.slice(1));
});
app.get("/logout", async (req, res) => {
  res.render(req.url.slice(1));
});

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

app.get("/admin/*", async (req, res) => {
  res.render(req.url.slice(1), {
    subject: "EJS template template engine",
    name: "our templated",
    link: "https://google.com",
  });
});

app.post("/admin/panorama", async (req, res) => {
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
