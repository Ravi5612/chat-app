import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';

export default function RootLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Persistent Header */}
            <Header />

            {/* Scrollable Content */}
            <div className="flex-1 flex flex-col">
                <Outlet />
            </div>
        </div>
    );
}
