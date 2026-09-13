"use client";

import React, { useState, useEffect } from "react";

const CheckcamPage = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    tong_camera: 0,
    online: 0,
    offline: 0,
    loi: 0,
    khong_luu_hinh: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    `http://${typeof window !== "undefined" ? window.location.hostname : "localhost"}:5000`;

  // Fetch danh sách & thống kê camera
  const fetchCameraData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/baocao-camera`);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        if (result.stats) setStats(result.stats);
      } else {
        setError(result.message || "Không thể lấy dữ liệu báo cáo Camera.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Không thể kết nối tới máy chủ API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameraData();
  }, []);

  // Lọc dữ liệu theo Khu vực, Tên Camera hoặc IP
  const filteredData = data.filter((item) => {
    const term = searchTerm.toLowerCase();
    const khuVucMatch = item.khu_vuc ? item.khu_vuc.toLowerCase().includes(term) : false;
    const tenMatch = item.ten_camera ? item.ten_camera.toLowerCase().includes(term) : false;
    const ipMatch = item.ip_address ? item.ip_address.toLowerCase().includes(term) : false;
    return khuVucMatch || tenMatch || ipMatch;
  });

  // Chức năng in báo cáo
  const handlePrint = () => {
    window.print();
  };

  // Thêm camera mới
  const handleAddCamera = async () => {
    const payload = {
      khu_vuc: "Khu vực mới",
      ten_camera: "CAM-NEW-01",
      ip_address: "172.16.1.100",
      dau_ghi_kenh: "NVR01/CH01",
      trang_thai: "Online",
      luu_hinh: "Bình thường",
      ghi_chu: "",
    };

    try {
      const res = await fetch(`${API_URL}/api/baocao-camera`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        fetchCameraData();
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
      khu_vuc: field === "khu_vuc" ? value : rowToUpdate.khu_vuc || "",
      ten_camera: field === "ten_camera" ? value : rowToUpdate.ten_camera || "",
      ip_address: field === "ip_address" ? value : rowToUpdate.ip_address || "",
      dau_ghi_kenh: field === "dau_ghi_kenh" ? value : rowToUpdate.dau_ghi_kenh || "",
      trang_thai: field === "trang_thai" ? value : rowToUpdate.trang_thai || "Online",
      luu_hinh: field === "luu_hinh" ? value : rowToUpdate.luu_hinh || "Bình thường",
      ghi_chu: field === "ghi_chu" ? value : rowToUpdate.ghi_chu || "",
    };

    try {
      const res = await fetch(`${API_URL}/api/baocao-camera/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        fetchCameraData();
      }
    } catch (err) {
      console.error("Cập nhật thất bại:", err);
    }
  };

  // Cập nhật state nội bộ khi nhập liệu
  const handleInputChange = (index, field, value) => {
    const updatedData = [...data];
    const realIndex = data.findIndex((item) => item.id === filteredData[index].id);
    if (realIndex !== -1) {
      updatedData[realIndex][field] = value;
      setData(updatedData);
    }
  };

  // Xóa camera
  const handleDeleteRow = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa Camera này?")) return;

    try {
      const res = await fetch(`${API_URL}/api/baocao-camera/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        fetchCameraData();
      } else {
        alert("Xóa thất bại: " + result.message);
      }
    } catch (err) {
      alert("Không thể gửi yêu cầu xóa.");
    }
  };

  // Format hiển thị thời gian
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month} ${hours}:${minutes}`;
  };

  return (
    <div className="w-full space-y-6">
      {/* CSS Ép chỉ in đúng duy nhất Bảng dữ liệu, loại bỏ Sidebar & Header trang web */}
      <style>{`
        @media print {
          /* Ẩn toàn bộ nội dung bao gồm cả Sidebar bên ngoài */
          body * {
            visibility: hidden !important;
          }
          /* Chỉ hiển thị khối printable-area và các phần tử con */
          .printable-area, .printable-area * {
            visibility: visible !important;
          }
          /* Định vị bảng tràn toàn bộ trang in */
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
          /* Định dạng các ô input/select khi in */
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

      {/* Header Tiêu Đề */}
      <div className="print:hidden">
        <h1 className="text-2xl font-bold text-slate-800">
          Báo cáo tình trạng hoạt động Camera
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Giám sát trạng thái kết nối và lưu trữ hình ảnh camera toàn hệ thống.
        </p>
      </div>

      {/* Thẻ Thống kê Tổng quan */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs text-slate-500 font-medium uppercase">Tổng Camera</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.tong_camera || 0}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-sm text-center">
          <p className="text-xs text-emerald-700 font-medium uppercase">Online</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.online || 0}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm text-center">
          <p className="text-xs text-red-700 font-medium uppercase">Offline</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.offline || 0}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm text-center">
          <p className="text-xs text-amber-700 font-medium uppercase">Lỗi</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.loi || 0}</p>
        </div>
      </div>

      {/* Hàng Thanh Công Cụ: Tìm Kiếm (Trái) + Nút In & Thêm Mới (Phải) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
        {/* Ô Tìm Kiếm */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm theo khu vực, tên, IP..."
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

        {/* Cụm Nút Thao Tác */}
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
            onClick={handleAddCamera}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Thêm Camera
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex justify-between items-center print:hidden">
          <span>{error}</span>
          <button onClick={fetchCameraData} className="underline font-semibold hover:text-red-800">
            Thử lại
          </button>
        </div>
      )}

      {/* BẢNG BÁO CÁO - BỌC TRONG BỘ LỌC PRINTABLE-AREA */}
      <div className="printable-area relative overflow-x-auto bg-white shadow-xs rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left text-slate-700">
          <thead className="text-xs uppercase bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th scope="col" className="px-4 py-3 text-center w-12">STT</th>
              <th scope="col" className="px-4 py-3 w-40">Khu vực</th>
              <th scope="col" className="px-4 py-3 w-44">Tên Camera</th>
              <th scope="col" className="px-4 py-3 w-36">IP</th>
              <th scope="col" className="px-4 py-3 w-36">Đầu ghi/Kênh</th>
              <th scope="col" className="px-4 py-3 w-36">Trạng thái</th>
              <th scope="col" className="px-4 py-3 w-36">Lưu hình</th>
              <th scope="col" className="px-4 py-3 w-40">Lần kiểm tra cuối</th>
              <th scope="col" className="px-4 py-3 min-w-[180px]">Ghi chú</th>
              <th scope="col" className="px-4 py-3 text-center w-16 print:hidden">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan="10" className="py-8 text-center text-slate-400">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mb-2"></div>
                  <p>Đang tải dữ liệu camera...</p>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-center font-medium text-slate-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={row.khu_vuc || ""}
                      onChange={(e) => handleInputChange(index, "khu_vuc", e.target.value)}
                      onBlur={(e) => handleUpdateField(row.id, "khu_vuc", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 font-medium text-slate-800"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={row.ten_camera || ""}
                      onChange={(e) => handleInputChange(index, "ten_camera", e.target.value)}
                      onBlur={(e) => handleUpdateField(row.id, "ten_camera", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 font-semibold text-slate-900"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={row.ip_address || ""}
                      onChange={(e) => handleInputChange(index, "ip_address", e.target.value)}
                      onBlur={(e) => handleUpdateField(row.id, "ip_address", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 font-mono text-slate-600"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={row.dau_ghi_kenh || ""}
                      onChange={(e) => handleInputChange(index, "dau_ghi_kenh", e.target.value)}
                      onBlur={(e) => handleUpdateField(row.id, "dau_ghi_kenh", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 text-slate-600"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          row.trang_thai === "Online"
                            ? "bg-emerald-500"
                            : row.trang_thai === "Offline"
                            ? "bg-red-500"
                            : "bg-amber-500"
                        }`}
                      ></span>
                      <select
                        value={row.trang_thai || "Online"}
                        onChange={(e) => {
                          handleInputChange(index, "trang_thai", e.target.value);
                          handleUpdateField(row.id, "trang_thai", e.target.value);
                        }}
                        className="bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded text-slate-800 font-medium py-0.5 cursor-pointer"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Lỗi">Lỗi</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={row.luu_hinh || "Bình thường"}
                      onChange={(e) => {
                        handleInputChange(index, "luu_hinh", e.target.value);
                        handleUpdateField(row.id, "luu_hinh", e.target.value);
                      }}
                      className="bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded text-slate-700 py-0.5 cursor-pointer"
                    >
                      <option value="Bình thường">Bình thường</option>
                      <option value="Mất">Mất</option>
                      <option value="Chập chờn">Chập chờn</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs font-medium">
                    {formatDate(row.lan_kiem_tra_cuoi)}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      placeholder="Ghi chú..."
                      value={row.ghi_chu || ""}
                      onChange={(e) => handleInputChange(index, "ghi_chu", e.target.value)}
                      onBlur={(e) => handleUpdateField(row.id, "ghi_chu", e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-1 text-slate-600"
                    />
                  </td>
                  <td className="px-4 py-3 text-center print:hidden">
                    <button
                      onClick={() => handleDeleteRow(row.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Xóa camera"
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
                <td colSpan="10" className="py-8 text-center text-slate-400">
                  {searchTerm ? "Không tìm thấy kết quả phù hợp." : "Chưa có dữ liệu camera. Bấm \"+ Thêm Camera\" để tạo mới."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckcamPage;