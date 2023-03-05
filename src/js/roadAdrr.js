export default function roadAdrr(apiData, map) {
  const $sectionSearch = document.querySelector('.section-search');
  const $sectionResult = document.querySelector('.section-result');
  const $resultList = $sectionResult.querySelector('.result-list');
  const $btnOpenResult = document.querySelector('.nav-item.item-map-location-result');
  const $searchList = document.querySelector('.search-user-list');

  let center;
  let filteredData = [];
  let customOverlays = [];

  const openSearchResult = () => {
    if ($searchList.childElementCount < 2) {
      alert('참석자를 2명 이상 추가해주세요');
      return;
    }

    $sectionSearch.classList.remove('is-active');
    $sectionResult.classList.add('is-active');
    calcDistance();
  };

  const expandSearchResult = () => {
    $sectionResult.classList.toggle('is-expanded');
  };

  const calcDistance = () => {
    const $infoWindows = document.querySelectorAll('.info-window');

    const markers = [...$infoWindows].map(info => {
      const lng = info.getAttribute('data-lng');
      const lat = info.getAttribute('data-lat');
      return { position: new kakao.maps.LatLng(lat, lng) };
    });

    // 중간 좌표 구하기 (x1+x2)/2, (y1+y2)/2
    const position1 = markers[0].position.La;
    const position2 = markers[0].position.Ma;
    const position3 = markers[1].position.La;
    const position4 = markers[1].position.Ma;

    const center_x = (position1 + position3) / 2;
    const center_y = (position2 + position4) / 2;

    center = new kakao.maps.LatLng(center_y, center_x);

    // 선을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 선을 표시합니다
    const linePath = [new kakao.maps.LatLng(position2, position1), new kakao.maps.LatLng(position4, position3), new kakao.maps.LatLng(center_y, center_x)];

    // 지도에 표시할 선을 생성합니다
    const polyline = new kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 5,
      strokeColor: '#FFAE00',
      strokeOpacity: 0.7,
      strokeStyle: 'solid',
    });

    polyline.setMap(map);
    checkCircleRange();
    createListItem();
  };

  // 좌표가 범위안에 포함되어있는지 체크 후 마커 표시
  const checkCircleRange = () => {
    const options = {
      center,
      radius: 2000,
      strokeWeight: 5,
      strokeColor: '#75B8FA',
      strokeOpacity: 1,
      strokeStyle: 'dashed',
      fillColor: '#CFE7FF',
      fillOpacity: 0.7,
    };
    const circle = new kakao.maps.Circle(options);
    const circleCenter = circle.getPosition();
    const radius = circle.getRadius();
    const line = new kakao.maps.Polyline();

    // 원 그리기
    circle.setMap(map);

    apiData.forEach(data => {
      // if (Math.pow(+target[0] - +data['위도'], 2) + Math.pow(+target[1] - +data['경도'], 2) < Math.pow(0.005, 2)) {console.log(true)};

      const { 역명, 위도, 경도 } = data;
      const position = new kakao.maps.LatLng(경도, 위도);

      // 마커의 위치와 원의 중심을 경로로 하는 폴리라인 생성
      line.setPath([position, circleCenter]);

      const dist = line.getLength();

      // 마커와 원의 중심 사이의 거리가 원의 반지름보다 작거나 같으면
      if (dist <= radius) {
        new kakao.maps.Marker({
          position,
          map,
        });

        createCustomOverlay(역명, 위도, 경도);
        filteredData.push(data);
      }
    });
  };

  // 리스트 요소 생성
  const createListItem = () => {
    const $fragment = document.createDocumentFragment();

    filteredData.forEach((data, index) => {
      const $item = document.createElement('li');
      const $button = document.createElement('button');
      const $thumb = document.createElement('span');
      const $textWrapper = document.createElement('div');
      const $title = document.createElement('strong');
      const $desc = document.createElement('p');

      $button.setAttribute('type', 'button');
      $title.textContent = `${data.역명}역`;
      $desc.textContent = `${data.호선}호선`;

      $textWrapper.appendChild($title);
      $textWrapper.appendChild($desc);
      $button.appendChild($thumb);
      $button.appendChild($textWrapper);
      $item.appendChild($button);
      $fragment.appendChild($item);

      $button.addEventListener('click', e => listItemClickHandler(e, index));
    });

    $resultList.appendChild($fragment);
  };

  // 리스트 요소 클릭 핸들러
  const listItemClickHandler = (e, index) => {
    e.stopPropagation();

    const $btns = $resultList.querySelectorAll('button');
    [...$btns].forEach(btn => btn.classList.remove('is-active'));
    e.currentTarget.classList.add('is-active');

    openOverlay(index);
  };

  // 인포윈도우 생성
  const createCustomOverlay = (역명, 위도, 경도) => {
    const content = `<div class="info-subway">${역명}</div>`;
    const customOverlay = new kakao.maps.InfoWindow({
      position: new kakao.maps.LatLng(경도, 위도),
      content,
    });

    customOverlays.push(customOverlay);
  };

  // 인포윈도우 열기
  const openOverlay = index => {
    customOverlays.forEach(overlay => overlay.setMap(null));
    customOverlays[index].setMap(map);
  };

  $btnOpenResult.addEventListener('click', openSearchResult);
  $sectionResult.addEventListener('click', expandSearchResult);
}
