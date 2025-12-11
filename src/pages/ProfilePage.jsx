import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase/client';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    bio: '',
    avatar_url: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const fullProfile = {
        ...profileData,
        email: user.email
      };

      setProfile(fullProfile);
      setFormData({
        username: fullProfile.username || '',
        email: fullProfile.email || '',
        phone: fullProfile.phone || '',
        bio: fullProfile.bio || '',
        avatar_url: fullProfile.avatar_url || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploadingImage(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setFormData({ ...formData, avatar_url: publicUrl });
      await loadProfile();
      alert('Profile picture updated successfully! ✅');

    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          phone: formData.phone,
          bio: formData.bio,
          avatar_url: formData.avatar_url
        })
        .eq('id', user.id);

      if (error) throw error;

      alert('Profile updated successfully! ✅');
      setEditing(false);
      loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      username: profile.username || '',
      email: profile.email || '',
      phone: profile.phone || '',
      bio: profile.bio || '',
      avatar_url: profile.avatar_url || ''
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#FFF5E6] to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#F68537] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#FFF5E6] to-white">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.username || 'User'}&background=F68537&color=fff&size=200`}
                alt="Profile"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#F68537] shadow-lg object-cover"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="absolute bottom-0 right-0 bg-[#F68537] text-white p-3 rounded-full shadow-lg hover:bg-[#EAD8A4] hover:text-gray-800 transition-colors disabled:opacity-50"
                title="Upload profile picture from your device"
              >
                {uploadingImage ? '⏳' : '📷'}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {profile?.username || 'Unknown User'}
              </h1>
              <p className="text-gray-600 mb-4">{profile?.email}</p>
              
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-[#F68537] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#EAD8A4] hover:text-gray-800 transition-colors"
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            📷 Click the camera icon to select an image from your device (Max 5MB, JPG/PNG/GIF)
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
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
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-[#F68537] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#EAD8A4] hover:text-gray-800 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : '✓ Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  ✕ Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl shadow-md p-4 text-center border-2 border-blue-200">
            <div className="text-3xl font-bold text-blue-600">0</div>
            <div className="text-sm text-blue-800 mt-1">Friends</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center border-2 border-green-200">
            <div className="text-3xl font-bold text-green-600">0</div>
            <div className="text-sm text-green-800 mt-1">Messages</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center border-2 border-purple-200">
            <div className="text-3xl font-bold text-purple-600">0</div>
            <div className="text-sm text-purple-800 mt-1">Requests</div>
          </div>
        </div>
      </div>
    </main>
  );
}