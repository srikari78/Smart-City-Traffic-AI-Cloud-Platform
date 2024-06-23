import React, { useState, useEffect } from "react";
import Switch from "react-switch";
import ConfirmationPopup from "./ConfirmationPopup";

export default function Table(props) {
  // State to manage the checked state of the switch

  const [checked, setChecked] = useState(() => {
    if (props.type === 'iot') {
      return props.data.map(item => item.enabled);
    } else {
      return props.data.map(item => item.status === "active");
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = props.data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(props.data.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to handle switch state change
  const handleChange = (id, index, newStatus) => {
    setChecked((prevChecked) => {
      const newChecked = [...prevChecked];
      newChecked[index] = newStatus;
      return newChecked;
    });
    props.callback(id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">dist_id</th>
            <th className="px-4 py-2">latitude</th>
            <th className="px-4 py-2">longitude</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="border px-4 py-2 text-center">{item.id}</td>
              <td className="border px-4 py-2 text-center">{item.dist_id}</td>
              <td className="border px-4 py-2 text-center">{item.latitude}</td>
              <td className="border px-4 py-2 text-center">{item.longitude}</td>
              <td className="border px-4 py-2 text-center">{item.address}</td>
              <td className="border px-4 py-2 text-center">
                <Switch
                  checked={checked[index]} // Specify the current state of the switch
                  onChange={() => handleChange(item.id, index, !checked[index])} // Handle switch state change
                />
              </td>

              <td className="border px-4 py-2 text-center">
                <ConfirmationPopup
                  message="Are you sure to delete this device?"
                  onConfirm={() => props.callback2(item.id)}
                  buttonText="Delete"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
          <div className="flex items-center justify-center mt-4">
            <button
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
              className="h-8 px-4 text-blue-500 border-blue-500 border text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 ease-in-out mx-1"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              onKeyUp={(e) =>
                e.key === "Enter" && handlePageChange(Number(e.target.value))
              }
              className="h-8 w-8 text-center mx-1 border-blue-500 border text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 ease-in-out"
            />
            <button
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
              className="h-8 px-4 text-blue-500 border-blue-500 border text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 ease-in-out mx-1"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <div className="flex items-center justify-center mt-4">
            Pages {currentPage} of {totalPages}
          </div>
        </div>
    </div>
  );
}
