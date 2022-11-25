const $container = document.querySelector('.container');
const $resultList = $container.querySelector('.section-result .result-list');

let map;
let subwayData = [];
let filteredData = [];
let markers = [];
let customOverlays = [];

export default async function init(data) {
    subwayData = data;
    // map = await initMap();
    checkCircleRange();
    createListItem();
}

// 맵 초기화
const initMap = () => {
    const container = document.getElementById('map');
    const options = {
        center: new kakao.maps.LatLng(37.5571594835988, 126.972554606456),
        level: 2,
    };

    return new kakao.maps.Map(container, options);
};

// 좌표가 범위안에 포함되어있는지 체크 후 마커 표시
const checkCircleRange = () => {
    const options = {
        center: new kakao.maps.LatLng(37.5601594835988, 126.975554606456),
        radius: 700,
        strokeWeight: 5,
        strokeColor: '#75B8FA',
        strokeOpacity: 1,
        strokeStyle: 'dashed',
        fillColor: '#CFE7FF',
        fillOpacity: 0.7,
    };
    const circle = new kakao.maps.Circle(options);
    const center = circle.getPosition();
    const radius = circle.getRadius();
    const line = new kakao.maps.Polyline();

    // 원 그리기
    circle.setMap(map);

    subwayData.forEach(data => {
        // if (Math.pow(+target[0] - +data['위도'], 2) + Math.pow(+target[1] - +data['경도'], 2) < Math.pow(0.005, 2)) {console.log(true)};

        const {위도, 경도} = data;
        const position = new kakao.maps.LatLng(경도, 위도);

        // 마커의 위치와 원의 중심을 경로로 하는 폴리라인 생성
        line.setPath([position, center]);

        const dist = line.getLength();

        // 마커와 원의 중심 사이의 거리가 원의 반지름보다 작거나 같으면
        if (dist <= radius) {
            const marker = new kakao.maps.Marker({
                position,
                map,
            });

            createCustomOverlay(data);
            filteredData.push(data);

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
const createCustomOverlay = ({경도, 위도}) => {
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
const createModal = ({역명, 도로명주소, 역전화번호, 호선}) => {
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
