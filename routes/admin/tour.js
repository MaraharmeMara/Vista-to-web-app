import formidable from "formidable";
import * as s3 from "../../db/s3.js";
import * as store from "../../db/store/store.js";

export async function listView(req, res) {
    const tours = await store.listTour();
    tours.forEach((element) => {
        element.panorama_file = s3.getFilePath(element.panorama_file);
    });
    res.render('partials/tourList', {
        tours: tours,
    });
}

export async function createNewTourView(req, res) {
    console.log(req.params);
    res.render("admin/tour", {
        subject: "EJS template template engine",
        name: "our templated",
        link: "https://google.com",
    })
}

export async function createNewTour(req, res) {
    const form = formidable({fileWriteStreamHandler: s3.uploadFile});
    const [fields, files] = await form.parse(req);
    console.log(files);

    const result = await store.createTour(
        fields.panoramaName[0],
        files.panoramaFile[0].uuid
    );

    res.redirect(`/admin/tour-edit/${result.id}`)
}

export async function editTourView(req, res) {
    let mainScene = "/assets/img/panorama/Keskusta kesä.jpg"
    let tour = await store.getTour(req.params.id);
    let panorama = await store.listPanorama(req.params.id)
    let poi = await store.listPOI()
    console.log(tour)
    let hotspots = [];
    if (tour != null) {
        hotspots = await store.listTourHotspot(tour.main_panorama_id);
    }
    // console.log(req.params, tour);
    res.render("admin/tourEdit", {
        id: req.params.id,
        tour: tour,
        panorama: panorama,
        hotspots: hotspots,
        mainScene: mainScene,
        poi: poi,
    });
}

export async function deleteTour(req, res) {
    let tour = "";
    try {
        tour = await store.deleteTour(req.params.id) // todo delete file from s3 too
    } catch (e) {
        console.log("error", e);
    }
    console.log(tour)
    // console.log(req.params, tour);
    res.render("admin/tourDelete", {
        id: req.params.id,
    });
}

export async function setMainPanorama(req, res) {
    await store.tourSetMainPanorama(req.params.id, req.params.pid)
}