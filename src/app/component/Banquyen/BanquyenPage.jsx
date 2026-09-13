"use client";

import React, { useState, useEffect } from "react";

const BanquyenPage = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    tong_phan_mem: 0,
    tong_license: 0,
    tong_dang_dung: 0,
    sap_het_30_ngay: 0,
    sap_het_60_ngay: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    `http://${typeof window !== "undefined" ? window.location.hostname : "localhost"}:5000`;

  const fetchBanQuyenData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/ban-quyen`);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        if (result.stats) setStats(result.stats);
      } else {
        setError(result.message || "Không thể lấy dữ liệu bản quyền.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Không thể kết nối tới máy chủ API.");
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanQuyenData();
  }, []);

  // Lọc dữ liệu theo tên, loại bản quyền hoặc Key bản quyền
  const filteredData = data.filter((item) => {
    const term = searchTerm.toLowerCase();
    const phanMemMatch = item.phan_mem ? item.phan_mem.toLowerCase().includes(term) : false;
    const loaiMatch = item.loai_ban_quyen ? item.loai_ban_quyen.toLowerCase().includes(term) : false;
    const keyMatch = item.key_ban_quyen ? item.key_ban_quyen.toLowerCase().includes(term) : false;
    return phanMemMatch || loaiMatch || keyMatch;
  });

  // Chức năng in
  const handlePrint = () => {
    window.print();
  };

  // Thêm mới (Đã bổ sung key_ban_quyen)
  const handleAddSoftware = async () => {
    const payload = {
      phan_mem: "Phần mềm mới",
      loai_ban_quyen: "Standard",
      key_ban_quyen: "",
      so_luong: 10,
      dang_dung: 0,
      ngay_het_han: null,
      ghi_chu: "",
    };

    try {
      const res = await fetch(`${API_URL}/api/ban-quyen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        fetchBanQuyenData();
      } else {
        alert("Lỗi thêm: " + result.message);
      }
    } catch (err) {
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  // Cập nhật dòng khi blur (Đã bổ sung key_ban_quyen)
  const handleUpdateField = async (id, field, value) => {
    const rowToUpdate = data.find((item) => item.id === id);
    if (!rowToUpdate) return;

    let parsedValue = value;
    if (field === "so_luong" || field === "dang_dung") {
      parsedValue = Number(value) || 0;
    }

    const payload = {
      phan_mem: field === "phan_mem" ? parsedValue : rowToUpdate.phan_mem,
      loai_ban_quyen: field === "loai_ban_quyen" ? parsedValue : rowToUpdate.loai_ban_quyen,
      key_ban_quyen: field === "key_ban_quyen" ? parsedValue : rowToUpdate.key_ban_quyen,
      so_luong: field === "so_luong" ? parsedValue : rowToUpdate.so_luong,
      dang_dung: field === "dang_dung" ? parsedValue : rowToUpdate.dang_dung,
      ngay_het_han: field === "ngay_het_han" ? (parsedValue || null) : rowToUpdate.ngay_het_han,
      ghi_chu: field === "ghi_chu" ? parsedValue : rowToUpdate.ghi_chu,
    };

    try {
      const res = await fetch(`${API_URL}/api/ban-quyen/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        fetchBanQuyenData();
      }
    } catch (err) {
      console.error("Cập nhật thất bại:", err);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedData = [...data];
    const realIndex = data.findIndex((item) => item.id === filteredData[index].id);
    if (realIndex !== -1) {
      updatedData[realIndex][field] = value;
      setData(updatedData);
    }
  };

  const handleDeleteRow = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bản quyền phần mềm này?")) return;

    try {
      const res = await fetch(`${API_URL}/api/ban-quyen/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        fetchBanQuyenData();
      } else {
        alert("Xóa thất bại: " + result.message);
      }
    } catch (err) {
      alert("Không thể gửi yêu cầu xóa.");
    }
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  };

  return (
    <div className="w-full space-y-6">
      {/* CSS Ép chỉ in đúng duy nhất Bảng dữ liệu */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .printable-area, .printable-area * {
            visibility: visible !important;
          }
          .printable-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          input { 
            border: none !important; 
            background: transparent !important; 
            padding: 0 !important;
          }
          input[type="date"]::-webkit-calendar-picker-indicator {
            display: none !important;
          }
          .print\\:hidden { 
            display: none !important; 
          }
        }
      `}</style>

      {/* Header Tiêu Đề */}
      <div className="print:hidden">
        <h1 className="text-2xl font-bold text-slate-800">
          3. Báo cáo tình trạng bản quyền
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Quản lý licenses, Microsoft 365, Kaspersky và các phần mềm khác.
        </p>
      </div>

      {/* Khối Thống kê 5 Ô */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 print:hidden">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs text-slate-500 font-medium uppercase">Tổng Phần Mềm</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.tong_phan_mem || 0}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm text-center">
          <p className="text-xs text-blue-700 font-medium uppercase">Tổng License</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.tong_license || 0}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-sm text-center">
          <p className="text-xs text-emerald-700 font-medium uppercase">Đang Sử Dụng</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.tong_dang_dung || 0}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm text-center">
          <p className="text-xs text-red-700 font-medium uppercase">Hết hạn &le; 30 Ngày</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.sap_het_30_ngay || 0}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm text-center col-span-2 md:col-span-1">
          <p className="text-xs text-amber-700 font-medium uppercase">Hết hạn &le; 60 Ngày</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.sap_het_60_ngay || 0}</p>
        </div>
      </div>

      {/* Hàng Thanh Công Cụ */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm phần mềm, key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            In Báo Cáo
          </button>
          <button
            onClick={handleAddSoftware}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Thêm Phần Mềm
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex justify-between items-center print:hidden">
          <span>{error}</span>
          <button onClick={fetchBanQuyenData} className="underline font-semibold hover:text-red-800">
            Thử lại
          </button>
        </div>
      )}

      {/* BẢNG DỮ LIỆU */}
      <div className="printable-area relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
        <table className="w-full text-sm text-left text-body">
          <thead className="text-sm text-body bg-green-200 border-b rounded-base border-default font-semibold">
            <tr>
              <th scope="col" className="px-6 py-3 text-center w-12">STT</th>
              <th scope="col" className="px-6 py-3 w-48">Phần mềm</th>
              <th scope="col" className="px-6 py-3 w-40">Loại bản quyền</th>
              <th scope="col" className="px-6 py-3 w-48">Key bản quyền</th>
              <th scope="col" className="px-6 py-3 w-28 text-center">Số lượng</th>
              <th scope="col" className="px-6 py-3 w-28 text-center">Đang dùng</th>
              <th scope="col" className="px-6 py-3 w-24 text-center">Còn lại</th>
              <th scope="col" className="px-6 py-3 w-40 text-center">Ngày hết hạn</th>
              <th scope="col" className="px-6 py-3 w-32">Trạng thái</th>
              <th scope="col" className="px-6 py-3 min-w-[150px]">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="py-8 text-center text-slate-400 bg-neutral-primary">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mb-2"></div>
                  <p>Đang tải dữ liệu bản quyền...</p>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((row, index) => {
                const statusColorClass =
                  row.mau_canh_bao === "red"
                    ? "bg-red-500"
                    : row.mau_canh_bao === "yellow"
                    ? "bg-amber-500"
                    : "bg-emerald-500";

                return (
                  <tr key={row.id} className="bg-neutral-primary border-b border-default hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-center font-medium">
                      {index + 1}
                    </td>
                    <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                      <input
                        type="text"
                        value={row.phan_mem || ""}
                        onChange={(e) => handleInputChange(index, "phan_mem", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "phan_mem", e.target.value)}
                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1"
                      />
                    </th>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={row.loai_ban_quyen || ""}
                        onChange={(e) => handleInputChange(index, "loai_ban_quyen", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "loai_ban_quyen", e.target.value)}
                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        placeholder="XXXXX-XXXXX-..."
                        value={row.key_ban_quyen || ""}
                        onChange={(e) => handleInputChange(index, "key_ban_quyen", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "key_ban_quyen", e.target.value)}
                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 font-mono text-xs"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        value={row.so_luong || 0}
                        onChange={(e) => handleInputChange(index, "so_luong", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "so_luong", e.target.value)}
                        className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        value={row.dang_dung || 0}
                        onChange={(e) => handleInputChange(index, "dang_dung", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "dang_dung", e.target.value)}
                        className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1"
                      />
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-blue-600 bg-blue-50/30">
                      {row.con_lai}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="date"
                        value={formatDateForInput(row.ngay_het_han)}
                        onChange={(e) => handleInputChange(index, "ngay_het_han", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "ngay_het_han", e.target.value)}
                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 text-sm text-center"
                      />
                      {!row.ngay_het_han && <span className="block text-xs text-slate-400 mt-1">Vĩnh viễn</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${statusColorClass} shadow-sm`}></span>
                        <span className={`text-sm font-medium ${row.mau_canh_bao === "red" ? "text-red-600" : row.mau_canh_bao === "yellow" ? "text-amber-600" : "text-emerald-600"}`}>
                          {row.trang_thai}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        placeholder="Ghi chú..."
                        value={row.ghi_chu || ""}
                        onChange={(e) => handleInputChange(index, "ghi_chu", e.target.value)}
                        onBlur={(e) => handleUpdateField(row.id, "ghi_chu", e.target.value)}
                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1"
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="bg-neutral-primary border-b border-default">
                <td colSpan="10" className="py-8 text-center text-slate-400">
                  {searchTerm ? "Không tìm thấy kết quả phù hợp." : "Chưa có bản quyền phần mềm nào."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BanquyenPage;