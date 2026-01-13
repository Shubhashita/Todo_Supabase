
import React from 'react';
import { FiUser, FiMenu } from 'react-icons/fi';

const HelpFeedback = ({ toggleSidebar }) => {
    return (
        <main className="flex-1 flex flex-col h-full relative bg-white/5 md:bg-white/10 backdrop-blur-2xl text-white font-sans overflow-hidden">
            {/* Header */}
            <div className="pt-4 px-4 md:pt-10 md:px-10 flex-shrink-0">
                <div className="flex items-center justify-between w-full md:w-[94%] mx-auto mb-4 md:mb-8">
                    <div className="flex items-center gap-3">
                        <button onClick={toggleSidebar} className="md:hidden text-white/90 p-2 hover:bg-white/10 rounded-full transition-colors">
                            <FiMenu size={22} />
                        </button>
                        <h1 className="text-2xl md:text-6xl font-black tracking-tighter text-white/90 uppercase">HELP</h1>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 bg-white/10 md:bg-transparent p-1.5 md:p-0 rounded-full pr-4 md:pr-0">
                        <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white shadow-lg cursor-pointer hover:bg-white/30 transition-all">
                            <FiUser size={24} className="md:hidden" />
                            <FiUser size={40} className="hidden md:block" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-20 [&::-webkit-scrollbar]:hidden scroll-smooth">
                <div className="w-full md:w-[94%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-3xl p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-black mb-6 border-b border-white/10 pb-4 uppercase tracking-wider">Frequently Asked Questions</h2>
                        <div className="space-y-6 md:space-y-10">
                            <div>
                                <h3 className="text-lg md:text-xl font-bold mb-2 text-white/90">How do I create a new note?</h3>
                                <p className="text-base md:text-lg text-white/60 leading-relaxed font-medium">Click the floating + button in the bottom right corner of the Notes page.</p>
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-bold mb-2 text-white/90">How do I archive a note?</h3>
                                <p className="text-base md:text-lg text-white/60 leading-relaxed font-medium">Click the three dots on a note card and select "Archive". You can find archived notes in the Archive tab.</p>
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-bold mb-2 text-white/90">Can I recover deleted notes?</h3>
                                <p className="text-base md:text-lg text-white/60 leading-relaxed font-medium">Yes! Deleted notes go to the Trash tab. You can restore them from there or delete them forever.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-3xl p-6 md:p-8 h-fit">
                        <h2 className="text-xl md:text-2xl font-black mb-6 border-b border-white/10 pb-4 uppercase tracking-wider">Send Feedback</h2>
                        <form className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="bg-white/10 border border-white/10 rounded-xl p-3 md:p-4 text-white placeholder-white/40 outline-none focus:bg-white/20 transition-all font-medium"
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="bg-white/10 border border-white/10 rounded-xl p-3 md:p-4 text-white placeholder-white/40 outline-none focus:bg-white/20 transition-all font-medium"
                            />
                            <textarea
                                placeholder="Describe your issue or suggestion..."
                                rows="3"
                                className="bg-white/10 border border-white/10 rounded-xl p-3 md:p-4 text-white placeholder-white/40 outline-none focus:bg-white/20 transition-all resize-none h-32 md:h-40 font-medium"
                            ></textarea>
                            <button className="bg-white text-[#89216b] font-black py-4 px-8 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl w-full md:w-auto self-start uppercase tracking-widest text-sm">
                                Submit Feedback
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default HelpFeedback;
