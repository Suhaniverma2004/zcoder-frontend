import React, { useState, useRef, useEffect } from 'react';
import ProfileForm from '../components/ProfileForm';
import UserInfoCard from '../components/UserInfoCard';
import Scorecard from '../components/Scorecard';
import NavButtons from '../components/NavButtons';
import { useAuth } from '../context/AuthContext';
import './Home.css';
import { mainApi } from '../api';

const Home = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  // 🛠️ Fetch latest profile from backend (optional but useful)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?._id) return;
      try {
        const response = await mainApi.get(`/api/users/${user._id}`);
        setProfileData({
          ...response.data,
          image: response.data.image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
          scoreData: {
            solved: response.data.solvedCount || 0,
            totalScore: response.data.totalScore || 0
          }
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchUserProfile();
  }, [user]);

  const handleProfileSave = async (formData) => {
    try {
      const response = await mainApi.put(`/api/users/${user._id}/profile`, formData);
      setProfileData(prev => ({
        ...prev,
        ...response.data,
        scoreData: {
          solved: response.data.solvedCount || 0,
          totalScore: response.data.totalScore || 0
        }
      }));
      updateUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert('Failed to save profile. Please check console.');
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, image: imageURL }));
    }
  };

  if (!profileData) {
    return <div className="page-container"><h2>Loading profile...</h2></div>;
  }

  return (
    <div className="page-container">
      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg"
      />

      {isEditing ? (
        <ProfileForm
          initialData={profileData}
          onSave={handleProfileSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="home-dashboard">
          <header className="home-header">
            <NavButtons />
          </header>
          <div className="home-content-grid">
            <div className="main-content">
              <Scorecard scoreData={profileData.scoreData} />
            </div>
            <aside className="right-sidebar">
              <UserInfoCard
                userData={profileData}
                onEdit={() => setIsEditing(true)}
                onImageClick={handleImageClick}
              />
            </aside>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
