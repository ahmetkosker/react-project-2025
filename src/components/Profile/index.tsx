import type { UserInstance } from "../../models/user";
import AuthSession from "../../utils/session";
import "../profileCalendar.scss";

type ProfileCardProps = {
    profile: UserInstance;
};

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const getRoleDisplay = () => {
    if (profile && profile.role) {
      return profile.role.name;
    }
    
    const roleId = AuthSession.getRoles();
    if (roleId) {
      const roleMap: {[key: string]: string} = {
        "1": "Admin",
        "2": "Manager",
        "3": "Staff"
      };
      return roleMap[roleId] || "User";
    }
    
    return "Loading...";
  };

  return (
    <div className="profile-section">
      <div className="profile-avatar">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="#19979c" 
          width="48" 
          height="48"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
      </div>
      <div className="profile-info">
        <h2>{profile?.name || "Loading..."}</h2>
        <p><strong>Role:</strong> {getRoleDisplay()}</p>
        {profile?.email && <p><strong>Email:</strong> {profile.email}</p>}
        {profile?.phoneNumber && <p><strong>Phone:</strong> {profile.phoneNumber}</p>}
      </div>
    </div>
  );
};

export default ProfileCard;