"use client";

import React, { useState } from "react";

const BaotriPage = () => {
  // Dữ liệu mẫu ban đầu cho danh sách bảo trì
  const [data, setData] = useState([
    {
      id: 1,
      ngayThang: "2026-03-30",
      noiDung: "Bảo trì vệ sinh định kỳ máy chủ Server 01",
      tinhTrang: "Đã hoàn thành",
      nhanVien: "Nguyễn Văn A",
      ghiChu: "Đã thay keo tản nhiệt",
    },
    {
      id: 2,
      ngayThang: "2026-03-31",
      noiDung: "Kiểm tra hệ thống Camera nhà xe",
      tinhTrang: "Đang xử lý",
      nhanVien: "Trần Văn B",
      ghiChu: "Lỗi nguồn mắt số 3",
    },
  ]);

  // Thêm dòng mới
  const handleAddRow = () => {
    setData([
      ...data,
      {
        id: Date.now(),
        ngayThang: new Date().toISOString().split("T")[0],
        noiDung: "",
        tinhTrang: "Đang xử lý",
        nhanVien: "",
        ghiChu: "",
      },
    ]);
  };

  // Cập nhật giá trị ô khi chỉnh sửa
  const handleInputChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  // Xóa dòng
  const handleDeleteRow = (id) => {
    setData(data.filter((row) => row.id !== id));
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      {/* Tiêu đề & Nút thêm */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sổ Theo Dõi Bảo Trì</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý và ghi chép nhật ký bảo trì thiết bị IT
          </p>
        </div>
        <button
          onClick={handleAddRow}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Thêm lượt bảo trì
        </button>
      </div>

      {/* Bảng dữ liệu theo mẫu sổ ghi chép */}
      <div className="overflow-x-auto border border-slate-300 rounded-lg">
        <table className="w-full border-collapse text-left text-sm text-slate-700">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold uppercase text-xs">
              <th className="py-3 px-3 border-r border-slate-300 text-center w-14">STT</th>
              <th className="py-3 px-4 border-r border-slate-300 w-36 whitespace-nowrap">NGÀY THÁNG</th>
              <th className="py-3 px-4 border-r border-slate-300 min-w-[280px]">NỘI DUNG</th>
              <th className="py-3 px-4 border-r border-slate-300 w-44">TÌNH TRẠNG</th>
              <th className="py-3 px-4 border-r border-slate-300 w-44">NHÂN VIÊN</th>
              <th className="py-3 px-4 border-r border-slate-300 min-w-[200px]">GHI CHÚ</th>
              <th className="py-3 px-3 text-center w-16">XÓA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 border-r border-slate-300 text-center font-semibold text-slate-500">
                    {index + 1}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-300">
                    <input
                      type="date"
                      value={row.ngayThang}
                      onChange={(e) => handleInputChange(index, "ngayThang", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 text-slate-700"
                    />
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-300">
                    <input
                      type="text"
                      placeholder="Nhập nội dung công việc..."
                      value={row.noiDung}
                      onChange={(e) => handleInputChange(index, "noiDung", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1"
                    />
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-300">
                    <input
                      type="text"
                      placeholder="Nhập tình trạng..."
                      value={row.tinhTrang}
                      onChange={(e) => handleInputChange(index, "tinhTrang", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1"
                    />
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-300">
                    <input
                      type="text"
                      placeholder="Tên kỹ thuật viên..."
                      value={row.nhanVien}
                      onChange={(e) => handleInputChange(index, "nhanVien", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1"
                    />
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-300">
                    <input
                      type="text"
                      placeholder="Ghi chú thêm..."
                      value={row.ghiChu}
                      onChange={(e) => handleInputChange(index, "ghiChu", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => handleDeleteRow(row.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                      title="Xóa dòng"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400">
                  Chưa có dữ liệu bảo trì. Bấm <b>"+ Thêm lượt bảo trì"</b> để tạo mới.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BaotriPage;