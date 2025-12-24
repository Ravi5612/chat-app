import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import ScrollContainer from '../components/ScrollContainer';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import ProfileStats from '../components/profile/ProfileStats';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
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
          upsert: true,
          contentType: file.type
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
    <ScrollContainer className="bg-gradient-to-b from-[#FFF5E6] to-white">
      <div className="max-w-4xl mx-auto p-4 md:p-6 pb-8">
        {/* Profile Edit Form */}
        <ProfileEditForm
          profile={profile}
          formData={formData}
          setFormData={setFormData}
          editing={editing}
          setEditing={setEditing}
          saving={saving}
          uploadingImage={uploadingImage}
          onSave={handleSave}
          onCancel={handleCancel}
          onImageUpload={handleImageUpload}
        />

        {/* Account Stats */}
        <ProfileStats />
      </div>
    </ScrollContainer>
  );
}