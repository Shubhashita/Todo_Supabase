import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiPhone, FiMapPin, FiTrash2, FiEdit2, FiMoon, FiMonitor, FiArrowDown, FiArrowUp, FiMenu, FiLogOut } from 'react-icons/fi';
import { BsToggleOn, BsToggleOff } from 'react-icons/bs';

const Settings = ({ settings, setSettings, toggleSidebar }) => {
    // Local state for profile
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : {
            name: 'Guest User',
            email: 'guest@example.com'
        };
    });
    const [isEditingName, setIsEditingName] = useState(false);
    const navigate = useNavigate();
    const [newName, setNewName] = useState(user.name);
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const response = await axios.get(`${API_BASE_URL}/user/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    const profile = response.data.data;
                    setUser(profile);
                    setNewName(profile.name);
                    // Update local storage to keep in sync
                    localStorage.setItem('user', JSON.stringify(profile));
                }
            } catch (e) {
                console.error("Failed to fetch profile", e);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateName = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`${API_BASE_URL}/user/update`, { name: newName }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const updatedUser = { ...user, name: newName };
                setUser(updatedUser);
                setIsEditingName(false);
                localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist update
            }
        } catch (error) {
            console.error("Failed to update name", error);
        }
    };

    const toggleNewNotePosition = () => {
        setSettings(prev => ({ ...prev, addNewAtBottom: !prev.addNewAtBottom }));
    };

    const toggleTheme = () => {
        // Just toggling state for now, logic to apply theme would be global
        setSettings(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'system' : 'dark' }));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <main className="flex-1 flex flex-col h-full relative bg-white/5 md:bg-white/10 backdrop-blur-2xl text-white font-poppins overflow-hidden">
            {/* Header */}
            <div className="pt-4 px-4 md:pt-10 md:px-10 flex-shrink-0">
                <div className="flex items-center justify-between w-full md:w-[94%] mx-auto mb-4 md:mb-8">
                    <div className="flex items-center gap-3">
                        <button onClick={toggleSidebar} className="md:hidden text-white/90 p-2 hover:bg-white/10 rounded-full transition-colors">
                            <FiMenu size={22} />
                        </button>
                        <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-white/90 uppercase">SETTINGS</h1>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-20 [&::-webkit-scrollbar]:hidden scroll-smooth">
                <div className="w-full md:w-[94%] mx-auto flex flex-col gap-6 md:gap-10 pb-20">

                    {/* Profile Section */}
                    <section className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-3xl p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-black mb-6 border-b border-white/10 pb-4 uppercase tracking-wider">Profile</h2>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                            {/* Profile Picture (Left) */}
                            <div className="relative group cursor-pointer self-center md:self-start">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center overflow-hidden transition-all group-hover:border-white/60">
                                    <FiUser size={48} className="text-white/80 md:hidden" />
                                    <FiUser size={64} className="text-white/80 hidden md:block" />
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs font-bold uppercase tracking-wider">Update</span>
                                </div>
                            </div>

                            {/* User Info (Right) */}
                            <div className="flex-1 w-full relative">
                                {isEditingName ? (
                                    <div className="flex items-center gap-3 mb-2">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-lg md:text-xl font-bold outline-none text-white w-full max-w-sm"
                                            autoFocus
                                        />
                                        <button onClick={handleUpdateName} className="text-sm bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">Save</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 mb-1 justify-center md:justify-start">
                                        <h3 className="text-2xl md:text-4xl font-black">{user.name}</h3>
                                        <FiEdit2
                                            className="cursor-pointer text-white/50 hover:text-white transition-colors"
                                            size={20}
                                            onClick={() => setIsEditingName(true)}
                                        />
                                    </div>
                                )}
                                <p className="text-base md:text-lg text-white/60 mb-6 text-center md:text-left">{user.email}</p>

                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <button className="flex items-center gap-2 bg-red-500/20 text-red-200 px-5 py-3 rounded-xl hover:bg-red-500/30 transition-colors border border-red-500/30">
                                        <FiTrash2 /> Delete Account
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 bg-white/10 text-white px-5 py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                                    >
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-white/10 w-full"></div>

                    {/* Display Options Section */}
                    <section className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-3xl p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-black mb-6 border-b border-white/10 pb-4 uppercase tracking-wider">Display Options</h2>
                        <div className="flex flex-col gap-6">

                            {/* Add Item Position Toggle */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {settings.addNewAtBottom ? <FiArrowDown size={24} className="text-white/70" /> : <FiArrowUp size={24} className="text-white/70" />}
                                    <div>
                                        <h3 className="text-xl font-medium">Add new item to bottom</h3>
                                        <p className="text-sm text-white/50">
                                            {settings.addNewAtBottom ? 'New items will appear at the end of the list' : 'New items will appear at the start of the list'}
                                        </p>
                                    </div>
                                </div>
                                <div onClick={toggleNewNotePosition} className="cursor-pointer text-white/80 hover:text-white transition-colors">
                                    {settings.addNewAtBottom ? <BsToggleOn size={40} /> : <BsToggleOff size={40} />}
                                </div>
                            </div>

                            {/* Theme Toggle */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {settings.theme === 'dark' ? <FiMoon size={24} className="text-white/70" /> : <FiMonitor size={24} className="text-white/70" />}
                                    <div>
                                        <h3 className="text-xl font-medium">App Theme</h3>
                                        <p className="text-sm text-white/50">
                                            {settings.theme === 'dark' ? 'Dark Mode' : 'System Default (Current Red Gradient)'}
                                        </p>
                                    </div>
                                </div>
                                <div onClick={toggleTheme} className="cursor-pointer text-white/80 hover:text-white transition-colors">
                                    {settings.theme === 'dark' ? <BsToggleOn size={40} /> : <BsToggleOff size={40} />}
                                </div>
                            </div>

                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
};

export default Settings;
