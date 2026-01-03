import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setMessage('Check your email for the password reset link.');
        } catch (error) {
            setError(error.message);
            console.error('Password reset error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#FFF5E6] to-white">
            <div className="bg-white px-6 py-6 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-6">
                    <img src="/logo.png" alt="Chat Warrior Logo" className="w-24 h-24 mx-auto mb-2 object-contain drop-shadow-lg" />
                    <h1 className="text-2xl font-bold text-[#F68537]">Forgot Password</h1>
                    <p className="text-gray-600 mt-1 text-sm">Enter your email to receive a reset link</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-lg mb-4 text-sm">
                        {message}
                    </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F68537]"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#F68537] text-white py-2 rounded-lg font-semibold hover:bg-[#EAD8A4] hover:text-gray-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-gray-500 hover:text-[#F68537] text-sm font-medium transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}
