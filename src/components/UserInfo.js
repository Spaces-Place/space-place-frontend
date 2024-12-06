import React from "react";



const UserInfomation = ({userInfo, loading, error}) => {
  

  console.log(userInfo);

    if(loading) return <div>...로딩중</div>
    if (error) return <div className="error-message">{error}</div>;
    if (!userInfo) return null;

    return (
        <div className="userInfo">
          <h2 className="user-title">내 정보</h2>
          <div className="mypage-info-grid">
            <div className="userID-label">ID</div>
            <div className="userID-value">{userInfo.user_id}</div>
          </div>
          <div className="mypage-info-grid">
            <div className="userID-label">이름</div>
            <div className="userID-value">{userInfo.name}</div>
          </div>
          <div className="mypage-info-grid">
            <div className="userID-label">이메일</div>
            <div className="userID-value">{userInfo.email}</div>
          </div>
          <div className="mypage-info-grid">
            <div className="userID-label">연락처</div>
            <div className="userID-value">{userInfo.phone}</div>
          </div>
        </div>
      );
    };
    
    export default UserInfomation;