import { useState } from "react";

const ProfileEdit = () => {
  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Profile</h2>
      <div className="flex justify-center items-center space-x-4">
        <button>History</button>
        <button>Edit Profile</button>
      </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
