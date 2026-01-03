import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-black text-white relative pt-16 pb-8 overflow-hidden">
            {/* Tricolor Border Top */}
            <div className="absolute top-0 left-0 w-full h-1.5 flex">
                <div className="w-1/3 h-full bg-[#FF9933]"></div> {/* Saffron */}
                <div className="w-1/3 h-full bg-white"></div>     {/* White */}
                <div className="w-1/3 h-full bg-[#138808]"></div> {/* Green */}
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-2 mb-2 group cursor-pointer">
                            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain brightness-0 invert group-hover:rotate-12 transition-transform duration-500" />
                            <span className="font-black text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] to-white">Chat Warrior</span>
                        </div>
                        <p className="text-gray-400 text-sm max-w-xs mb-6">
                            Apne Desh ka App. Privacy aur Security, ab hamare haath mein.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-4">
                            {/* Twitter / X */}
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#F68537] hover:bg-[#F68537] transition-all duration-300">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>

                            {/* Instagram */}
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#E1306C] hover:bg-[#E1306C] transition-all duration-300">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.407-.06 4.123-.06h.08zm-1.634 8.527a3.41 3.41 0 114.654 4.653 3.41 3.41 0 01-4.654-4.653zm1.14-1.143a5.016 5.016 0 107.091 7.091 5.016 5.016 0 00-7.091-7.091zM17.44 6.64a1.096 1.096 0 11-2.192 0 1.096 1.096 0 012.192 0z" clipRule="evenodd" />
                                </svg>
                            </a>

                            {/* LinkedIn */}
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#0077b5] hover:bg-[#0077b5] transition-all duration-300">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                </svg>
                            </a>

                            {/* Github */}
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#333] hover:bg-white/10 transition-all duration-300">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-8 text-sm font-medium text-gray-300 justify-center md:justify-end">
                        <a href="/" className="hover:text-white transition-colors relative group">
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                        </a>
                        <a href="/about" className="hover:text-[#FF9933] transition-colors relative group">
                            About (Hamare Baare Mein)
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF9933] transition-all group-hover:w-full"></span>
                        </a>
                        <a href="/contact" className="hover:text-white transition-colors relative group">
                            Contact (Sampark)
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                        </a>
                        <a href="#" className="hover:text-[#FF9933] transition-colors relative group">
                            Privacy Policy (Gopniyata)
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF9933] transition-all group-hover:w-full"></span>
                        </a>
                        <a href="#" className="hover:text-[#138808] transition-colors relative group">
                            Terms (Niyam)
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#138808] transition-all group-hover:w-full"></span>
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
                    <p>© 2026 Chat Warrior. Sab adhikar surakshit.</p>
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                            Made with <span className="text-red-500 animate-pulse">❤️</span> in India 🇮🇳
                        </span>
                    </div>
                </div>
            </div>

            {/* Background Map Effect (Subtle) */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[#FF9933]/10 to-transparent rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#138808]/10 to-transparent rounded-full blur-[80px] pointer-events-none"></div>
        </footer>
    );
}
