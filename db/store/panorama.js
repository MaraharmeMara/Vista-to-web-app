import {getFilePath} from "../s3.js";
import {pool} from "./store.js";

export async function createPanorama(tourID, file) {
    const newPanoramaResult = await pool.query(
        `insert into novista.panorama(tour_id, panorama_file)
         values ($1, $2)
         returning *`,
        [tourID, file]
    );
    return newPanoramaResult.rows[0];
}

export async function listPanorama(id) {
    const result = await pool.query(
        `select *
         from novista.panorama
         where novista.panorama.tour_id = $1`,
        [id]);

    result.rows.forEach((v) => {
        v.panorama_file = getFilePath(v.panorama_file)
    })
    return result.rows;
}

export async function tourSetMainPanorama(tourID, panoramaID) {
    const result = await pool.query(
        `update novista.tour
         set main_panorama_id = $1
         where novista.tour.id = $2
         returning *`,
        [panoramaID, tourID]
    );

    return result.rows[0];
}

export async function createHotSpot(panoramaID, type, name, number, pitch, yaw, siteLink) {
    const result = await pool.query(
        `insert into novista.hotspot(panorama_id, poi_id, pitch, yaw)
         values ($1, $2, $3, $4)
         returning *`,
        [panoramaID, type, name, number, pitch, yaw, siteLink]
    );

    return result.rows[0];
}

export async function updateHotspot(panoramaID, poiID, pitch, yaw) {
    const result = await pool.query(
        `insert into novista.hotspot(panorama_id, poi_id, pitch, yaw)
         values ($1, $2, $3, $4)
         on conflict(panorama_id, poi_id)
             do update set pitch=$3,
                           yaw=$4
         returning *`,
        [panoramaID, poiID, pitch, yaw]
    );

    return result.rows[0];
}


export async function listTourHotspot(tourID) {
    const result = await pool.query(
        `select *
         from novista.hotspot
         where novista.hotspot.panorama_id = $1`,
        [tourID]
    );
    return result.rows;
}
