
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Footer from '../components/Footer';


export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
            {/* 1. Header with Logo, Name, Links (Home, About, Contact, Signup, Login) */}

            {/* 2. Hero Section: Content (Left) + Dynamic Screenshot (Right) */}
            <header className="flex-1 flex flex-col justify-center py-10 md:py-20 bg-gray-950 relative">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-2 items-center relative z-10 h-full">

                    {/* Left Content - Standard Alignment */}
                    <div className="text-center md:text-left flex flex-col items-center md:items-start order-2 md:order-1 md:ml-auto md:mr-8 max-w-lg">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-800/50 border border-gray-700 text-[#F68537] rounded-full text-sm font-bold mb-6 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-[#F68537] animate-pulse"></span>
                            The Next Gen of Communication
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-white tracking-tight">
                            Chat Like a <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F68537] to-[#FF4D4D] drop-shadow-sm">
                                True Warrior.
                            </span>
                        </h1>

                        <p className="text-lg text-gray-400 mb-8 leading-relaxed font-medium max-w-lg">
                            Break free from limits. Experience <span className="text-white font-bold">military-grade encryption</span>, <span className="text-white font-bold">instant real-time sync</span>, and <span className="text-white font-bold">zero latency</span>.
                            Dominate every conversation with speed.
                        </p>

                        {/* Key Benefits */}
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-8 text-sm font-semibold text-gray-300">
                            <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg shadow-sm border border-gray-800">
                                <span className="text-green-500">✓</span> No Fees
                            </div>
                            <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg shadow-sm border border-gray-800">
                                <span className="text-green-500">✓</span> Encrypted
                            </div>
                            <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg shadow-sm border border-gray-800">
                                <span className="text-green-500">✓</span> Open Source
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-8 py-3.5 bg-gradient-to-r from-[#F68537] to-[#FF4D4D] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-500/20 hover:scale-105 transition-all w-full sm:w-auto"
                            >
                                Start Chatting
                            </button>
                            <button
                                className="px-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold text-lg border border-gray-700 shadow-sm hover:border-[#F68537] hover:text-[#F68537] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                <span>▶</span> Demo
                            </button>
                        </div>
                    </div>

                    {/* Right Dynamic Screenshot Carousel - Fixed Visibility */}
                    <div className="relative flex justify-center items-center order-1 md:order-2 w-full min-h-[400px]">
                        {/* Glow Effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-orange-400/20 to-red-400/20 rounded-full blur-[80px]"></div>

                        {/* The Phone Component */}
                        <div className="z-20 w-full flex justify-center">
                            <MockScreenCarousel />
                        </div>
                    </div>

                </div>
            </header>


            {/* 3. Features Section (Cards) */}
            <section className="py-24 bg-gray-50 relative overflow-hidden">
                {/* Decorative Background Blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-200/20 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F68537] to-[#FF4D4D]">Chat Warrior?</span>
                        </h2>
                        <p className="text-gray-600 text-xl font-medium">We provide the tools you need to communicate effectively, securely, and instantly.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon="🔒"
                            title="End-to-End Encryption"
                            description="Your privacy is our priority. Messages are encrypted so only you and the receiver can read them."
                        />
                        <FeatureCard
                            icon="⚡"
                            title="Real-Time Sync"
                            description="Never miss a beat. Messages delivered instantly across all your devices with Supabase Realtime."
                        />
                        <FeatureCard
                            icon="📂"
                            title="File Sharing"
                            description="Share photos, videos, and documents with ease. Drag and drop file support included."
                        />
                        <FeatureCard
                            icon="🎨"
                            title="Modern UI/UX"
                            description="A clean, intuitive interface designed for the best user experience. Dark mode included."
                        />
                        <FeatureCard
                            icon="👥"
                            title="Group Chats"
                            description="Connect with multiple friends at once. Create groups and stay organized."
                        />
                        <FeatureCard
                            icon="🔔"
                            title="Smart Notifications"
                            description="Get notified only when it matters. Customize your notification preferences."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div >
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="p-8 rounded-[2rem] bg-white border border-orange-100 shadow-xl shadow-orange-100/20 hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
            {/* Hover Gradient Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F68537] to-[#FF4D4D] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-orange-50 text-[#F68537] group-hover:bg-white/20 group-hover:text-white transition-colors duration-500 shadow-sm backdrop-blur-sm">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-white transition-colors duration-500">{title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium group-hover:text-orange-50 transition-colors duration-500">{description}</p>
            </div>

            {/* Decorative Corner Icon for Hover */}
            <div className="absolute -bottom-4 -right-4 text-9xl opacity-0 group-hover:opacity-10 rotate-12 transition-all duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2 text-white pointer-events-none">
                {icon}
            </div>
        </div>
    );
}

