// API 요청
export default async function init(page = 1) {
  let subwayData = [];
  const options = {
    page,
    perPage: 288,
    key: process.env.PUBLIC_KEY,
  };
  // const response = await fetch('src/data/openData.json');
  const response = await fetch(`https://api.odcloud.kr/api/15044231/v1/uddi:0f4be2a7-5b71-4d53-acf1-de4b6b8f6e5d?page=${options.page}&perPage=${options.perPage}&serviceKey=${options.key}`);
  const json = await response.json();

  for (const data of json.data) {
    const [위도, 경도] = await addressSearch(data['도로명주소']);
    subwayData.push({ ...data, 위도, 경도 });
  }

  return subwayData;
}

// 위도, 경도 가져오기
function addressSearch(address) {
  const geocoder = new kakao.maps.services.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.addressSearch(address, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const { x, y } = result[0];
        resolve([x, y]);
      } else {
        reject(status);
      }
    });
  });
}
