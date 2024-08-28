import React, { useState } from "react";
import UserInfo from "./userInfo";

const UserProfile = ({ user }) => {
  const [showProfile, setShowProfile] = useState(false);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div>
      <button onClick={toggleProfile}>
        {showProfile ? "Hide Profile" : "Show Profile"}
      </button>
      {showProfile && <UserInfo user={user} />}
    </div>
  );
};

export default UserProfile;
