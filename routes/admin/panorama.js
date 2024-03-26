import formidable from "formidable";
import * as s3 from "../../db/s3.js";
import * as store from "../../db/store/store.js";

export async function uploadPanorama(req, res) {
    const form = formidable({fileWriteStreamHandler: s3.uploadFile});
    try {
        const [fields, files] = await form.parse(req);
        console.log(files);
        const result = await store.createPanorama(
            fields.panoramaName[0],
            files.panoramaFile[0].uuid
        );
        res.json({result});
    } catch (e) {
        console.error("error write file", e);
        res.json({error: e});
    }
}