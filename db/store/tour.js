import {pool} from "./store.js";

export async function createTour(name, file) {
    let newTourResult = await pool.query(
        `insert into novista.tour(name)
         values ($1)
         returning *`,
        [name]
    );
    console.log(newTourResult)

    const newPanoramaResult = await pool.query(
        `insert into novista.panorama(tour_id, panorama_file)
         values ($1, $2)
         returning *`,
        [newTourResult.rows[0].id, file]
    );
    console.log(newPanoramaResult)

    newTourResult = await pool.query(
        `update novista.tour
         set main_panorama_id = $1
         where id = $2
         returning *`,
        [newPanoramaResult.rows[0].id, newTourResult.rows[0].id]
    )
    console.log(newTourResult)

    return newPanoramaResult.rows[0];
}

export async function getTour(id) {
    const result = await pool.query(
        `select *
         from novista.tour
         where novista.tour.id = $1`,
        [id]);
    return result.rows[0];
}

export async function deleteTour(id) {
    const result = await pool.query(`
        delete
        from novista.tour
        where novista.tour.id = $1
        returning *
    `, [id]);
    console.log("delete tour", id)
    console.log(result)
    console.log("delete tour end")

    return result.rows[0];
}

export async function listTour() {
    const result = await pool.query(`
        select *, p.panorama_file
        from novista.tour
                 left join novista.panorama p on p.id = novista.tour.main_panorama_id`);
    console.log(result.rows)
    return result.rows;
}

export async function getFirstTour() {
    const result = await pool.query(
        `select panorama_file
         from tour`
    );
    return result.rows[0];
}