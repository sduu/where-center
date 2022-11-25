import requestData from './requestData.js';
import showStation from './showStation.js';

const data = await requestData();
showStation(data);
