import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white p-3 md:p-4">
        <div className="container mx-auto px-4">
          <h1 className="text-xl md:text-2xl font-bold">Nonviolent Peaceforce</h1>
        </div>
      </header>
      
      <main className="container mx-auto flex-grow py-4 md:py-6 px-4 md:px-6">
        {children}
      </main>
      
      <footer className="bg-gray-100 p-3 md:p-4 mt-4 md:mt-8">
        <div className="container mx-auto text-center text-gray-600 text-sm md:text-base">
          &copy; {new Date().getFullYear()} DSSD Madison
        </div>
      </footer>
    </div>
  );
};

export default Layout;