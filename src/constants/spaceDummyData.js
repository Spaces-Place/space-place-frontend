// 공간 더미 데이터
const spaceDummyData = [
    {
      space_id: 1,
      vendor_id: "vendor_001",
      space_type: "PLAYING",
      name: "사운드웨이브 스튜디오",
      capacity: 8,
      space_size: "50평",
      usage_unit: "시간",
      unit_price: 35000,
      location: {
        sido: "서울특별시",
        address: "마포구 와우산로 서교동 123-45",
        type: "Point",
        coordinates: {
          latitude: 37.555123,
          longitude: 126.925678
        }
      },
      images: [
        { filename: "playing_studio1.jpg", original_filename: "studio_main.jpg" },
        { filename: "playing_studio2.jpg", original_filename: "studio_inside.jpg" },
        { filename: "playing_studio3.jpg", original_filename: "studio_equipment.jpg" }
      ],
      amenities: ["주차가능", "무선인터넷", "드럼셋", "기타앰프", "베이스앰프", "키보드", "마이크"],
      description: "전문 음향 장비를 갖춘 프리미엄 합주실",
      content: "최고급 방음시설과 전문 음향장비를 갖춘 프리미엄 합주실입니다. Marshall, Fender 앰프와 DW 드럼셋, Nord 키보드 구비.",
      operating_hours: [
        { day: "월", open: "10:00", close: "22:00" },
        { day: "화", open: "10:00", close: "22:00" },
        { day: "수", open: "10:00", close: "22:00" },
        { day: "목", open: "10:00", close: "22:00" },
        { day: "금", open: "10:00", close: "24:00" },
        { day: "토", open: "10:00", close: "24:00" },
        { day: "일", open: "10:00", close: "22:00" }
      ],
      created_at: "2024-01-15T09:00:00Z",
      is_operate: true
    },
    {
      space_id: 2,
      vendor_id: "vendor_002",
      space_type: "CAMPING",
      name: "숲속 글램핑 파크",
      capacity: 4,
      space_size: "20평",
      usage_unit: "일",
      unit_price: 150000,
      location: {
        sido: "강원도",
        address: "춘천시 남산면 글램핑로 456-78",
        type: "Point",
        coordinates: {
          latitude: 37.844567,
          longitude: 127.723456
        }
      },
      images: [
        { filename: "glamping1.jpg", original_filename: "camp_exterior.jpg" },
        { filename: "glamping2.jpg", original_filename: "camp_interior.jpg" },
        { filename: "glamping3.jpg", original_filename: "camp_night.jpg" }
      ],
      amenities: ["바베큐장", "화장실", "샤워실", "취사도구", "에어컨", "침구류", "주차장"],
      description: "프리미엄 글램핑 체험",
      content: "자연 속에서 즐기는 럭셔리한 글램핑 경험. 완벽한 캠핑 시설과 편안한 숙박 시설을 제공합니다.",
      operating_hours: [
        { day: "월", open: "15:00", close: "11:00" },
        { day: "화", open: "15:00", close: "11:00" },
        { day: "수", open: "15:00", close: "11:00" },
        { day: "목", open: "15:00", close: "11:00" },
        { day: "금", open: "15:00", close: "11:00" },
        { day: "토", open: "15:00", close: "11:00" },
        { day: "일", open: "15:00", close: "11:00" }
      ],
      created_at: "2024-02-01T10:30:00Z",
      is_operate: true
    },
    {
      space_id: 3,
      vendor_id: "vendor_003",
      space_type: "DANCE",
      name: "댄스메이트 스튜디오",
      capacity: 15,
      space_size: "30평",
      usage_unit: "시간",
      unit_price: 25000,
      location: {
        sido: "서울특별시",
        address: "강남구 역삼동 댄스로 789-10",
        type: "Point",
        coordinates: {
          latitude: 37.498123,
          longitude: 127.028456
        }
      },
      images: [
        { filename: "dance1.jpg", original_filename: "dance_main.jpg" },
        { filename: "dance2.jpg", original_filename: "dance_mirror.jpg" },
        { filename: "dance3.jpg", original_filename: "dance_floor.jpg" }
      ],
      amenities: ["전면거울", "음향시설", "냉난방", "탈의실", "샤워실", "정수기", "주차가능"],
      description: "넓은 공간의 프리미엄 댄스 연습실",
      content: "3면 전신거울과 최고급 음향시설을 갖춘 프리미엄 댄스 연습실입니다. 방음 시설 완비, 샤워실과 탈의실 구비.",
      operating_hours: [
        { day: "월", open: "09:00", close: "23:00" },
        { day: "화", open: "09:00", close: "23:00" },
        { day: "수", open: "09:00", close: "23:00" },
        { day: "목", open: "09:00", close: "23:00" },
        { day: "금", open: "09:00", close: "23:00" },
        { day: "토", open: "09:00", close: "23:00" },
        { day: "일", open: "09:00", close: "23:00" }
      ],
      created_at: "2024-01-20T11:15:00Z",
      is_operate: true
    },
    {
      space_id: 4,
      vendor_id: "vendor_004",
      space_type: "PARTY",
      name: "파티타임 라운지",
      capacity: 20,
      space_size: "40평",
      usage_unit: "시간",
      unit_price: 45000,
      location: {
        sido: "서울특별시",
        address: "홍대입구역 파티로 234-56",
        type: "Point",
        coordinates: {
          latitude: 37.557789,
          longitude: 126.923456
        }
      },
      images: [
        { filename: "party1.jpg", original_filename: "party_main.jpg" },
        { filename: "party2.jpg", original_filename: "party_inside.jpg" },
        { filename: "party3.jpg", original_filename: "party_light.jpg" }
      ],
      amenities: ["노래방기계", "DJ부스", "조명시설", "주방시설", "냉장고", "음향시설", "화장실"],
      description: "홍대입구역 파티룸",
      content: "최대 20인까지 수용 가능한 프라이빗 파티룸. 노래방 시설과 DJ 부스, 다양한 파티 조명을 갖추고 있습니다.",
      operating_hours: [
        { day: "월", open: "12:00", close: "24:00" },
        { day: "화", open: "12:00", close: "24:00" },
        { day: "수", open: "12:00", close: "24:00" },
        { day: "목", open: "12:00", close: "24:00" },
        { day: "금", open: "12:00", close: "02:00" },
        { day: "토", open: "12:00", close: "02:00" },
        { day: "일", open: "12:00", close: "24:00" }
      ],
      created_at: "2024-02-10T13:00:00Z",
      is_operate: true
    },
    {
      space_id: 5,
      vendor_id: "vendor_005",
      space_type: "STUDIO",
      name: "크리에이티브 스튜디오",
      capacity: 6,
      space_size: "25평",
      usage_unit: "시간",
      unit_price: 40000,
      location: {
        sido: "서울특별시",
        address: "성수동 창업로 567-89",
        type: "Point",
        coordinates: {
          latitude: 37.544567,
          longitude: 127.055678
        }
      },
      images: [
        { filename: "studio1.jpg", original_filename: "photo_main.jpg" },
        { filename: "studio2.jpg", original_filename: "photo_equipment.jpg" },
        { filename: "studio3.jpg", original_filename: "photo_light.jpg" }
      ],
      amenities: ["조명장비", "배경지", "촬영장비", "메이크업실", "탈의실", "와이파이", "주차가능"],
      description: "전문 사진 촬영 스튜디오",
      content: "다양한 프로페셔널 조명 장비와 배경지를 구비한 전문 사진 촬영 스튜디오입니다. 메이크업실과 탈의실 완비.",
      operating_hours: [
        { day: "월", open: "10:00", close: "22:00" },
        { day: "화", open: "10:00", close: "22:00" },
        { day: "수", open: "10:00", close: "22:00" },
        { day: "목", open: "10:00", close: "22:00" },
        { day: "금", open: "10:00", close: "22:00" },
        { day: "토", open: "10:00", close: "22:00" },
        { day: "일", open: "10:00", close: "22:00" }
      ],
      created_at: "2024-02-15T14:30:00Z",
      is_operate: true
    },
    {
      space_id: 6,
      vendor_id: "vendor_006",
      space_type: "PLAYING",
      name: "뮤직팩토리 스튜디오",
      capacity: 6,
      space_size: "45평",
      usage_unit: "시간",
      unit_price: 40000,
      location: {
        sido: "서울특별시",
        address: "송파구 잠실동 음악로 321-12",
        type: "Point",
        coordinates: {
          latitude: 37.513678,
          longitude: 127.085432
        }
      },
      images: [
        { filename: "playing_studio4.jpg", original_filename: "music_main.jpg" },
        { filename: "playing_studio5.jpg", original_filename: "music_room.jpg" },
        { filename: "playing_studio6.jpg", original_filename: "music_gear.jpg" }
      ],
      amenities: ["방음부스", "전문음향장비", "그랜드피아노", "드럼", "기타앰프", "녹음장비", "주차가능"],
      description: "프로페셔널 레코딩 스튜디오",
      content: "전문 녹음이 가능한 고급 음향 장비와 방음 시설을 갖춘 프리미엄 스튜디오입니다. Yamaha 그랜드피아노, Pearl 드럼셋 구비.",
      operating_hours: [
        { day: "월", open: "09:00", close: "23:00" },
        { day: "화", open: "09:00", close: "23:00" },
        { day: "수", open: "09:00", close: "23:00" },
        { day: "목", open: "09:00", close: "23:00" },
        { day: "금", open: "09:00", close: "23:00" },
        { day: "토", open: "10:00", close: "22:00" },
        { day: "일", open: "10:00", close: "22:00" }
      ],
      created_at: "2024-02-20T15:45:00Z",
      is_operate: true
    },
    {
      space_id: 7,
      vendor_id: "vendor_007",
      space_type: "CAMPING",
      name: "계곡뷰 캠핑장",
      capacity: 6,
      space_size: "30평",
      usage_unit: "일",
      unit_price: 180000,
      location: {
        sido: "경기도",
        address: "가평군 상면 캠핑로 789-10",
        type: "Point",
        coordinates: {
          latitude: 37.755432,
          longitude: 127.495678
        }
      },
      images: [
        { filename: "camping4.jpg", original_filename: "valley_main.jpg" },
        { filename: "camping5.jpg", original_filename: "valley_site.jpg" },
        { filename: "camping6.jpg", original_filename: "valley_view.jpg" }
      ],
      amenities: ["온수시설", "화장실", "샤워장", "전기", "바베큐장", "매점", "주차장"],
      description: "계곡 옆 프리미엄 캠핑장",
      content: "맑은 계곡물이 흐르는 자연 속 캠핑장. 온수 시설과 깨끗한 화장실, 샤워장을 완비했습니다. 사계절 이용 가능합니다.",
      operating_hours: [
        { day: "월", open: "14:00", close: "11:00" },
        { day: "화", open: "14:00", close: "11:00" },
        { day: "수", open: "14:00", close: "11:00" },
        { day: "목", open: "14:00", close: "11:00" },
        { day: "금", open: "14:00", close: "11:00" },
        { day: "토", open: "14:00", close: "11:00" },
        { day: "일", open: "14:00", close: "11:00" }
      ],
      created_at: "2024-02-25T16:30:00Z",
      is_operate: true
    },
    {
      space_id: 8,
      vendor_id: "vendor_008",
      space_type: "DANCE",
      name: "무브온 댄스홀",
      capacity: 20,
      space_size: "40평",
      usage_unit: "시간",
      unit_price: 30000,
      location: {
        sido: "서울특별시",
        address: "송파구 잠실동 댄스로 432-10",
        type: "Point",
        coordinates: {
          latitude: 37.512345,
          longitude: 127.084567
        }
      },
      images: [
        { filename: "dance4.jpg", original_filename: "moveon_main.jpg" },
        { filename: "dance5.jpg", original_filename: "moveon_floor.jpg" },
        { filename: "dance6.jpg", original_filename: "moveon_system.jpg" }
      ],
      amenities: ["우드플로어", "4면거울", "프로음향", "탈의실", "샤워실", "휴게실", "주차가능"],
      description: "프리미엄 댄스 연습실",
      content: "최고급 우드플로어와 4면 전신거울을 갖춘 넓은 연습실입니다. JBL 프로페셔널 음향 시스템 완비.",
      operating_hours: [
        { day: "월", open: "08:00", close: "24:00" },
        { day: "화", open: "08:00", close: "24:00" },
        { day: "수", open: "08:00", close: "24:00" },
        { day: "목", open: "08:00", close: "24:00" },
        { day: "금", open: "08:00", close: "24:00" },
        { day: "토", open: "09:00", close: "22:00" },
        { day: "일", open: "09:00", close: "22:00" }
      ],
      created_at: "2024-03-01T10:15:00Z",
      is_operate: true
    },
    {
      space_id: 9,
      vendor_id: "vendor_009",
      space_type: "PARTY",
      name: "루프탑 파티스페이스",
      capacity: 30,
      space_size: "60평",
      usage_unit: "시간",
      unit_price: 55000,
      location: {
        sido: "서울특별시",
        address: "강남구 청담동 파티로 567-89",
        type: "Point",
        coordinates: {
          latitude: 37.521234,
          longitude: 127.053456
        }
      },
      images: [
        { filename: "party4.jpg", original_filename: "rooftop_main.jpg" },
        { filename: "party5.jpg", original_filename: "rooftop_night.jpg" },
        { filename: "party6.jpg", original_filename: "rooftop_bar.jpg" }
      ],
      amenities: ["루프탑테라스", "바시설", "BBQ시설", "음향시설", "조명시설", "프로젝터", "엘리베이터"],
      description: "도심 속 루프탑 파티공간",
      content: "강남 전경이 내려다보이는 프리미엄 루프탑 파티공간. 프라이빗한 파티와 각종 이벤트에 최적화된 시설을 갖추고 있습니다.",
      operating_hours: [
        { day: "월", open: "11:00", close: "02:00" },
        { day: "화", open: "11:00", close: "02:00" },
        { day: "수", open: "11:00", close: "02:00" },
        { day: "목", open: "11:00", close: "02:00" },
        { day: "금", open: "11:00", close: "04:00" },
        { day: "토", open: "11:00", close: "04:00" },
        { day: "일", open: "11:00", close: "02:00" }
      ],
      created_at: "2024-03-05T11:30:00Z",
      is_operate: true
    },
    {
      space_id: 10,
      vendor_id: "vendor_010",
      space_type: "STUDIO",
      name: "아트비전 스튜디오",
      capacity: 8,
      space_size: "35평",
      usage_unit: "시간",
      unit_price: 45000,
      location: {
        sido: "서울특별시",
        address: "강남구 신사동 촬영로 890-12",
        type: "Point",
        coordinates: {
          latitude: 37.528901,
          longitude: 127.036789
        }
      },
      images: [
        { filename: "studio4.jpg", original_filename: "artvision_main.jpg" },
        { filename: "studio5.jpg", original_filename: "artvision_set.jpg" },
        { filename: "studio6.jpg", original_filename: "artvision_equipment.jpg" }
      ],
      amenities: ["인피니티월", "대형조명", "촬영장비", "분장실", "휴게실", "의상실", "주차가능"],
      description: "프리미엄 영상촬영 스튜디오",
      content: "최신 촬영 장비와 다양한 세트장을 갖춘 프로페셔널 촬영 스튜디오. 유튜브, 광고 촬영에 최적화된 공간입니다.",
      operating_hours: [
        { day: "월", open: "09:00", close: "22:00" },
        { day: "화", open: "09:00", close: "22:00" },
        { day: "수", open: "09:00", close: "22:00" },
        { day: "목", open: "09:00", close: "22:00" },
        { day: "금", open: "09:00", close: "22:00" },
        { day: "토", open: "10:00", close: "20:00" },
        { day: "일", open: "10:00", close: "20:00" }
      ],
      created_at: "2024-03-10T12:45:00Z",
      is_operate: true
    }
  ];
  
  export default spaceDummyData;