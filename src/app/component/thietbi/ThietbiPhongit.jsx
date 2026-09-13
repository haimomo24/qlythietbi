"use client";

import React, { useState, useEffect } from "react";

const ThietbiPhongit = () => {
  const [listThietBi, setListThietBi] = useState([]);
  const [stats, setStats] = useState({
    tong_thiet_bi: 0,
    dang_su_dung: 0,
    bao_tri: 0,
    hong: 0,
  });

  // Mặc định Tháng & Năm hiện tại
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString();
  const currentYear = currentDate.getFullYear().toString();

  // States bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    `http://${typeof window !== "undefined" ? window.location.hostname : "localhost"}:5000`;

  // Fetch danh sách thiết bị
  const fetchThietBi = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/thietbi`);
      const result = await res.json();
      if (result.success) {
        const rawData = result.data || [];
        
        // Lọc CHỈ LẤY thiết bị thuộc "Phòng IT"
        const itData = rawData.filter(
          (item) => item.phong_ban && item.phong_ban.trim().toLowerCase() === "phòng it"
        );

        setListThietBi(itData);

        // Tính toán lại thống kê riêng cho Phòng IT
        const total = itData.length;
        const using = itData.filter((i) => i.tinh_trang === "Đang sử dụng").length;
        const maintenance = itData.filter((i) => i.tinh_trang === "Bảo trì").length;
        const broken = itData.filter((i) => i.tinh_trang === "Hỏng").length;

        setStats({
          tong_thiet_bi: total,
          dang_su_dung: using,
          bao_tri: maintenance,
          hong: broken,
        });
      } else {
        setError(result.message || "Không thể lấy dữ liệu thiết bị.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Không thể kết nối tới máy chủ API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThietBi();
  }, []);

  // BỘ LỌC DỮ LIỆU: BẮT BUỘC CHỈ HIỂN THỊ PHÒNG IT & THEO TỪ KHÓA, THÁNG, NĂM
  const filteredData = listThietBi
    .filter((item) => {
      // 1. Kiểm tra tuyệt đối: Chỉ giữ lại các mục có phòng ban là "Phòng IT"
      const isITDepartment =
        item.phong_ban && item.phong_ban.trim().toLowerCase() === "phòng it";
      
      if (!isITDepartment) return false;

      // 2. Lọc theo từ khóa tìm kiếm
      const term = searchTerm.toLowerCase();
      const maMatch = item.ma_thiet_bi ? item.ma_thiet_bi.toLowerCase().includes(term) : false;
      const hangMatch = item.hang_thiet_bi ? item.hang_thiet_bi.toLowerCase().includes(term) : false;
      const nguoiMatch = item.nguoi_su_dung ? item.nguoi_su_dung.toLowerCase().includes(term) : false;
      const textMatch = maMatch || hangMatch || nguoiMatch;

      // 3. Lọc theo Tháng / Năm
      let dateMatch = true;
      if (item.ngay_nhap) {
        const dateObj = new Date(item.ngay_nhap);
        if (!isNaN(dateObj.getTime())) {
          const itemMonth = (dateObj.getMonth() + 1).toString();
          const itemYear = dateObj.getFullYear().toString();

          const monthCheck = selectedMonth === "all" || itemMonth === selectedMonth;
          const yearCheck = selectedYear === "all" || itemYear === selectedYear;

          dateMatch = monthCheck && yearCheck;
        }
      } else if (selectedMonth !== "all" || selectedYear !== "all") {
        dateMatch = false;
      }

      return textMatch && dateMatch;
    })
    .sort((a, b) => {
      // Ngày cũ ở trên, Ngày mới/gần nhất ở dưới
      const dateA = a.ngay_nhap ? new Date(a.ngay_nhap).getTime() : 0;
      const dateB = b.ngay_nhap ? new Date(b.ngay_nhap).getTime() : 0;
      return dateA - dateB;
    });

  const handlePrint = () => {
    window.print();
  };

  const handleAddThietBi = async () => {
    const payload = {
      ma_thiet_bi: `TB-IT-${Date.now().toString().slice(-4)}`,
      hang_thiet_bi: "Dell",
      phong_ban: "Phòng IT", // Mặc định tạo mới luôn gán là Phòng IT
      nguoi_su_dung: "Nguyễn Văn A",
      tinh_trang: "Đang sử dụng",
      so_luong: 1,
      gia: 15000000,
      ngay_nhap: new Date().toISOString().split("T")[0],
      hinh_anh: "",
      lich_su: "",
      ghi_chu: "",
    };

    try {
      const res = await fetch(`${API_URL}/api/thietbi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        fetchThietBi();
      } else {
        alert("Lỗi thêm: " + result.message);
      }
    } catch (err) {
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  const handleUpdateField = async (id, field, value) => {
    const rowToUpdate = listThietBi.find((item) => item.id === id);
    if (!rowToUpdate) return;

    const payload = {
      ...rowToUpdate,
      [field]: value,
    };

    try {
      const res = await fetch(`${API_URL}/api/thietbi/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        fetchThietBi();
      }
    } catch (err) {
      console.error("Cập nhật thất bại:", err);
    }
  };

  const handleFileUpload = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingId(id);
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (result.success || result.url) {
        const imageUrl = result.url || result.data?.url;
        await handleUpdateField(id, "hinh_anh", imageUrl);
      } else {
        alert("Upload ảnh thất bại: " + (result.message || "Lỗi server"));
      }
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Không thể upload hình ảnh.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleInputChangeById = (id, field, value) => {
    setListThietBi((prevList) =>
      prevList.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteRow = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thiết bị này?")) return;

    try {
      const res = await fetch(`${API_URL}/api/thietbi/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        fetchThietBi();
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
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="w-full space-y-6">
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
          input, select { 
            border: none !important; 
            background: transparent !important; 
            padding: 0 !important;
            appearance: none !important;
            -webkit-appearance: none !important;
          }
          .print\\:hidden { 
            display: none !important; 
          }
        }
      `}</style>

      {/* Header */}
      <div className="print:hidden">
        <h1 className="text-2xl font-bold text-slate-800">
          Quản Lý Thiết Bị - Phòng IT
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Danh sách thiết bị công nghệ thông tin đang lưu hành và quản lý tại Phòng IT.
        </p>
      </div>

      {/* Thống Kê */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs text-slate-500 font-medium uppercase">Tổng Thiết Bị IT</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.tong_thiet_bi || 0}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-sm text-center">
          <p className="text-xs text-emerald-700 font-medium uppercase">Đang Sử Dụng</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.dang_su_dung || 0}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm text-center">
          <p className="text-xs text-amber-700 font-medium uppercase">Bảo Trì</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.bao_tri || 0}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm text-center">
          <p className="text-xs text-red-700 font-medium uppercase">Hỏng / Thanh Lý</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.hong || 0}</p>
        </div>
      </div>

      {/* Bộ Lọc */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 print:hidden">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tìm theo Mã, Hãng, Người dùng..."
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

          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline">Tháng:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full sm:w-auto py-2 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs cursor-pointer font-medium"
            >
              <option value="all">Tất cả tháng</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={(i + 1).toString()}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline">Năm:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full sm:w-auto py-2 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs cursor-pointer font-medium"
            >
              <option value="all">Tất cả năm</option>
              {Array.from({ length: 11 }, (_, i) => {
                const year = 2020 + i;
                return (
                  <option key={year} value={year.toString()}>
                    Năm {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
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
            onClick={handleAddThietBi}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Thêm Thiết Bị IT
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex justify-between items-center print:hidden">
          <span>{error}</span>
          <button onClick={fetchThietBi} className="underline font-semibold hover:text-red-800">
            Thử lại
          </button>
        </div>
      )}

      {/* Bảng Dữ Liệu */}
      <div className="printable-area relative overflow-x-auto bg-white shadow-xs rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-700">
          <thead className="text-xs uppercase bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th scope="col" className="px-4 py-3 text-center w-12">STT</th>
              <th scope="col" className="px-4 py-3 w-32">Mã Thiết Bị</th>
              <th scope="col" className="px-4 py-3 w-40">Hãng/Thiết Bị</th>
              <th scope="col" className="px-4 py-3 w-36">Phòng Ban</th>
              <th scope="col" className="px-4 py-3 w-36">Người Sử Dụng</th>
              <th scope="col" className="px-4 py-3 w-36">Tình Trạng</th>
              <th scope="col" className="px-4 py-3 text-center w-20">SL</th>
              <th scope="col" className="px-4 py-3 text-right w-32">Giá (VNĐ)</th>
              <th scope="col" className="px-4 py-3 text-center w-36">Ngày Nhập</th>
              <th scope="col" className="px-4 py-3 text-center w-28">Hình Ảnh</th>
              <th scope="col" className="px-4 py-3 min-w-[150px]">Lịch Sử</th>
              <th scope="col" className="px-4 py-3 min-w-[150px]">Ghi Chú</th>
              <th scope="col" className="px-4 py-3 text-center w-16 print:hidden">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan="13" className="py-8 text-center text-slate-400">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mb-2"></div>
                  <p>Đang tải dữ liệu thiết bị Phòng IT...</p>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-center font-medium text-slate-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={row.ma_thiet_bi || ""}
                      onChange={(e) => handleInputChangeById(row.id, "ma_thiet_bi", e.target.value)}
                      onBlur={(e) => handleUpdateField(row.id, "ma_thiet_bi", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 font-semibold text-slate-900"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={row.hang_thiet_bi || ""}
                      onChange={(e) => handleInputChangeById(row.id, "hang_thiet_bi", e.target.value)}
                      onBlur={(e) => handleUpdateField(row.id, "hang_thiet_bi", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 font-medium text-slate-800"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {/* KHÓA Ô PHÒNG BAN: Cố định "Phòng IT" để tránh nhập nhầm làm ẩn thiết bị */}
                    <input
                      type="text"
                      readOnly
                      value="Phòng IT"
                      className="w-full bg-slate-100/60 border-0 text-blue-700 font-semibold rounded px-2 py-1 select-none cursor-not-allowed"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={row.nguoi_su_dung || ""}
                      onChange={(e) => handleInputChangeById(row.id, "nguoi_su_dung", e.target.value)}
                      onBlur={(e) => handleUpdateField(row.id, "nguoi_su_dung", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 text-slate-700"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          row.tinh_trang === "Đang sử dụng"
                            ? "bg-emerald-500"
                            : row.tinh_trang === "Bảo trì"
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      <select
                        value={row.tinh_trang || "Đang sử dụng"}
                        onChange={(e) => {
                          handleInputChangeById(row.id, "tinh_trang", e.target.value);
                          handleUpdateField(row.id, "tinh_trang", e.target.value);
                        }}
                        className="bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded text-slate-800 font-medium py-0.5 cursor-pointer"
                      >
                        <option value="Đang sử dụng">Đang sử dụng</option>
                        <option value="Bảo trì">Bảo trì</option>
                        <option value="Hỏng">Hỏng</option>
                        <option value="Thanh lý">Thanh lý</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      value={row.so_luong ?? 1}
                      onChange={(e) => handleInputChangeById(row.id, "so_luong", e.target.value)}
                      onBlur={(e) => handleUpdateField(row.id, "so_luong", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 text-center font-medium text-slate-800"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      value={row.gia || 0}
                      onChange={(e) => handleInputChangeById(row.id, "gia", e.target.value)}
                      onBlur={(e) => handleUpdateField(row.id, "gia", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 text-right font-mono text-slate-800"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="date"
                      value={formatDateForInput(row.ngay_nhap)}
                      onChange={(e) => handleInputChangeById(row.id, "ngay_nhap", e.target.value)}
                      onBlur={(e) => handleUpdateField(row.id, "ngay_nhap", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 text-xs text-center font-medium text-slate-600 cursor-pointer"
                    />
                  </td>

                  <td className="px-4 py-3 text-center">
                    <label className="relative inline-flex items-center justify-center cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, row.id)}
                        className="hidden"
                      />
                      {uploadingId === row.id ? (
                        <div className="w-9 h-9 flex items-center justify-center bg-slate-100 rounded-lg">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : row.hinh_anh ? (
                        <div className="relative w-9 h-9">
                          <img
                            src={
                              row.hinh_anh.startsWith("http")
                                ? row.hinh_anh
                                : `${API_URL}${row.hinh_anh}`
                            }
                            alt={row.ma_thiet_bi}
                            className="w-9 h-9 object-cover rounded-lg border border-slate-200 shadow-xs"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center print:hidden">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors print:hidden">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          Ảnh
                        </span>
                      )}
                    </label>
                  </td>

                  <td className="px-4 py-3">
                    <input
                      type="text"
                      placeholder="Lịch sử..."
                      value={row.lich_su || ""}
                      onChange={(e) => handleInputChangeById(row.id, "lich_su", e.target.value)}
                      onBlur={(e) => handleUpdateField(row.id, "lich_su", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 text-slate-600"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      placeholder="Ghi chú..."
                      value={row.ghi_chu || ""}
                      onChange={(e) => handleInputChangeById(row.id, "ghi_chu", e.target.value)}
                      onBlur={(e) => handleUpdateField(row.id, "ghi_chu", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 text-slate-600"
                    />
                  </td>
                  <td className="px-4 py-3 text-center print:hidden">
                    <button
                      onClick={() => handleDeleteRow(row.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Xóa thiết bị"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="py-8 text-center text-slate-400">
                  {searchTerm || selectedMonth !== "all" || selectedYear !== "all"
                    ? "Không tìm thấy thiết bị Phòng IT phù hợp với bộ lọc."
                    : 'Chưa có dữ liệu thiết bị Phòng IT. Bấm "+ Thêm Thiết Bị IT" để tạo mới.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ThietbiPhongit;