"use client";

import React, { useState, useEffect } from "react";

const HeThong = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    tong_mathang: 0,
    tong_dang_ton: 0,
    tong_hong: 0,
    so_luong_sap_het: 0,
    tong_gia_tri_ton_kho: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    `http://${typeof window !== "undefined" ? window.location.hostname : "localhost"}:5000`;

  // Fetch danh sách tồn kho & thống kê
  const fetchTonKhoData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/ton-kho`);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        if (result.stats) setStats(result.stats);
      } else {
        setError(result.message || "Không thể lấy dữ liệu tồn kho.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Không thể kết nối tới máy chủ API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTonKhoData();
  }, []);

  // Thêm thiết bị mới
  const handleAddDevice = async () => {
    const payload = {
      ma_thiet_bi: `IT-NEW-${Date.now().toString().slice(-4)}`,
      ten_thiet_bi: "Thiết bị mới",
      don_vi_tinh: "Cái",
      gia_nhap: 100000,
      tong_nhap: 10,
      da_cap: 0,
      hong: 0,
      ton_toi_thieu: 2,
    };

    try {
      const res = await fetch(`${API_URL}/api/ton-kho`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        fetchTonKhoData();
      } else {
        alert("Lỗi thêm: " + result.message);
      }
    } catch (err) {
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  // Cập nhật dòng khi blur
  const handleUpdateField = async (id, field, value) => {
    const rowToUpdate = data.find((item) => item.id === id);
    if (!rowToUpdate) return;

    const payload = {
      ma_thiet_bi: field === "ma_thiet_bi" ? value : rowToUpdate.ma_thiet_bi || "",
      ten_thiet_bi: field === "ten_thiet_bi" ? value : rowToUpdate.ten_thiet_bi || "",
      don_vi_tinh: field === "don_vi_tinh" ? value : rowToUpdate.don_vi_tinh || "Cái",
      gia_nhap: Number(field === "gia_nhap" ? value : rowToUpdate.gia_nhap) || 0,
      tong_nhap: Number(field === "tong_nhap" ? value : rowToUpdate.tong_nhap) || 0,
      da_cap: Number(field === "da_cap" ? value : rowToUpdate.da_cap) || 0,
      hong: Number(field === "hong" ? value : rowToUpdate.hong) || 0,
      ton_toi_thieu: Number(field === "ton_toi_thieu" ? value : rowToUpdate.ton_toi_thieu) || 0,
    };

    try {
      const res = await fetch(`${API_URL}/api/ton-kho/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        fetchTonKhoData();
      }
    } catch (err) {
      console.error("Cập nhật thất bại:", err);
    }
  };

  // Cập nhật state nội bộ khi nhập liệu
  const handleInputChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  // Xóa thiết bị
  const handleDeleteRow = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thiết bị này khỏi kho?")) return;

    try {
      const res = await fetch(`${API_URL}/api/ton-kho/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        fetchTonKhoData();
      } else {
        alert("Xóa thất bại: " + result.message);
      }
    } catch (err) {
      alert("Không thể gửi yêu cầu xóa.");
    }
  };

  // Định dạng tiền tệ VNĐ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount || 0);
  };

  return (
    <div className="w-full space-y-6">
      {/* Tiêu đề & Nút thao tác */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            4. Báo cáo tình trạng tồn kho thiết bị
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý chi tiết nhập, cấp, hỏng và tồn kho thiết bị IT.
          </p>
        </div>
        <button
          onClick={handleAddDevice}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Thêm Thiết Bị
        </button>
      </div>

      {/* Thẻ Thống Kê Tổng Quan */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs text-slate-500 font-medium uppercase">Mặt Hàng Tồn</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.tong_mathang || 0}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm text-center">
          <p className="text-xs text-blue-700 font-medium uppercase">Tổng Đang Tồn</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.tong_dang_ton || 0}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm text-center">
          <p className="text-xs text-red-700 font-medium uppercase">Sắp Hết Kho</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.so_luong_sap_het || 0}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm text-center">
          <p className="text-xs text-amber-700 font-medium uppercase">Hàng Hỏng</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.tong_hong || 0}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-sm text-center col-span-2 md:col-span-1">
          <p className="text-xs text-emerald-700 font-medium uppercase">Giá Trị Tồn Kho</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">
            {formatCurrency(stats.tong_gia_tri_ton_kho)} đ
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex justify-between items-center">
          <span>{error}</span>
          <button onClick={fetchTonKhoData} className="underline font-semibold hover:text-red-800">
            Thử lại
          </button>
        </div>
      )}

      {/* Bảng Dữ Liệu Tồn Kho */}
      <div className="relative overflow-x-auto bg-white shadow-xs rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-700">
          <thead className="text-xs uppercase bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th scope="col" className="px-4 py-3 text-center w-12">STT</th>
              <th scope="col" className="px-4 py-3 w-32">Mã</th>
              <th scope="col" className="px-4 py-3 w-48">Thiết bị</th>
              <th scope="col" className="px-4 py-3 w-20 text-center">ĐVT</th>
              <th scope="col" className="px-4 py-3 w-36 text-right">Giá nhập (VNĐ)</th>
              <th scope="col" className="px-4 py-3 w-24 text-center">Tổng nhập</th>
              <th scope="col" className="px-4 py-3 w-24 text-center">Đã cấp</th>
              <th scope="col" className="px-4 py-3 w-24 text-center font-bold text-blue-600">Đang tồn</th>
              <th scope="col" className="px-4 py-3 w-20 text-center text-red-500">Hỏng</th>
              <th scope="col" className="px-4 py-3 w-28 text-center">Tồn tối thiểu</th>
              <th scope="col" className="px-4 py-3 w-32 text-center">Trạng thái</th>
            
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan="12" className="py-8 text-center text-slate-400">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent mb-2"></div>
                  <p>Đang tải dữ liệu tồn kho...</p>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, index) => {
                const isWarning = row.trang_thai === "Sắp hết";
                return (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-center font-medium text-slate-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={row.ma_thiet_bi || ""}
                        onChange={(e) => handleInputChange(index, "ma_thiet_bi", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "ma_thiet_bi", e.target.value)}
                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-emerald-500 rounded px-1 font-mono font-semibold text-slate-800"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={row.ten_thiet_bi || ""}
                        onChange={(e) => handleInputChange(index, "ten_thiet_bi", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "ten_thiet_bi", e.target.value)}
                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-emerald-500 rounded px-1 font-medium text-slate-900"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="text"
                        value={row.don_vi_tinh || ""}
                        onChange={(e) => handleInputChange(index, "don_vi_tinh", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "don_vi_tinh", e.target.value)}
                        className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-emerald-500 rounded px-1 text-slate-600"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input
                        type="number"
                        value={row.gia_nhap || 0}
                        onChange={(e) => handleInputChange(index, "gia_nhap", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "gia_nhap", e.target.value)}
                        className="w-full text-right bg-transparent border-0 focus:ring-1 focus:ring-emerald-500 rounded px-1 font-mono text-slate-800"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        value={row.tong_nhap || 0}
                        onChange={(e) => handleInputChange(index, "tong_nhap", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "tong_nhap", e.target.value)}
                        className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-emerald-500 rounded px-1 text-slate-800"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        value={row.da_cap || 0}
                        onChange={(e) => handleInputChange(index, "da_cap", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "da_cap", e.target.value)}
                        className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-emerald-500 rounded px-1 text-slate-800"
                      />
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-blue-600 bg-blue-50/50 rounded">
                      {row.dang_ton}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        value={row.hong || 0}
                        onChange={(e) => handleInputChange(index, "hong", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "hong", e.target.value)}
                        className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-emerald-500 rounded px-1 text-red-600 font-semibold"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        value={row.ton_toi_thieu || 0}
                        onChange={(e) => handleInputChange(index, "ton_toi_thieu", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "ton_toi_thieu", e.target.value)}
                        className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-emerald-500 rounded px-1 text-slate-600"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isWarning
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isWarning ? "bg-red-500" : "bg-emerald-500"
                          }`}
                        ></span>
                        {row.trang_thai}
                      </span>
                    </td>
                    
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="12" className="py-8 text-center text-slate-400">
                  Chưa có thiết bị nào trong kho. Bấm <b>"+ Thêm Thiết Bị"</b> để tạo mới.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
    </div>
  );
};

export default HeThong;