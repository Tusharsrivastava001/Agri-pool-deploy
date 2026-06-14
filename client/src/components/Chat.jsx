import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MessageCircle, X, Send, User, Loader2, ArrowLeft } from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function ChatWidget({ defaultOpenUserId = null }) {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    // Initialize Socket Connection
    useEffect(() => {
        if (!user) return;

        // Auto-open if a user was passed
        if (defaultOpenUserId) {
            setIsOpen(true);
            // We need to fetch this user's details to set as activeChat... 
            // For now, let's just wait until they click a chat or we can stub it
        }

        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('join', user.id);
        });

        return () => newSocket.disconnect();
    }, [user, defaultOpenUserId]);

    // Fetch Conversations List
    useEffect(() => {
        if (!isOpen || !user) return;

        fetchConversations();
    }, [isOpen, user]);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/chat/conversations');
            setConversations(res.data);
        } catch (err) {
            console.error("Error fetching conversations:", err);
        } finally {
            setLoading(false);
        }
    };

    // Listen for incoming messages
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (newMessage) => {
            // If the message belongs to the currently active chat
            if (activeChat && (
                (newMessage.sender === activeChat._id && newMessage.receiver === user.id) ||
                (newMessage.sender === user.id && newMessage.receiver === activeChat._id)
            )) {
                setMessages((prev) => [...prev, newMessage]);

                // If we received it, mark as read
                if (newMessage.receiver === user.id) {
                    api.post('/api/chat/read', { senderId: activeChat._id }).catch(console.error);
                }
            }

            // Always refresh conversations to update last message and unread counts
            fetchConversations();
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket, activeChat, user]);

    // Global event listener to open chat with specific user from anywhere
    useEffect(() => {
        const handleOpenChatEvent = async (e) => {
            const { contactId, contactName } = e.detail;
            setIsOpen(true);

            const newContact = { _id: contactId, name: contactName };
            setActiveChat(newContact);

            try {
                setLoading(true);
                const res = await api.get(`/api/chat/${contactId}`);
                setMessages(res.data);
                await api.post('/api/chat/read', { senderId: contactId });
                fetchConversations();
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        window.addEventListener('openChat', handleOpenChatEvent);
        return () => window.removeEventListener('openChat', handleOpenChatEvent);
    }, [user]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleOpenChat = async (contact) => {
        setActiveChat(contact);
        try {
            setLoading(true);
            const res = await api.get(`/api/chat/${contact._id}`);
            setMessages(res.data);
            // Mark as read
            await api.post('/api/chat/read', { senderId: contact._id });
            fetchConversations(); // refresh unread count
        } catch (err) {
            console.error("Error fetching messages:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeChat || !socket) return;

        const messageData = {
            sender: user.id,
            receiver: activeChat._id,
            content: messageInput,
        };

        // Emit via socket
        socket.emit('send_message', messageData);
        setMessageInput('');
    };

    if (!user) return null; // Don't show chat if not logged in

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center relative"
                >
                    <MessageCircle size={28} />
                    {/* Unread badge logic */}
                    {conversations.reduce((acc, curr) => acc + curr.unreadCount, 0) > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                            {conversations.reduce((acc, curr) => acc + curr.unreadCount, 0)}
                        </span>
                    )}
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={`mt-4 w-[380px] h-[550px] shadow-2xl rounded-3xl overflow-hidden flex flex-col border backdrop-blur-3xl transition-all duration-300 ${isDarkMode ? 'bg-gray-900/95 border-gray-700 text-white' : 'bg-white/95 border-gray-200 text-gray-900'}`}>

                    {/* Header */}
                    <div className="bg-emerald-600 text-white p-4 flex justify-between items-center shadow-md z-10">
                        <div className="flex items-center gap-3">
                            {activeChat ? (
                                <>
                                    <button onClick={() => setActiveChat(null)} className="hover:bg-emerald-700 p-1 rounded-full transition-colors">
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div className="font-bold flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-sm">
                                            {activeChat.name?.charAt(0).toUpperCase()}
                                        </div>
                                        {activeChat.name}
                                    </div>
                                </>
                            ) : (
                                <div className="font-bold text-lg flex items-center gap-2">
                                    <MessageCircle size={22} /> Messages
                                </div>
                            )}
                        </div>
                        <button onClick={() => { setIsOpen(false); setActiveChat(null); }} className="hover:bg-emerald-700 p-1 rounded-full transition-colors">
                            <X size={22} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto relative">
                        {loading && !activeChat && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-white/5 z-10">
                                <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
                            </div>
                        )}

                        {!activeChat ? (
                            // Conversations List
                            <div className="p-2 space-y-1">
                                {conversations.length === 0 && !loading ? (
                                    <div className="text-center p-8 opacity-50 flex flex-col items-center">
                                        <MessageCircle size={40} className="mb-3 opacity-50" />
                                        <p>No conversations yet.</p>
                                        <p className="text-xs mt-1">Start chatting with farmers or transporters!</p>
                                    </div>
                                ) : (
                                    conversations.map((conv) => (
                                        <div
                                            key={conv.contact._id}
                                            onClick={() => handleOpenChat(conv.contact)}
                                            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                                        >
                                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 border border-emerald-500/20 rounded-full flex items-center justify-center font-bold text-lg relative flex-shrink-0">
                                                {conv.contact.name?.charAt(0).toUpperCase()}
                                                {conv.unreadCount > 0 && (
                                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white dark:border-gray-900">
                                                        {conv.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <h4 className="font-bold truncate text-sm">{conv.contact.name}</h4>
                                                <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'opacity-60'}`}>
                                                    {conv.lastMessage?.sender === user.id ? 'You: ' : ''}{conv.lastMessage?.content}
                                                </p>
                                            </div>
                                            <span className="text-[10px] opacity-40 whitespace-nowrap">
                                                {new Date(conv.lastMessage?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            // Active Chat Messages
                            <div className="p-4 flex flex-col gap-3 min-h-full">
                                {messages.map((msg, idx) => {
                                    const isMe = msg.sender === user.id;
                                    return (
                                        <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${isMe ? 'bg-emerald-600 text-white rounded-br-sm' : isDarkMode ? 'bg-gray-800 text-white rounded-bl-sm shadow-md' : 'bg-white shadow-md rounded-bl-sm border border-gray-100'}`}>
                                                <p className="text-sm">{msg.content}</p>
                                                <span className="text-[10px] opacity-60 mt-1 block text-right">
                                                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Footer Input Area */}
                    {activeChat && (
                        <div className={`p-3 border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className={`flex-1 rounded-full px-4 py-2 outline-none text-sm transition-colors border ${isDarkMode ? 'bg-gray-900 border-gray-700 focus:border-emerald-500' : 'bg-white border-gray-300 focus:border-emerald-500'}`}
                                />
                                <button
                                    type="submit"
                                    disabled={!messageInput.trim()}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full transition-transform disabled:opacity-50 disabled:hover:scale-100 hover:scale-110 flex-shrink-0"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}
