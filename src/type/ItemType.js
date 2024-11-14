import { IoIosMicrophone } from "react-icons/io";
import { FaCampground  } from "react-icons/fa";
import { IoVideocamSharp } from "react-icons/io5";
import { GiBandana, GiPartyPopper, GiGuitar  } from "react-icons/gi";
import { FaDumbbell } from "react-icons/fa6";
import { PiOfficeChairDuotone, PiCookingPotDuotone  } from "react-icons/pi";
import { MdHotel } from "react-icons/md";
import '../css/category.css'
import { FaBookOpenReader } from "react-icons/fa6";


// 카테고리별 아이템 매핑
const ItemType = [
    { type: 'playing', title: "악기연주(합주실)", icon: <GiGuitar size={40} color="#000000" />, label:"악기연주(합주실)", isNew: true,to: "/rehearsal" },
    { type: 'party', title: '파티룸', icon: <GiPartyPopper size={40} color="#000000" />, label:"파티룸", to: "/party" },
    { type: 'dance', title: "댄스연습실", icon: <GiBandana size={40} color="#000000" />, label:"댄스연습실", to: "/dance" },
    { type: 'karaoke', title: "노래방", icon: <IoIosMicrophone size={40} color="#000000" />, label:"노래방", to: "/karaoke" },
    { type: 'studio', title: "스튜디오", icon: <IoVideocamSharp size={40} color="#000000" />, label:"스튜디오", to: "/studio" },
    { type: 'camping', title: "캠핑장", icon: <FaCampground size={40} color="#000000" />, label:"캠핑장", to: "/camping" },
    { type: 'gym', title: "헬스장", icon: <FaDumbbell size={40} color="#000000" />, label:"헬스장", to: "/gym" },
    { type: 'office', title: "사무실", icon: <PiOfficeChairDuotone size={40} color="#000000" />, label:"사무실",to: "/office" },
    { type: 'accommodation', title: "숙박", icon: <MdHotel size={40} color="#000000" />, label:"숙박",to: "/accommodation" },
    { type: 'kitchen', title: "공용주방", icon: <PiCookingPotDuotone size={40} color="#000000" />, label:"공용주방", to: "/kitchen" },
    { type: 'studyroom', title: "스터디룸", icon: <FaBookOpenReader size={40} color="#000000" />, label:"스터디룸",to: "/studyroom" }
  ];

  
  export default ItemType;