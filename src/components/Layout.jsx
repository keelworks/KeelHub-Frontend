import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, title }) => {
  console.log(title)
  return (
    <div className="flex min-h-screen w-full ">
      <div className="flex border-r border-gray-200">
        <Sidebar className="fixed " />
      </div>
      <div className="flex flex-col flex-1 w-full"style={{
        // maxWidth: "74rem",
      }}>
        <div className="flex top-0 right-0 max-w-full" style={{
          left: "256px",
        }}>
          <Header title = {title}/>
        </div>
        <div className="flex-1 px-4 pt-12" >
          {children}
        </div>
      </div>
    </div >
  );
};

export default Layout;