/* --- Dynamic Carousel Component --- */
function MockScreenCarousel() {
    const [activeScreen, setActiveScreen] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveScreen((prev) => (prev + 1) % 3);
        }, 3000); // Change every 3 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-[300px] mx-auto"> {/* Reduced max-width to decrease overall size/height */}
            {/* iPhone Frame */}
            <div className="relative z-20 bg-gray-950 rounded-[3rem] p-2 shadow-2xl border-[6px] border-gray-800 aspect-[9/18] overflow-hidden ring-1 ring-white/20">

                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 bg-black h-7 w-28 rounded-b-2xl flex justify-center items-center">
                    <div className="w-16 h-4 bg-black rounded-full flex items-center justify-end gap-2 px-1">
                        <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                        <div className="w-2 h-2 bg-blue-900/50 rounded-full"></div>
                    </div>
                </div>

                {/* Dynamic Screen Content */}
                <div className="bg-white w-full h-full rounded-[2.5rem] overflow-hidden relative">
                    {/* Top Status Bar Placeholder */}
                    <div className="h-10 w-full bg-transparent absolute top-0 z-20 flex justify-between px-6 pt-3 items-start text-[10px] font-bold text-gray-800">
                        <span>9:41</span>
                        <div className="flex gap-1">
                            <span>📶</span>
                            <span>🔋</span>
                        </div>
                    </div>

                    {/* Screen 1: Chat List */}
                    <div className={`absolute inset-0 transition-opacity duration-700 ${activeScreen === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                        <div className="bg-[#F68537] h-28 p-5 text-white flex flex-col justify-end pt-12">
                            <h2 className="font-bold text-xl">Messages</h2>
                        </div>
                        <div className="p-3 space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex gap-3 items-center">
                                    <div className={`w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 ${i === 1 ? 'bg-blue-100' : ''}`}></div>
                                    <div className="flex-1">
                                        <div className="w-20 h-3 bg-gray-200 rounded mb-1.5"></div>
                                        <div className="w-12 h-2.5 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute bottom-5 right-5 w-12 h-12 bg-[#F68537] rounded-full flex items-center justify-center text-white shadow-lg text-xl">+</div>
                    </div>

                    {/* Screen 2: Chat Conversation */}
                    <div className={`absolute inset-0 transition-opacity duration-700 bg-gray-50 flex flex-col pt-10 ${activeScreen === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                        <div className="bg-white shadow-sm p-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100"></div>
                            <div className="w-24 h-3 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex-1 p-3 space-y-3">
                            <div className="flex justify-start">
                                <div className="bg-white p-2.5 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-xs text-gray-500">Hey! Chat Warrior looks slick!</div>
                            </div>
                            <div className="flex justify-end">
                                <div className="bg-[#F68537] p-2.5 rounded-2xl rounded-tr-none shadow-md max-w-[85%] text-xs text-white">Thanks! It's iPhone styled now. 😎</div>
                            </div>
                            <div className="flex justify-start">
                                <div className="bg-white p-2.5 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-xs text-gray-500">Love the dynamic island!</div>
                            </div>
                        </div>
                        <div className="p-3 bg-white border-t pb-6">
                            <div className="h-8 bg-gray-100 rounded-full"></div>
                        </div>
                    </div>

                    {/* Screen 3: User Profile */}
                    <div className={`absolute inset-0 transition-opacity duration-700 bg-white flex flex-col items-center pt-16 ${activeScreen === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                        <div className="w-20 h-20 bg-purple-100 rounded-full mb-4 border-4 border-white shadow-lg"></div>
                        <div className="w-32 h-5 bg-gray-200 rounded mb-2"></div>
                        <div className="w-20 h-3 bg-gray-100 rounded mb-6"></div>

                        <div className="w-full px-6 space-y-3">
                            <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
                                <div className="w-16 h-3 bg-gray-200 rounded"></div>
                                <div className="w-6 h-3 bg-gray-300 rounded"></div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
                                <div className="w-20 h-3 bg-gray-200 rounded"></div>
                                <div className="w-6 h-3 bg-gray-300 rounded"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Phone Shadow/Reflection */}
            <div className="absolute -bottom-6 left-8 right-8 h-6 bg-black/20 blur-xl rounded-full"></div>
        </div>
    );
}
