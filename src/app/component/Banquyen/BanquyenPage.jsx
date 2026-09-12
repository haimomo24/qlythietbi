import React from 'react'

const BanquyenPage = () => {
  return (
    <div>
          <div class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
    <table class="w-full text-sm text-left rtl:text-right text-body">
        <thead class="text-sm text-body bg-green-200 border-b rounded-base border-default">
            <tr>
                <th scope="col" class="px-6 py-3 font-medium">
                    Tên 
                </th>
                <th scope="col" class="px-6 py-3 font-medium">
                    Key 
                </th>
                <th scope="col" class="px-6 py-3 font-medium">
                    Số lượng
                </th>
                <th scope="col" class="px-6 py-3 font-medium">
                    Giá
                </th>
                <th scope="col" class="px-6 py-3 font-medium">
                    Ngày nhập
                </th>
                <th scope="col" class="px-6 py-3 font-medium">
                    Hình ảnh 
                </th>
                <th scope="col" class="px-6 py-3 font-medium">
                    Lịch sử  
                </th>
                <th scope="col" class="px-6 py-3 font-medium">
                    Ghi chú  
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-neutral-primary border-b border-default">
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                   Window
                </th>
                <td class="px-6 py-4">
                    Silver
                </td>
                <td class="px-6 py-4">
                    Laptop
                </td>
                <td class="px-6 py-4">
                    $2999
                </td>
                <td class="px-6 py-4">
                    231
                </td>
            </tr>
            <tr class="bg-neutral-primary border-b border-default">
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    Đầu ghi 
                </th>
                <td class="px-6 py-4">
                    White
                </td>
                <td class="px-6 py-4">
                    Laptop PC
                </td>
                <td class="px-6 py-4">
                    $1999
                </td>
                <td class="px-6 py-4">
                    423
                </td>
            </tr>
            <tr class="bg-neutral-primary">
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    Magic Mouse 2
                </th>
                <td class="px-6 py-4">
                    Black
                </td>
                <td class="px-6 py-4">
                    Accessories
                </td>
                <td class="px-6 py-4">
                    $99
                </td>
                <td class="px-6 py-4">
                    121
                </td>
            </tr>
        </tbody>
    </table>
</div>
    </div>
  )
}

export default BanquyenPage