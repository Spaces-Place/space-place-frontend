import { IoIosMicrophone } from "react-icons/io";
import { FaCampground  } from "react-icons/fa";
import { IoVideocamSharp } from "react-icons/io5";
import { GiBandana, GiPartyPopper, GiGuitar  } from "react-icons/gi";
import { FaDumbbell } from "react-icons/fa6";
import { PiOfficeChairDuotone, PiCookingPotDuotone  } from "react-icons/pi";
import { MdHotel } from "react-icons/md";
import '../../styles/category.css'
import { FaBookOpenReader } from "react-icons/fa6";


// 카테고리별 아이템 매핑
const ItemType = [
    { type: 'PLAYING', title: "악기연주(합주실)", icon: <GiGuitar size={40} color="#000000" />, label:"악기연주(합주실)", isNew: true,to: "/space/playing" },
    { type: 'PARTY', title: '파티룸', icon: <GiPartyPopper size={40} color="#000000" />, label:"파티룸", to: "/space/party" },
    { type: 'DANCE', title: "댄스연습실", icon: <GiBandana size={40} color="#000000" />, label:"댄스연습실", to: "/space/dance" },
    { type: 'KARAOKE', title: "노래방", icon: <IoIosMicrophone size={40} color="#000000" />, label:"노래방", to: "/space/karaoke" },
    { type: 'STUDIO', title: "스튜디오", icon: <IoVideocamSharp size={40} color="#000000" />, label:"스튜디오", to: "/space/studio" },
    { type: 'CAMPING', title: "캠핑장", icon: <FaCampground size={40} color="#000000" />, label:"캠핑장", to: "/space/camping" },
    { type: 'gym', title: "헬스장", icon: <FaDumbbell size={40} color="#000000" />, label:"헬스장", to: "/space/gym" },
    { type: 'office', title: "사무실", icon: <PiOfficeChairDuotone size={40} color="#000000" />, label:"사무실",to: "/space/office" },
    { type: 'accommodation', title: "숙박", icon: <MdHotel size={40} color="#000000" />, label:"숙박",to: "/space/accommodation" },
    { type: 'kitchen', title: "공용주방", icon: <PiCookingPotDuotone size={40} color="#000000" />, label:"공용주방", to: "/space/kitchen" },
    { type: 'studyroom', title: "스터디룸", icon: <FaBookOpenReader size={40} color="#000000" />, label:"스터디룸",to: "/space/studyroom" }
  ];

  
  export default ItemType;