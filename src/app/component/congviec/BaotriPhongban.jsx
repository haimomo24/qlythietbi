"use client";

import React, { useState, useEffect } from "react";

const BaotriPhongban = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    `http://${typeof window !== "undefined" ? window.location.hostname : "localhost"}:5000`;

  // Fetch dữ liệu từ API
  const fetchBaoTri = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/btriphongban`);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || "Lỗi khi lấy dữ liệu bảo trì phòng ban.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Không thể kết nối tới máy chủ API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaoTri();
  }, []);

  // Thêm lượt bảo trì mới
  const handleAddRow = async () => {
    const payload = {
      ngay_thang: new Date().toISOString().split("T")[0],
      phong_ban: "",
      nguoi_su_dung: "",
      noi_dung: "",
      lich_su_bao_tri: "",
      tinh_trang: "Đang xử lý",
      nv_bao_tri: "",
      ghi_chu: "",
    };

    try {
      const res = await fetch(`${API_URL}/api/btriphongban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        fetchBaoTri();
      } else {
        alert("Lỗi thêm: " + result.message);
      }
    } catch (err) {
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  // Cập nhật ô khi thay đổi (lưu khi blur)
  const handleUpdateField = async (id, field, value) => {
    const rowToUpdate = data.find((item) => item.id === id);
    if (!rowToUpdate) return;

    const payload = {
      ngay_thang: field === "ngay_thang" ? value : rowToUpdate.ngay_thang?.split("T")[0] || "",
      phong_ban: field === "phong_ban" ? value : rowToUpdate.phong_ban || "",
      nguoi_su_dung: field === "nguoi_su_dung" ? value : rowToUpdate.nguoi_su_dung || "",
      noi_dung: field === "noi_dung" ? value : rowToUpdate.noi_dung || "",
      lich_su_bao_tri: field === "lich_su_bao_tri" ? value : rowToUpdate.lich_su_bao_tri || "",
      tinh_trang: field === "tinh_trang" ? value : rowToUpdate.tinh_trang || "",
      nv_bao_tri: field === "nv_bao_tri" ? value : rowToUpdate.nv_bao_tri || "",
      ghi_chu: field === "ghi_chu" ? value : rowToUpdate.ghi_chu || "",
    };

    try {
      await fetch(`${API_URL}/api/btriphongban/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Cập nhật thất bại:", err);
    }
  };

  // Cập nhật state nội bộ tức thì khi gõ
  const handleInputChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  // Xóa lượt bảo trì
  const handleDeleteRow = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lượt bảo trì này?")) return;

    try {
      const res = await fetch(`${API_URL}/api/btriphongban/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        setData(data.filter((row) => row.id !== id));
      } else {
        alert("Xóa thất bại: " + result.message);
      }
    } catch (err) {
      alert("Không thể gửi yêu cầu xóa.");
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      {/* Tiêu đề & Nút thêm */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Bảo trì phòng ban</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý nhật ký và lịch sử bảo trì thiết bị tại các phòng ban
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

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex justify-between items-center">
          <span>{error}</span>
          <button onClick={fetchBaoTri} className="underline font-semibold hover:text-red-800">
            Thử lại
          </button>
        </div>
      )}

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto border border-slate-300 rounded-lg">
        <table className="w-full border-collapse text-left text-sm text-slate-700">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold uppercase text-xs">
              <th className="py-3 px-3 border-r border-slate-300 text-center w-14">STT</th>
              <th className="py-3 px-4 border-r border-slate-300 w-36 whitespace-nowrap">NGÀY THÁNG</th>
              <th className="py-3 px-4 border-r border-slate-300 w-44">PHÒNG BAN</th>
              <th className="py-3 px-4 border-r border-slate-300 w-44">NGƯỜI SD</th>
              <th className="py-3 px-4 border-r border-slate-300 min-w-[220px]">NỘI DUNG</th>
              <th className="py-3 px-4 border-r border-slate-300 min-w-[220px]">LỊCH SỬ BẢO TRÌ</th>
              <th className="py-3 px-4 border-r border-slate-300 w-40">TÌNH TRẠNG</th>
              <th className="py-3 px-4 border-r border-slate-300 w-44">NV BẢO TRÌ</th>
              <th className="py-3 px-4 border-r border-slate-300 min-w-[180px]">GHI CHÚ</th>
              <th className="py-3 px-3 text-center w-16">XÓA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            {loading ? (
              <tr>
                <td colSpan="10" className="py-8 text-center text-slate-400">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mb-2"></div>
                  <p>Đang tải dữ liệu bảo trì phòng ban...</p>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, index) => {
                const formattedDate = row.ngay_thang ? row.ngay_thang.split("T")[0] : "";

                return (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 border-r border-slate-300 text-center font-semibold text-slate-500">
                      {index + 1}
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-300">
                      <input
                        type="date"
                        value={formattedDate}
                        onChange={(e) => handleInputChange(index, "ngay_thang", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "ngay_thang", e.target.value)}
                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 text-slate-700"
                      />
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-300">
                      <input
                        type="text"
                        placeholder="Phòng ban..."
                        value={row.phong_ban || ""}
                        onChange={(e) => handleInputChange(index, "phong_ban", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "phong_ban", e.target.value)}
                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1"
                      />
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-300">
                      <input
                        type="text"
                        placeholder="Người sử dụng..."
                        value={row.nguoi_su_dung || ""}
                        onChange={(e) => handleInputChange(index, "nguoi_su_dung", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "nguoi_su_dung", e.target.value)}
                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1"
                      />
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-300">
                      <input
                        type="text"
                        placeholder="Nội dung bảo trì/thiết bị..."
                        value={row.noi_dung || ""}
                        onChange={(e) => handleInputChange(index, "noi_dung", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "noi_dung", e.target.value)}
                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1"
                      />
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-300">
                      <input
                        type="text"
                        placeholder="Lịch sử bảo trì..."
                        value={row.lich_su_bao_tri || ""}
                        onChange={(e) => handleInputChange(index, "lich_su_bao_tri", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "lich_su_bao_tri", e.target.value)}
                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1"
                      />
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-300">
                      <input
                        type="text"
                        placeholder="Tình trạng..."
                        value={row.tinh_trang || ""}
                        onChange={(e) => handleInputChange(index, "tinh_trang", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "tinh_trang", e.target.value)}
                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1"
                      />
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-300">
                      <input
                        type="text"
                        placeholder="NV bảo trì..."
                        value={row.nv_bao_tri || ""}
                        onChange={(e) => handleInputChange(index, "nv_bao_tri", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "nv_bao_tri", e.target.value)}
                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1"
                      />
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-300">
                      <input
                        type="text"
                        placeholder="Ghi chú thêm..."
                        value={row.ghi_chu || ""}
                        onChange={(e) => handleInputChange(index, "ghi_chu", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "ghi_chu", e.target.value)}
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
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="py-8 text-center text-slate-400">
                  Chưa có dữ liệu bảo trì phòng ban. Bấm <b>"+ Thêm lượt bảo trì"</b> để tạo mới.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BaotriPhongban;