"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({
    taiSan: true,
    heThong: false,
    banQuyen: false,
    congViecIT: false,
    baoCao: false,
    quanTri: false,
  });

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const menuData = [
    {
      key: 'taiSan',
      title: '1. Tài sản',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      items: [
        { label: 'Thiết bị', href: '/taisan/thietbi' },
        { label: 'Kiểm kê', href: '/tai-san/kiem-ke' },
        { label: 'Nhập Xuất', href: '/tai-san/nhap-xuat' },
        { label: 'Bảo trì', href: '/tai-san/bao-tri' },
      ],
    },
    {
      key: 'heThong',
      title: '2. Hệ Thống',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 012 2h14a2 2 0 012-2v-4a2 2 0 00-2-2" />
        </svg>
      ),
      items: [
        { label: 'Hệ Thống', href: '/hethong/camera' },
       
      ],
    },
    {
      key: 'banQuyen',
      title: '3. Bản quyền',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      items: [
        { label: 'Bản quyền ', href: '/banquyen' },
        { label: 'Office', href: '/banquyen/office' },
        { label: 'Phần mềm khác', href: '/ban-quyen/phan-mem-khac' },
      ],
    },
    {
      key: 'congViecIT',
      title: '4. Công việc IT',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      items: [
        { label: 'Lịch bảo trì', href: '/congviec/baotri'},
     
      ],
    },
    {
      key: 'baoCao',
      title: '5. Báo cáo',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      items: [
        { label: 'Thiết bị', href: '/bao-cao/thiet-bi' },
        { label: 'Bảo trì', href: '/bao-cao/bao-tri' },
        { label: 'Camera', href: '/bao-cao/camera' },
        { label: 'Kiểm kê', href: '/bao-cao/kiem-ke' },
        { label: 'License', href: '/bao-cao/license' },
      ],
    },
    {
      key: 'quanTri',
      title: '6. Quản trị',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col shadow-xl select-none font-sans shrink-0">
      {/* Menu List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {menuData.map((menu) => {
          const isOpen = openMenus[menu.key];
          return (
            <div key={menu.key} className="rounded-lg overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleMenu(menu.key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors duration-150 rounded-md ${
                  isOpen ? 'text-white bg-slate-800' : 'hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400">{menu.icon}</span>
                  <span>{menu.title}</span>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 text-slate-400 ${
                    isOpen ? 'rotate-180 text-white' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Sub-items */}
              {isOpen && (
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
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;