export default function addUser(map) {
  const $btnOpenSearch = document.querySelector('.nav-item.item-user');
  const $btnOpenResult = document.querySelector('.nav-item.item-map-location-result');
  const $sectionSearch = document.querySelector('.section-search');
  const $searchList = document.querySelector('.search-user-list');
  const $inputName = $sectionSearch.querySelector('.input-name');
  const $inputAddr = $sectionSearch.querySelector('.input-addr');

  const markers = [];

  const openSearchPopup = () => {
    $sectionSearch.classList.toggle('is-active');
  };

  const addParticipantsItem = ({ name, addr }) => {
    const li = document.createElement('li');
    const participant = document.createElement('strong');
    const address = document.createElement('p');

    participant.textContent = name;
    address.textContent = addr;

    li.appendChild(participant);
    li.appendChild(address);
    $searchList.appendChild(li);
  };

  const searchAddr = () => {
    if ($inputName.value.length === 0) {
      alert('참석자의 이름을 먼저 입력해주세요.');
      $inputName.focus();
      return;
    }

    const name = $inputName.value;
    var width = 400; //팝업의 너비
    var height = 500; //팝업의 높이
    new daum.Postcode({
      width: width,
      height: height,
      oncomplete: function (data) {
        // 포스트 코드 입력 후 주소를 지오코더로 변환한다
        const geocoder = new kakao.maps.services.Geocoder();
        const callback = function (result, status) {
          if (status === kakao.maps.services.Status.OK) {
            // 마커 생성
            const marker = new kakao.maps.Marker({
              map, // 마커를 표시할 지도
              position: new kakao.maps.LatLng(result[0].y, result[0].x), // 마커의 위치
            });

            const infoWindow = new kakao.maps.InfoWindow({
              content: `<div class='info-window' data-lng=${result[0].x} data-lat=${result[0].y}>${name}</div>`,
            });
            infoWindow.open(map, marker);

            // 지오코더로 변환 완료 후 (빈)배열에 푸쉬
            markers.push({
              position: new kakao.maps.LatLng(result[0].y, result[0].x),
            });

            // 이미지 지도의 중심좌표
            const bounds = new kakao.maps.LatLngBounds();
            markers.forEach(v => {
              bounds.extend(v.position);
            });
            map.setBounds(bounds);
          }
        };
        geocoder.addressSearch(data.address, callback);

        addParticipantsItem({ name, addr: data.address });
        $inputName.value = '';
        $inputAddr.value = '';

        if ($searchList.childElementCount > 1) {
          $btnOpenResult.classList.add('is-active');
        }
      },
    }).open({
      left: 500,
      top: 200,
    });
  };

  $btnOpenSearch.addEventListener('click', openSearchPopup);
  $inputAddr.addEventListener('click', searchAddr);
}
