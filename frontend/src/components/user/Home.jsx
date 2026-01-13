import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import Notes from './Notes';
import Archive from './Archive';
import Trash from './Trash';
import Labels from './Labels';
import HelpFeedback from './HelpFeedback';
import Settings from './Settings';

const Home = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [activeView, setActiveView] = useState('notes');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterDate, setFilterDate] = useState({ start: null, end: null });
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('appSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            addNewAtBottom: false,
            theme: 'system'
        };
    });

    // Save settings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('appSettings', JSON.stringify(settings));
    }, [settings]);

    const [labels, setLabels] = useState([]);
    const [dbLabels, setDbLabels] = useState([]);
    const [noteLabels, setNoteLabels] = useState([]);
    const [selectedLabel, setSelectedLabel] = useState(null);

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    // Dynamic API URL: Use localhost if on localhost
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_BASE_URL = isLocalhost ? 'http://localhost:5000' : (process.env.REACT_APP_API_URL || 'https://todo-supabase-1.onrender.com');

    const fetchNotes = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/todo/list`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                const mappedNotes = response.data.data.map(todo => {
                    const id = todo.id || todo._id;
                    return {
                        id: id,
                        title: todo.title,
                        content: Array.isArray(todo.description) ? todo.description.join('\n') : (todo.description || ''),
                        isPinned: Boolean(todo.is_pinned || todo.isPinned),
                        isArchived: Boolean(todo.is_archived || todo.isArchived),
                        isTrashed: todo.status === 'bin',
                        labels: todo.labels ? [...new Set(todo.labels.map(l => l.name || l))] : [],
                        status: todo.status === 'in-progress' ? 'inProgress' : (todo.status === 'completed' ? 'completed' : 'open'),
                        createdAt: todo.created_at || todo.createdAt || new Date().toISOString()
                    };
                });

                setNotes(mappedNotes);

                // Extract unique labels from active notes only (exclude trash)
                const activeNotesForLabels = mappedNotes.filter(n => !n.isTrashed);
                const uniqueNoteLabels = [...new Set(activeNotesForLabels.flatMap(note => note.labels))];
                setNoteLabels(uniqueNoteLabels);
            }
        } catch (err) {
            console.error("Failed to fetch notes", err);
            if (err.response && err.response.status === 401) {
                navigate('/');
            }
        }
    };

    const fetchLabels = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await axios.get(`${API_BASE_URL}/label/list`, getAuthHeader());
            if (response.data.success) {
                setDbLabels(response.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch labels", err);
        }
    };

    // Merge DB labels and Note labels
    useEffect(() => {
        const dbLabelNames = new Set(dbLabels.map(l => l.name));
        // Filter out note labels that already exist in DB labels
        const uniqueNoteOnlyLabels = noteLabels.filter(l => !dbLabelNames.has(l));
        // Combine: DB labels (objects) + Note labels (strings)
        // This ensures DB labels take precedence (keeping their IDs)
        setLabels([...dbLabels, ...uniqueNoteOnlyLabels]);
    }, [dbLabels, noteLabels]);

    useEffect(() => {
        fetchNotes();
        fetchLabels();
    }, [navigate]);

    // --- API Handlers ---

    const handleCreate = async (noteObject) => {
        try {
            const headers = getAuthHeader().headers;
            const payload = {
                title: noteObject.title || 'Untitled',
                description: noteObject.content ? noteObject.content.split('\n') : [],
                status: 'open',
                isPinned: noteObject.isPinned || false,
                isArchived: noteObject.isArchived || false
            };

            const response = await axios.post(`${API_BASE_URL}/todo/create`, payload, { headers });
            fetchNotes();
            return response.data;
        } catch (error) {
            console.error("Error creating note:", error);
            throw error;
        }
    };

    const handleUpdate = async (updatedNote) => {
        try {
            const headers = getAuthHeader().headers;

            // Map label names to IDs
            const labelIds = await Promise.all((updatedNote.labels || []).map(async (name) => {
                const labelObj = labels.find(l => (l.name === name || l === name));
                const labelId = labelObj?.id || labelObj?._id;
                if (labelId) return labelId;
                // Create new label if it doesn't exist
                const newLabel = await handleCreateLabel(name);
                return newLabel ? (newLabel.id || newLabel._id) : null;
            }));

            const validLabelIds = labelIds.filter(id => id);

            const payload = {
                title: updatedNote.title || 'Untitled',
                description: updatedNote.content ? updatedNote.content.split('\n') : [],
                status: updatedNote.isTrashed ? 'bin' : (updatedNote.status === 'inProgress' ? 'in-progress' : (updatedNote.status === 'completed' ? 'completed' : 'open')),
                isPinned: updatedNote.isPinned,
                isArchived: updatedNote.isArchived,
                labels: validLabelIds
            };

            await axios.put(`${API_BASE_URL}/todo/update/${updatedNote.id}`, payload, { headers });
            await fetchNotes();
        } catch (error) {
            console.error("Error updating note:", error);
        }
    };

    const handleDelete = async (id, action = 'bin') => {
        try {
            await axios.delete(`${API_BASE_URL}/todo/delete/${id}?action=${action}`, getAuthHeader());
            fetchNotes();
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const handleArchive = async (id, archiveStatus) => {
        try {
            await axios.put(`${API_BASE_URL}/todo/update/${id}`, { isArchived: archiveStatus }, getAuthHeader());
            fetchNotes();
        } catch (error) {
            console.error("Error archiving note:", error);
        }
    };

    const handlePin = async (id, pinStatus) => {
        try {
            await axios.put(`${API_BASE_URL}/todo/update/${id}`, { isPinned: pinStatus }, getAuthHeader());
            fetchNotes();
        } catch (error) {
            console.error("Error pinning note:", error);
        }
    };

    // --- Label Handlers ---
    const handleCreateLabel = async (name) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/label/create`, { name }, getAuthHeader());
            await fetchLabels();
            return response.data.data;
        } catch (error) {
            console.error("Error creating label:", error.response?.data?.message || error.message);
            return null;
        }
    };

    const handleUpdateLabel = async (id, name) => {
        const isValidId = typeof id === 'string' && (id.length === 24 || id.length === 36);
        const newName = name.trim();
        if (!newName) return;

        try {
            if (isValidId) {
                await axios.put(`${API_BASE_URL}/label/update/${id}`, { name: newName }, getAuthHeader());
            } else {
                // Legacy Label Rename: find by name
                const targetLabel = labels.find(l => (l.id || l._id) === id);
                const targetLabelName = targetLabel?.name || targetLabel;

                if (targetLabelName) {
                    const notesToUpdate = notes.filter(n => n.labels.includes(targetLabelName));
                    for (const note of notesToUpdate) {
                        const newLabels = note.labels.map(l => l === targetLabelName ? newName : l);
                        await handleUpdate({ ...note, labels: newLabels });
                    }
                }
            }
            await fetchLabels();
            fetchNotes();
        } catch (error) {
            console.error("Error updating label:", error.response?.data?.message || error.message);
        }
    };

    const handleDeleteLabel = async (id, name) => {
        const isValidId = typeof id === 'string' && (id.length === 24 || id.length === 36);

        try {
            // Optimistic UI Update
            setLabels(prev => prev.filter(l => (l.id && l.id !== id) || (l._id && l._id !== id) || (l.name || l) !== name));

            setNotes(prevNotes => prevNotes.map(note => ({
                ...note,
                labels: note.labels.filter(l => l !== name)
            })));

            if (isValidId) {
                await axios.delete(`${API_BASE_URL}/label/delete/${id}`, getAuthHeader());
            }

            const notesToUnlabel = notes.filter(n => !n.isTrashed && n.labels.includes(name));

            await Promise.all(notesToUnlabel.map(note => {
                const newLabels = note.labels.filter(l => l !== name);
                return handleUpdate({ ...note, labels: newLabels });
            }));

            fetchLabels();
            fetchNotes();

            if (activeView === 'label' && selectedLabel === name) {
                setSelectedLabel(null);
                setActiveView('notes');
            }
        } catch (error) {
            console.error("Error deleting label:", error.response?.data?.message || error.message);
        }
    };

    // Filter Logic
    const filteredNotes = notes.filter(n => {
        const matchesSearch = (n.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (n.content || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleViewChange = (view) => {
        setActiveView(view);
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const renderView = () => {
        const commonProps = {
            notes: filteredNotes,
            setNotes: setNotes,
            onUpdate: handleUpdate,
            onCreate: handleCreate,
            onDelete: handleDelete,
            onArchive: handleArchive,
            onPin: handlePin,
            settings,
            labels,
            setLabels,
            onCreateLabel: handleCreateLabel,
            selectedLabel,
            setSelectedLabel,
            toggleSidebar,
            onSearch: setSearchQuery
        };

        switch (activeView) {
            case 'notes':
                return <Notes {...commonProps} filterStatus={filterStatus} filterDate={filterDate} />;
            case 'archive':
                return <Archive {...commonProps} />;
            case 'trash':
                return <Trash {...commonProps} />;
            case 'label':
                return <Labels
                    notes={notes}
                    setNotes={setNotes}
                    labels={labels}
                    setLabels={setLabels}
                    selectedLabel={selectedLabel}
                    setSelectedLabel={setSelectedLabel}
                    onDelete={handleDelete}
                    onArchive={handleArchive}
                    onUpdate={handleUpdate}
                    settings={settings}
                    toggleSidebar={toggleSidebar}
                    onSearch={setSearchQuery}
                />;
            case 'help & feedback':
                return <HelpFeedback toggleSidebar={toggleSidebar} />;
            case 'setting':
                return <Settings settings={settings} setSettings={setSettings} toggleSidebar={toggleSidebar} />;
            default:
                return <Notes {...commonProps} filterStatus={filterStatus} filterDate={filterDate} />;
        }
    };

    return (
        <div className={`flex min-h-screen w-full justify-center items-center overflow-hidden h-screen bg-fixed ${settings.theme === 'dark' ? 'bg-[#1e1e2f]' : 'bg-red-gradient'}`}>
            <div className="flex w-full h-full md:w-[96%] md:h-[94%] border-none md:border md:border-white/20 md:rounded-[2.5rem] overflow-hidden shadow-2xl relative bg-black/5 backdrop-blur-sm">
                {isSidebarOpen && (
                    <div
                        className="absolute inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                <SideBar
                    activeView={activeView}
                    setActiveView={handleViewChange}
                    onSearch={setSearchQuery}
                    onFilter={({ status }) => setFilterStatus(status)}
                    currentFilter={filterStatus}
                    labels={labels}
                    setLabels={setLabels}
                    selectedLabel={selectedLabel}
                    setSelectedLabel={setSelectedLabel}
                    setNotes={setNotes}
                    onCreateLabel={handleCreateLabel}
                    onUpdateLabel={handleUpdateLabel}
                    onDeleteLabel={handleDeleteLabel}
                    filterDate={filterDate}
                    onDateFilter={setFilterDate}
                    settings={settings}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                {renderView()}
            </div>
        </div>
    );
};

export default Home;
