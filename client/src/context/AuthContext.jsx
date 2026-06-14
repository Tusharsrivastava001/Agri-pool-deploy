import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Check URL parameters for tokens (from Google OAuth redirect)
        const urlParams = new URLSearchParams(window.location.search);
        const urlAccessToken = urlParams.get('accessToken');
        const urlRefreshToken = urlParams.get('refreshToken');
        const urlUserId = urlParams.get('userId');
        const urlName = urlParams.get('name');
        const urlPicture = urlParams.get('picture');
        const urlRole = urlParams.get('role');
        const urlEmail = urlParams.get('email');

        if (urlAccessToken && urlUserId) {
            // Save tokens from URL to local storage
            localStorage.setItem('token', urlAccessToken);
            if (urlRefreshToken) localStorage.setItem('refreshToken', urlRefreshToken);
            localStorage.setItem('userId', urlUserId);
            if (urlName) localStorage.setItem('userName', urlName);
            if (urlPicture) localStorage.setItem('userPicture', urlPicture);
            if (urlRole) localStorage.setItem('userRole', urlRole);
            if (urlEmail) localStorage.setItem('userEmail', urlEmail);

            // Clean the URL so tokens aren't visible
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // 2. Load user state from Local Storage
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedName = localStorage.getItem('userName') || 'Farmer';
        const storedPicture = localStorage.getItem('userPicture');
        const storedRole = localStorage.getItem('userRole') || 'farmer';
        const storedEmail = localStorage.getItem('userEmail');

        if (storedToken && storedUserId) {
            setUser({
                id: storedUserId,
                name: storedName,
                picture: storedPicture,
                role: storedRole,
                email: storedEmail,
            });
        }

        setLoading(false);
    }, []);

    const login = (userData, accessToken, refreshToken) => {
        localStorage.setItem('token', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userId', userData.id);
        if (userData.name) localStorage.setItem('userName', userData.name);
        if (userData.role) localStorage.setItem('userRole', userData.role);
        if (userData.email) localStorage.setItem('userEmail', userData.email);

        setUser({
            id: userData.id,
            name: userData.name || 'Farmer',
            role: userData.role || 'farmer',
            email: userData.email,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userPicture');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
