export default function roadAdrr(){
    const btnAddParticipant = document.querySelector('.btn-add-participant')
    const btnCalcDistance = document.querySelector('.btn-calc-distance')

let lat = 0;
let lng = 0;
let center;

const markers =[];
btnAddParticipant.addEventListener('click',function (){
    new daum.Postcode({
        oncomplete: function(data) {
            // 포스트 코드 입력 후 주소를 지오코더로 변환한다
            var geocoder = new kakao.maps.services.Geocoder();
            
            var callback = function(result, status) {
                if (status === kakao.maps.services.Status.OK) {

                    lng = result[0].y;
                    lat = result[0].x;
                    // 지오코더로 변환 완료 후 (빈)배열에 푸쉬 
                    markers.push(
                        {
                            position: new kakao.maps.LatLng(lng, lat),
                        }
                    );
                    console.log(markers);
                }
                
            };
            geocoder.addressSearch(data.address, callback);
            
        }
        
    }).open();
})

btnCalcDistance.addEventListener('click',function(){
    const sectionResult = document.querySelector('.section-result');
    sectionResult.style.display = 'flex';

    // const markers = [
    //     {position: new kakao.maps.LatLng(37.5691888810787, 126.997678048457)},
    //     {position: new kakao.maps.LatLng(37.5259890959056, 126.697004110015)}
    // ]

    const staticMapContainer  = document.getElementById('staticMap'), // 이미지 지도를 표시할 div  
    staticMapOption = { 
        center: new kakao.maps.LatLng(37.5691888810787, 126.997678048457), // 이미지 지도의 중심좌표
        level: 3, // 이미지 지도의 확대 레벨
    };    

    // 이미지 지도 생성
    const staticMap = new kakao.maps.Map(staticMapContainer, staticMapOption);

    // 중간 좌표 구하기 (x1+x2)/2, (y1+y2)/2
    const position1 = markers[0].position.La
    const position2 = markers[0].position.Ma;
    const position3 = markers[1].position.La;
    const position4 = markers[1].position.Ma;

    const center_x = (position1+position3)/2;
    const center_y = (position2+position4)/2;

    center = new kakao.maps.LatLng( center_y, center_x);

    console.log(center);

    new kakao.maps.Marker({
        map: staticMap, // 마커를 표시할 지도
        position: center, // 마커의 위치
      });

    for (var i = 0; i < markers.length; i++) {
        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
          map: staticMap, // 마커를 표시할 지도
          position: markers[i].position, // 마커의 위치
        });
      }

    // 이미지 지도의 중심좌표
    let bounds = new kakao.maps.LatLngBounds();
    markers.forEach(v => {
        bounds.extend(v.position)
    })
    staticMap.setBounds(bounds);

    return center;
})




// const markers = [
//     {
//         position: new kakao.maps.LatLng(lng, lat),
//         text: '농담곰'
//     },
//     {
//         position: new kakao.maps.LatLng(33.450001, 126.570467), 
//         text: '메타몽' // text 옵션을 설정하면 마커 위에 텍스트를 함께 표시할 수 있습니다     
//     }
// ];

// const staticMapContainer  = document.getElementById('staticMap'), // 이미지 지도를 표시할 div  
//     staticMapOption = { 
//         center: new kakao.maps.LatLng(lng, lat), // 이미지 지도의 중심좌표
//         level: 3, // 이미지 지도의 확대 레벨
//         marker: markers // 이미지 지도에 표시할 마커 
//     };    

// // 이미지 지도를 생성합니다
// const staticMap = new kakao.maps.StaticMap(staticMapContainer, staticMapOption);
}

