import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
            <Header />
            <main className="flex-1 w-full max-w-[1600px] mx-auto p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
