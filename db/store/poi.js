import {pool} from "./store.js";
import fs from 'node:fs/promises'

export async function listPOI() {
    const result = await pool.query(
        `select *
         from novista.poi`,
    );
    return result.rows;
}

export async function importPOI() {
    const dr = pool.query("delete from novista.poi")

    let f = await fs.readFile('./assets/pack.json', {encoding: "utf-8"})
    let ff = JSON.parse(f)

    for (const p of ff) {
        if (p.type !== "info" && p.type !== "tour") {
            continue
        }

        if (p.type === "info") {
            if (p.number === null) {
                continue
            }
        }

        console.log("ok", p)

        const result = await pool.query(
            `insert into novista.poi (type, name, number, site)
             values ($1, $2, $3, $4)
             returning *`,
            [p.type, p.title, p.number, p.site]
        )
        console.log(result.rows[0])
    }

}