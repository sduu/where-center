export default function roadAdrr(apiData, map) {
    const $container = document.querySelector('.container');
    const $listParticipants = $container.querySelector('.list-participants');
    const $resultList = $container.querySelector('.section-result .result-list');
    const $modal = document.querySelector('.modal');
    const $inputName = $modal.querySelector('.input-name');
    const $inputAddr = $modal.querySelector('.input-addr');
    const $btnClose = $modal.querySelector('.btn-close');
    const btnAddParticipant = document.querySelector('.btn-add-participant');
    const btnCalcDistance = document.querySelector('.btn-calc-distance');

    let lat = 0;
    let lng = 0;
    let center;

    const participants = [];
    const markers = [];
    let filteredData = [];
    let customOverlays = [];

    // btnAddParticipant.addEventListener('click', function () {});

    btnCalcDistance.addEventListener('click', calcDistance);

    $btnClose.addEventListener('click', addAddParticipant);
    $inputAddr.addEventListener('focus', searchAddr);

    function addParticipantsItem({ name, addr }) {
        const li = document.createElement('li');
        const participant = document.createElement('div');
        const address = document.createElement('div');

        participant.textContent = name;
        address.textContent = addr;

        li.appendChild(participant);
        li.appendChild(address);
        $listParticipants.appendChild(li);
    }

    function addAddParticipant() {
        const value = { name: $inputName.value, addr: $inputAddr.value };
        participants.push(value);
        $inputName.value = '';
        $inputAddr.value = '';

        addParticipantsItem(value);
    }

    function searchAddr(e) {
        const input = e.target;

        new daum.Postcode({
            oncomplete: function (data) {
                // 포스트 코드 입력 후 주소를 지오코더로 변환한다
                var geocoder = new kakao.maps.services.Geocoder();
                var callback = function (result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        lng = result[0].y;
                        lat = result[0].x;
                        // 지오코더로 변환 완료 후 (빈)배열에 푸쉬
                        markers.push({
                            position: new kakao.maps.LatLng(lng, lat),
                        });
                        console.log(markers);
                    }
                };
                geocoder.addressSearch(data.address, callback);

                input.value = data.address;
            },
        }).open();

        $btnClose.focus();
    }

    function calcDistance() {
        const sectionResult = document.querySelector('.section-result');
        sectionResult.classList.add('is-active');

        // const markers = [{position: new kakao.maps.LatLng(37.5691888810787, 126.997678048457)}, {position: new kakao.maps.LatLng(37.5259890959056, 126.697004110015)}];

        // 중간 좌표 구하기 (x1+x2)/2, (y1+y2)/2
        const position1 = markers[0].position.La;
        const position2 = markers[0].position.Ma;
        const position3 = markers[1].position.La;
        const position4 = markers[1].position.Ma;

        const center_x = (position1 + position3) / 2;
        const center_y = (position2 + position4) / 2;

        center = new kakao.maps.LatLng(center_y, center_x);

        new kakao.maps.Marker({
            map, // 마커를 표시할 지도
            position: center, // 마커의 위치
        });

        for (var i = 0; i < markers.length; i++) {
            // 마커를 생성합니다
            var marker = new kakao.maps.Marker({
                map, // 마커를 표시할 지도
                position: markers[i].position, // 마커의 위치
            });
        }

        // 이미지 지도의 중심좌표
        let bounds = new kakao.maps.LatLngBounds();
        markers.forEach(v => {
            bounds.extend(v.position);
        });
        map.setBounds(bounds);

        // 선 그리기 시작
        // 선을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 선을 표시합니다
        var linePath = [
            new kakao.maps.LatLng(position2, position1),
            new kakao.maps.LatLng(position4, position3),
            new kakao.maps.LatLng(center_y, center_x),
        ];

        // 지도에 표시할 선을 생성합니다
        var polyline = new kakao.maps.Polyline({
            path: linePath, // 선을 구성하는 좌표배열 입니다
            strokeWeight: 5, // 선의 두께 입니다
            strokeColor: '#FFAE00', // 선의 색깔입니다
            strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'solid', // 선의 스타일입니다
        });

        // 지도에 선을 표시합니다
        // 선 그리기 끝

        checkCircleRange();
        createListItem();
        polyline.setMap(map);
    }

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

            const { 위도, 경도 } = data;
            const position = new kakao.maps.LatLng(경도, 위도);

            // 마커의 위치와 원의 중심을 경로로 하는 폴리라인 생성
            line.setPath([position, circleCenter]);

            const dist = line.getLength();

            // 마커와 원의 중심 사이의 거리가 원의 반지름보다 작거나 같으면
            if (dist <= radius) {
                const marker = new kakao.maps.Marker({
                    position,
                    map,
                });

                createCustomOverlay(data);
                filteredData.push(data);

                console.log(filteredData);

                // 선 그리기
                // const polyline = new kakao.maps.Polyline({
                //     path: [position, center], // 선을 구성하는 좌표배열 입니다
                //     strokeWeight: 5, // 선의 두께 입니다
                //     strokeColor: '#75B8FA', // 선의 색깔입니다
                //     strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                //     strokeStyle: 'solid', // 선의 스타일입니다
                // });

                // polyline.setMap(map);
            }
        });
    };

    // 리스트 요소 생성
    const createListItem = () => {
        const $fragment = document.createDocumentFragment();

        filteredData.forEach((data, index) => {
            const $item = document.createElement('li');
            const $button = document.createElement('button');

            $button.type = 'button';
            $button.textContent = `${data.역명}역`;

            $item.appendChild($button);
            $fragment.appendChild($item);

            $button.addEventListener('click', () => listItemClickHandler(data));
        });

        $resultList.appendChild($fragment);
    };

    // 리스트 요소 클릭 핸들러
    const listItemClickHandler = index => {
        const $btns = $resultList.querySelectorAll('button');
        [...$btns].forEach(btn => btn.classList.remove('is-active'));
        event.currentTarget.classList.add('is-active');

        openModal(index);
    };

    // 인포윈도우 생성
    const createCustomOverlay = ({ 경도, 위도 }) => {
        const content = '<div class="info-window">유저</div>';
        const customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(경도, 위도),
            content,
            xAnchor: 0.3,
            yAnchor: 0.91,
            // removable: true,
        });

        customOverlays.push(customOverlay);
    };

    // 인포윈도우 열기
    const openOverlay = index => {
        // customOverlays.forEach(overlay => overlay.close());
        customOverlays.forEach(overlay => overlay.setMap(null));
        customOverlays[index].setMap(map);
    };

    // 인포윈도우 닫기
    const closeOverlay = overlay => {
        overlay.setMap(null);
    };

    // 모달 요소 생성
    const createModal = ({ 역명, 도로명주소, 역전화번호, 호선 }) => {
        const $aside = document.createElement('aside');
        const $title = document.createElement('h2');
        const $btnClose = document.createElement('button');

        $aside.classList.add('modal-detail');
        $title.classList.add('detail-title');
        $btnClose.classList.add('btn-close');
        $btnClose.type = 'button';
        $title.textContent = `${역명}역`;
        $btnClose.textContent = '닫기';

        const content = `
        <div class="detail-item is-transfer">
            <strong>환승역</strong>
            <ul>
                <li>${호선}호선</li>
            </ul>
        </div>

        <div class="detail-item is-address">
            <strong>도로명 주소</strong>
            <p>${도로명주소}</p>
        </div>

        <div class="detail-item is-phone">
            <strong>전화번호</strong>
            <p>${역전화번호}</p>
        </div>
    `;

        $aside.appendChild($title);
        $aside.innerHTML += content;
        $aside.appendChild($btnClose);

        $btnClose.addEventListener('click', () => closeModal($aside));

        return $aside;
    };

    // 모달 열기
    const openModal = data => {
        const $modal = $container.querySelector('.modal-detail');
        const $newModal = createModal(data);

        $modal?.remove();
        $container.querySelector('.section-result').appendChild($newModal);
        $newModal.classList.add('is-active');
    };

    // 모달 닫기
    const closeModal = modal => {
        modal.remove();
    };
}
