import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';


/* --- Helper Hook for Scroll Animations --- */
function useIntersectionObserver(options = { threshold: 0.1 }) {
    const elementsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, options);

        elementsRef.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [options]);

    return (el) => {
        if (el && !elementsRef.current.includes(el)) {
            elementsRef.current.push(el);
        }
    };
}

export default function AboutPage() {
    const navigate = useNavigate();
    const addToRefs = useIntersectionObserver();

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col overflow-x-hidden">
            {/* Header/Nav - Now in RootLayout */}

            <main className="flex-grow">
                {/* 1. HERO SECTION - Full Height & Dynamic */}
                <header className="relative min-h-[90vh] flex items-center justify-center bg-gray-950 overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#F68537]/20 rounded-full blur-[120px] animate-float"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
                        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-orange-400/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '1s' }}></div>
                    </div>

                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>

                    <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                        <div className="inline-block px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-[#F68537] font-semibold text-sm mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            🚀 The Future of Secure Communication
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F68537] via-orange-400 to-[#FF4D4D]">India.</span><br />
                            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Privacy.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            We aren't just an app. We are a promise. A promise that <strong className="text-white">your data stays yours</strong>, and your sovereignty remains untouched.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                            <button onClick={() => navigate('/signup')} className="px-10 py-4 bg-gradient-to-r from-[#F68537] to-[#FF4D4D] text-white rounded-full font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all">
                                Join the Revolution
                            </button>
                            <a href="#story" className="px-10 py-4 bg-transparent border border-gray-700 text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                                Read Our Story <span>↓</span>
                            </a>
                        </div>
                    </div>
                </header>

                {/* 2. STATS / IMPACT BANNER */}
                <div className="bg-[#F68537] py-6 relative z-20 shadow-2xl">
                    <div className="container mx-auto px-6 flex flex-wrap justify-around items-center gap-8 text-white text-center">
                        <div ref={addToRefs} className="opacity-0">
                            <div className="text-4xl font-black mb-1">100%</div>
                            <div className="text-sm font-bold uppercase tracking-wider opacity-80">Indian Server</div>
                        </div>
                        <div ref={addToRefs} className="opacity-0 animation-delay-200">
                            <div className="text-4xl font-black mb-1">AES-256</div>
                            <div className="text-sm font-bold uppercase tracking-wider opacity-80">Encryption</div>
                        </div>
                        <div ref={addToRefs} className="opacity-0 animation-delay-400">
                            <div className="text-4xl font-black mb-1">Zero</div>
                            <div className="text-sm font-bold uppercase tracking-wider opacity-80">Data Tracking</div>
                        </div>
                    </div>
                </div>

                {/* 3. FOUNDER & STORY SECTION */}
                <section id="story" className="py-24 bg-white relative">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-50 to-transparent"></div>

                    <div className="container mx-auto px-6 max-w-6xl relative z-10">
                        <div className="flex flex-col md:flex-row gap-16 items-center">

                            {/* Image / Profile Card */}
                            <div className="w-full md:w-5/12 perspective-1000" ref={addToRefs}>
                                <div className="relative group transform transition-all duration-700 hover:rotate-y-12 hover:scale-105">
                                    <div className="absolute -inset-4 bg-gradient-to-r from-[#F68537] to-purple-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity"></div>
                                    <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl aspect-[3/4] flex items-center justify-center border border-gray-800">
                                        {/* Founder Placeholder */}
                                        <div className="text-center p-8">
                                            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner ring-4 ring-gray-800">
                                                👨‍💻
                                            </div>
                                            <h3 className="text-3xl font-bold text-white mb-2">Ravi Rai</h3>
                                            <p className="text-[#F68537] font-medium tracking-wide uppercase text-sm">Founder & Chief Architect</p>
                                            <div className="mt-8 flex justify-center gap-3">
                                                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="w-full md:w-7/12 space-y-8">
                                <div ref={addToRefs} className="opacity-0">
                                    <h4 className="text-[#F68537] font-bold uppercase tracking-widest mb-2">The Origin</h4>
                                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                                        Why did I build <br />
                                        <span className="relative z-10">
                                            Chat Warrior?
                                            <span className="absolute bottom-1 left-0 w-full h-3 bg-orange-200 -z-10 rounded-full"></span>
                                        </span>
                                    </h2>
                                </div>

                                <div ref={addToRefs} className="opacity-0 animation-delay-200 prose prose-lg text-gray-600">
                                    <p>
                                        Namaste, I am <strong>Ravi Rai</strong>. As a B.Tech graduate, I've always been fascinated by technology. But one day, a simple thought struck me hard:
                                    </p>
                                    <blockquote className="border-l-4 border-[#F68537] pl-4 italic text-xl text-gray-800 font-semibold my-6">
                                        "Every time we click 'Send', our data travels through servers we don't own, in countries we don't control."
                                    </blockquote>
                                    <p>
                                        This wasn't just about privacy; it was about <strong>National Security</strong>. From our personal chats to critical defense data, why should we rely on foreign entities?
                                    </p>
                                    <p>
                                        That day, <strong>Chat Warrior</strong> was born. It is my tribute to our nation. A platform painted in <strong>Bhagwa</strong>, symbolizing courage, sacrifice, and the strength of India. We are here to bring the control back home.
                                    </p>
                                </div>

                                <div ref={addToRefs} className="opacity-0 animation-delay-400 pt-4">
                                    <button className="flex items-center gap-3 text-[#F68537] font-bold text-lg hover:gap-5 transition-all group">
                                        Read Full Manifesto
                                        <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. MISSION & VALUES - 3D Cards */}
                <section className="py-24 bg-gray-50 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-200/40 to-red-200/40 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-16" ref={addToRefs}>
                            <h2 className="text-4xl font-black text-gray-900 mb-6">Our Core Values</h2>
                            <p className="text-gray-600 text-lg">Built on the pillars of Trust, Freedom, and Nationalism.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <ValueCard
                                icon="🇮🇳"
                                title="Aatmanirbhar"
                                desc="A true step towards digital self-reliance. We reduce dependency on foreign tech giants."
                                delay="0ms"
                                observer={addToRefs}
                            />
                            <ValueCard
                                icon="🛡️"
                                title="Sovereignty"
                                desc="Data localization is our priority. Your information never leaves Indian soil."
                                delay="200ms"
                                observer={addToRefs}
                            />
                            <ValueCard
                                icon="⚔️"
                                title="Warrior Spirit"
                                desc="Uncompromising security. We defend your privacy with military-grade protocols."
                                delay="400ms"
                                observer={addToRefs}
                            />
                        </div>
                    </div>
                </section>

                {/* 5. CALL TO ACTION */}
                <section className="py-24 bg-gray-900 relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F68537] to-transparent"></div>

                    <div className="container mx-auto px-6 relative z-10" ref={addToRefs}>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                            Ready to take back control?
                        </h2>
                        <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
                            Join millions of Indians shifting to a secure, indigenous platform. Be a Warrior today.
                        </p>
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-[#F68537] text-white text-xl font-bold px-12 py-5 rounded-2xl shadow-xl shadow-orange-600/20 hover:bg-[#ff7b24] hover:shadow-orange-600/40 hover:-translate-y-1 transition-all"
                        >
                            Download Chat Warrior
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

function ValueCard({ icon, title, desc, delay, observer }) {
    return (
        <div
            ref={observer}
            className="group bg-white p-10 rounded-[2.5rem] shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 opacity-0"
            style={{ transitionDelay: '0ms', animationDelay: delay }} // Only animate entrance with delay
        >
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-[#F68537] group-hover:text-white transition-colors duration-500 shadow-sm">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
                {desc}
            </p>
        </div>
    )
}
