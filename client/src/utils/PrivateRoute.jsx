import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (roles?.length && !roles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute;
