import './../style/reset.css';
import './../style/style.css';
import roadAdrr from "./roadAdrr.js";
import requestData from "./requestData.js";
import loadMap from "./loadMap.js";

(async () => {
  const data = await requestData();
  const map = await loadMap();

  roadAdrr(data, map);
})();

