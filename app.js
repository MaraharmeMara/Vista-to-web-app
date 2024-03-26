import express from "express";
import 'express-async-errors';
import * as db from "./db/store/store.js";
import * as s3 from "./db/s3.js";
import * as tour from "./routes/admin/tour.js";
import * as panorama from "./routes/admin/panorama.js";
import * as hotspot from "./routes/admin/hotspot.js";
import bodyParser from "body-parser";

const port = 3000;
const app = express();

app.use(bodyParser.json())

app.use("/assets", express.static("assets"));
app.set("view engine", "ejs");
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});

app.get("/", index);
app.get("/index", index);

async function index(req, res) {
    const emj = await db.getFirstTour();
    console.log(emj);
    res.render("index.ejs", {
        subject: "EJS template template engine",
        name: "our templated",
        link: "https://google.com",
        winter: s3.getFilePath(emj.panorama_file),
        summer: "http://localhost:3000/assets/img/panorama/Keskusta kesä.jpg",
        autumn: "http://localhost:3000/assets/img/panorama/Keskusta syksy.jpg",
    });
}

app.get("/preview1", async (req, res) => {
    const emj = await db.getFirstTour();
    console.log(emj);
    res.render("preview1.ejs", {
        subject: "EJS template template engine",
        name: "our templated",
        link: "https://google.com",
        winter: s3.getFilePath(emj.panorama_file),
        summer: "http://localhost:3000/assets/img/panorama/Keskusta kesä.jpg",
        autumn: "http://localhost:3000/assets/img/panorama/Keskusta syksy.jpg",
    });
});

app.get("/home", async (req, res) => {
    res.render(req.url.slice(1));
});


app.get("/login", async (req, res) => {
    res.render(req.url.slice(1));
});
app.get("/signup", async (req, res) => {
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

// list tour view
app.get("/admin/tour-list", tour.listView)
// create new tour view
app.get("/admin/tour", tour.createNewTourView);
// create new tour handler
app.post("/admin/tour", tour.createNewTour);
// edit tour view
app.get("/admin/tour-edit/:id", tour.editTourView);
app.put("/admin/tour-edit/:id/hotspot", hotspot.hotspotUpdates)
// delete tour
app.get("/admin/tour-delete/:id", tour.deleteTour);
// upload new panorama for tour
app.post("/admin/tour/:id/panorama", panorama.uploadPanorama);
// add new hotspot
app.post("/admin/tour/:id/hotspot", hotspot.addNewHotspot);

app.get("/admin/tour/:id/set-main-panorama/:pid", tour.setMainPanorama);

// error handling
app.use((req, res, next) => {
    throw {status: 404, message: `page not found: ${req.url}`,}
})
app.use((err, req, res, next) => {
    let errText = JSON.stringify(err)
    if (err instanceof Error) {
        errText = err.message
    }
    console.error(err)
    res.status(err.status || 500);
    res.render('404', {error: errText, code: err.status || 500});
});