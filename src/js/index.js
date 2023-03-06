import './../style/reset.css';
import './../style/main.css';
import './../style/search.css';
import './../style/result.css';
import './../style/nav.css';

import loadMap from './loadMap.js';
import requestData from './requestData.js';
import addUser from './addUser';
import roadAdrr from './roadAdrr.js';

(async () => {
  const map = await loadMap();
  addUser(map);

  const data = await requestData();
  roadAdrr(data, map);
})();
