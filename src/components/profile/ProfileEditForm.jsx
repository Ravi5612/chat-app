import { useRef } from 'react';
import Button from '../ui/Button';

export default function ProfileEditForm({ 
  profile, 
  formData, 
  setFormData, 
  editing, 
  setEditing, 
  saving, 
  uploadingImage,
  onSave, 
  onCancel,
  onImageUpload 
}) {
  const fileInputRef = useRef(null);

  return (
    <>
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.username || 'User'}&background=F68537&color=fff&size=200`}
              alt="Profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#F68537] shadow-lg object-cover"
            />
            
            {/* ✅ Using Button component for camera button */}
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              variant="primary"
              className="absolute bottom-0 right-0 !p-3 rounded-full shadow-lg"
              title="Upload profile picture from your device"
            >
              {uploadingImage ? '⏳' : '📷'}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
              onChange={onImageUpload}
              className="hidden"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              {profile?.username || 'Unknown User'}
            </h1>
            <p className="text-gray-600 mb-4">{profile?.email}</p>
            
            {!editing && (
              <Button 
                onClick={() => setEditing(true)}
                variant="primary"
                size="medium"
                icon="✏️"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          📷 Click the camera icon to select an image from your device (Max 5MB, JPG/PNG/GIF)
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Details</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Username</label>
            {editing ? (
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F68537]"
                placeholder="Enter username"
              />
            ) : (
              <p className="text-gray-800 text-lg">{profile?.username || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <p className="text-gray-800 text-lg flex items-center gap-2">
              📧 {profile?.email}
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Read-only</span>
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            {editing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F68537]"
                placeholder="Enter phone number"
              />
            ) : (
              <p className="text-gray-800 text-lg">📞 {profile?.phone || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Bio</label>
            {editing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F68537] h-32 resize-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-800 text-lg">{profile?.bio || 'No bio yet'}</p>
            )}
          </div>

          {editing && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={onSave}
                disabled={saving}
                variant="primary"
                size="large"
                icon="✓"
                className="flex-1"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                onClick={onCancel}
                disabled={saving}
                variant="secondary"
                size="large"
                icon="✕"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}