export default async function initMap() {
  const sectionResult = document.querySelector('.section-result');

  const staticMapContainer = document.getElementById('staticMap'), // 이미지 지도를 표시할 div
    staticMapOption = {
      center: new kakao.maps.LatLng(37.5691888810787, 126.997678048457), // 이미지 지도의 중심좌표
      level: 3, // 이미지 지도의 확대 레벨
    };

  // 이미지 지도 생성
  const staticMap = new kakao.maps.Map(staticMapContainer, staticMapOption);

  return staticMap;
}
