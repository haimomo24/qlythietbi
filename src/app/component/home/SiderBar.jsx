"use client";

import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  const menuData = [
    {
      key: 'checkcam',
      title: '1. Check camera  ',
      defaultOpen: true, // Mặc định mở menu này
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      items: [
        { label: 'Check camera ', href: '/checkcam' },
      
      ],
    },
    {
      key: 'taiSan',
      title: '2. Quản lý thiết bị ',
      defaultOpen: true, // Mặc định mở menu này
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      items: [
        { label: 'Thiết bị phòng it', href: '/taisan/thietbiit' },
        { label: 'Thiết bị phòng ban ', href: '/taisan/thietbi' },
        
      
      ],
    },
    {
      key: 'heThong',
      title: '2. Hệ Thống',
      defaultOpen: false,
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 012 2h14a2 2 0 012-2v-4a2 2 0 00-2-2" />
        </svg>
      ),
      items: [
        { label: 'Tồn kho ', href: '/hethong' },
      ],
    },
    {
      key: 'banQuyen',
      title: '3. Bản quyền',
      defaultOpen: false,
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      items: [
        { label: 'Bản quyền', href: '/banquyen' },
        
      ],
    },
    {
      key: 'congViecIT',
      title: '4. Công việc IT',
      defaultOpen: false,
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      items: [
        { label: 'Lịch bảo trì server', href: '/congviec/baotri' },
        { label: 'Lịch bảo trì thiết bị phòng ban ', href: '/congviec/baotriphongban' },
        
      ],
    },
   
    {
      key: 'quanTri',
      title: '6. Quản trị',
      defaultOpen: false,
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      items: [
        { label: 'Người dùng', href: '/quan-tri/nguoi-dung' },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col shadow-xl select-none font-sans shrink-0 relative z-30">
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {menuData.map((menu) => (
          <details 
            key={menu.key} 
            className="group rounded-lg overflow-hidden" 
            open={menu.defaultOpen}
          >
            <summary className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors duration-150 rounded-md cursor-pointer list-none hover:bg-slate-800/60 hover:text-white group-open:bg-slate-800 group-open:text-white [&::-webkit-details-marker]:hidden">
              <div className="flex items-center space-x-3">
                <span className="text-slate-400 group-open:text-white">{menu.icon}</span>
                <span>{menu.title}</span>
              </div>
              <svg
                className="w-4 h-4 transition-transform duration-200 text-slate-400 group-open:rotate-180 group-open:text-white shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>

            <ul className="mt-1 pl-9 pr-2 space-y-1">
              {menu.items.map((subItem, index) => (
                <li key={index}>
                  <Link
                    href={subItem.href}
                    className="block px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-md transition-colors duration-150"
                  >
                    {subItem.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;