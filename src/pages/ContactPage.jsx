import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';


export default function ContactPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
            {/* Same Navigation as other pages */}


            <main className="flex-grow relative">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100 rounded-full blur-[100px] pointer-events-none -z-10"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-50 rounded-full blur-[120px] pointer-events-none -z-10"></div>

                <div className="container mx-auto px-6 py-20 max-w-6xl">
                    <div className="text-center mb-16 animate-fade-in">
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
                            Sampark Karein <span className="text-[#F68537]">(Connect)</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Have questions or want to join the mission? We are listening.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Left: Contact Info */}
                        <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden animate-slide-right">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F68537] opacity-20 rounded-bl-[100px] pointer-events-none"></div>

                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <span className="text-[#F68537]">📍</span> Our Headquarters
                            </h2>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                                        🏢
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-200">Main Office</h3>
                                        <p className="text-gray-400">Cyber City, Gurugram<br />Haryana, India - 122002</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                                        ✉️
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-200">Email Us</h3>
                                        <p className="text-gray-400">namaste@chatwarrior.in</p>
                                        <p className="text-gray-500 text-sm">We reply within 24 hours.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                                        🤝
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-200">Join the Team</h3>
                                        <p className="text-gray-400">careers@chatwarrior.in</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-800">
                                <p className="text-sm text-gray-500 mb-4">Follow us for updates:</p>
                                <div className="flex gap-4">
                                    {/* Simplified Social Icons for this View */}
                                    <div className="w-10 h-10 bg-[#F68537] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">X</div>
                                    <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">In</div>
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">Li</div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Contact Form */}
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 animate-slide-up">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Sandesh</h2>
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Your Name (Naam)</label>
                                    <input
                                        type="text"
                                        placeholder="Ravi Kumar"
                                        className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#F68537] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="ravi@example.com"
                                        className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#F68537] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Message (Sandesh)</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Write your message here..."
                                        className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#F68537] focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    className="w-full py-4 bg-gradient-to-r from-[#F68537] to-[#FF4D4D] text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-400 hover:-translate-y-1 transition-all"
                                >
                                    Send Message 🚀
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
