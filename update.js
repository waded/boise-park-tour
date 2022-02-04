import fetch from "node-fetch";
import { parse } from "csv-parse/sync";

const toCoord = (numericString) => Number.parseFloat(numericString).toFixed(4);

const downloadCityDataToJson = async () => {
  // https://city-of-boise.opendata.arcgis.com/datasets/parks-and-recreation-managed-parks-and-reserves-point/data?orderBy=ParkID
  const url =
    "https://opendata.arcgis.com/datasets/a0499e28888a44548c52d6e9a2d21b48_0.csv";

  const response = await fetch(url);
  const csv = await response.text();
  var parsed = parse(csv, { columns: true, bom: true });
  return parsed
    .map((v) => {
      return {
        // e.g. Sue Howell Park has no ParkID
        id: v["ParkID"].length > 0 ? v["ParkID"] : v["Site_Name"],
        lat: toCoord(v["Y"]),
        long: toCoord(v["X"]),
        name: v["Site_Name"],
        type: v["Park_Type"],
        park_status: v["Park_Status"],
        dev_status: v["Development_Status"],
        address: v["Address"],
        linkId: v["Park_Link"],
      };
    })
    .sort((a, b) => {
      return a.id - b.id;
    });
};

downloadCityDataToJson().then((v) => {
  console.log(JSON.stringify(v, null, 2));
});
