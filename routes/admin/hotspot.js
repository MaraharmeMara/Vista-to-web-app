import formidable from "formidable";
import * as store from "../../db/store/store.js";

export async function addNewHotspot(req, res) {
    const form = formidable();
    const [fields] = await form.parse(req);
    console.log(fields);
    const result = await store.createHotSpot(
        1, // todo panorama id from form
        fields.hotspotType[0],
        fields.hotspotName[0],
        fields.number[0],
        fields.pitch[0],
        fields.yaw[0],
        fields.facebookLink[0]
    );

    res.json({form_id: req.params.id, fields, result});
}

export async function hotspotUpdates(req, res) {
    for (const v of Object.values(req.body)) {
        console.log(v)
        const result = await store.updateHotspot(v.panoramaID, v.poiID, v.pitch, v.yaw)
        console.log("result", result)
    }

    res.json({form_id: req.params.id});
}