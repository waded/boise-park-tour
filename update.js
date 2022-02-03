const fetch = require("node-fetch");
const csv_parse = require('csv-parse/lib/sync')

// https://city-of-boise.opendata.arcgis.com/datasets/parks-and-recreation-managed-parks-and-reserves-point/data?orderBy=ParkID
const url = 'https://opendata.arcgis.com/datasets/a0499e28888a44548c52d6e9a2d21b48_0.csv';

const process = async url => {
    const response = await fetch(url);
    const csv = await response.text();
    var trimmedCsv = csv.trim();
    var parsed = csv_parse(trimmedCsv, {columns: true});
    var mapped = parsed.map(v => {
        return {
            // e.g. Sue Howell Park has no ParkID
            'id': v["ParkID"].length > 0 ? v["ParkID"] : v["Site_Name"],
            'lat': Number.parseFloat(v["Y"]),
            'long': Number.parseFloat(v["X"]),
            'name': v["Site_Name"],
            'type': v["Park_Type"],
            'park_status': v["Park_Status"],
            'dev_status': v["Development_Status"],
            'address': v["Address"],
            'linkId': v["Park_Link"]
        };
    });
    mapped.sort((a, b) => { return a.id - b.id });
    return mapped;
}

process(url)
    .then(v => { console.log(JSON.stringify(v, null, 2)) });
