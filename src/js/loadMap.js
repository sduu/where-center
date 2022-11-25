const markers = [
    {
        position: new kakao.maps.LatLng(33.450701, 126.570667),
        text: '농담곰'
    },
    {
        position: new kakao.maps.LatLng(33.450001, 126.570467), 
        text: '메타몽' // text 옵션을 설정하면 마커 위에 텍스트를 함께 표시할 수 있습니다     
    }
];

const staticMapContainer  = document.getElementById('staticMap'), // 이미지 지도를 표시할 div  
    staticMapOption = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 이미지 지도의 중심좌표
        level: 3, // 이미지 지도의 확대 레벨
        marker: markers // 이미지 지도에 표시할 마커 
    };    

// 이미지 지도를 생성합니다
const staticMap = new kakao.maps.StaticMap(staticMapContainer, staticMapOption);