import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (!socket || !user) return;
        socket.emit('join_user', user.id);
        if (user.role === 'transporter') {
            socket.emit('join_transporters');
        }
    }, [socket, user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

SocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
