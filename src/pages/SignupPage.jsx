import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Supabase signup
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        phone: phone, // Add phone
        options: {
          data: {
            name: name,
            phone: phone
          }
        }
      });

      if (error) throw error;

      // Update profile with all data
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            username: name,
            email: email,
            phone: phone
          });

        if (profileError) console.log('Profile update error:', profileError);
      }

      alert('Signup successful! Please check your email for verification.');
      navigate('/login');
      
    } catch (error) {
      setError(error.message);
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF5E6] to-white">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-[#F68537] rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">BK</span>
          </div>
          <h1 className="text-3xl font-bold text-[#F68537]">Baat-Kro</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F68537]"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F68537]"
              required
              disabled={loading}
            />
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F68537]"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password (min 6 characters)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F68537]"
              required
              minLength={6}
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F68537] text-white py-3 rounded-lg font-semibold hover:bg-[#EAD8A4] hover:text-gray-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')}
            className="text-[#F68537] font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}