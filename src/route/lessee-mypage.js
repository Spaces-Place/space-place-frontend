import { useState } from "react";
import MyCalendar from "./calender.js";
import '../css/mypage.css';

export default function LesseeMypage() {
    const [dropdownCalendars, setDropDownCalendars] = useState({});

    const plantData = [
        { title: '강릉농장', plant: '배추, 무, 당근, 감자' },
        { title: '서울농장', plant: '토마토, 상추' },
        { title: '강원도농장', plant: '배추, 감자, 고구마' },
        { title: '제주도', plant: '감귤, 천혜향' }
    ]

    const toggledDropCalendar = (title) => {
        setDropDownCalendars(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    return (
        <div className="Mypagebox">
            <div className="userInfo">
                <div className="userID">ID</div>
                <div className="userID">이름</div>
                <div className="userID">이메일</div>
            </div>
            <div className="myplant">
                <h2>내땅</h2>
                <div className="myplant_box">
                    {plantData.map((item, index) => (
                        <div
                            key={index}
                            className="plant_box_min"
                            onClick={()=>toggledDropCalendar(item.title)}>
                            <div className="plantboxheader">
                            <h2>{item.plant}</h2>
                            <h4>{item.title}</h4>
                            </div>
                            {dropdownCalendars[item.title] && (
                                <div className="myplant_box">
                                    <MyCalendar farmData={item} />
                                </div>)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}