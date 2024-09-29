"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faPlus,
  faTrashCan, 
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Pagination } from "antd";
import FormComponent from "./form";
import { useRouter, useSearchParams } from "next/navigation"; 
import { IEmployee } from "../../../Types/employee.type";
import Utils from "../../../Utils/utils";

const List: React.FC = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(
    null
  );
  const [editing, setEditing] = useState<IEmployee>();
  const [open, setOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const searchParams = useSearchParams(); 
  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const router = useRouter();
  const SalaryHeadinginModal = ["Salary", "Salary Month", "PF"];
  const ListHeading = [
    "S.No",
    "Name",
    "Age",
    "Gender",
    "Date",
    "Feedback",
    "Country",
    "Region",
  ];

  const utils = new Utils();

  const handleImageClick = (imageUrl: string) => {
    setZoomedImage(imageUrl);
  };

  const handleCloseZoom = () => {
    setZoomedImage(null);
  };

  const fetchEmployees = async () => {
    try {
      const data = await utils.get("/posts");
      console.log("Get" ,data);
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  const paginatedEmployees = employees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize 
  );

  useEffect(() => {
    console.log("useeffect");
    // utils.test();
    fetchEmployees();
  }, [editing]); 

  const handleDelete = async (employeeId: string) => {
    try {
      await utils.delete(`/posts/${employeeId}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleAddClick = () => {
    setEditing(undefined);
    setOpen(true);
  };

  const handleEdit = (employee: IEmployee) => {
    setEditing(employee);
    setOpen(true);
  };

  const handleView = (employee: IEmployee) => {
    setSelectedEmployee(employee);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedEmployee(null);
  };

  const renderEmployeeDetailsModal = () => {
    if (!selectedEmployee) return null;

    return (
      <Modal
        title="Employee Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        width="80%"
        style={{ position: "absolute", top: 5, left: 140 }}
      >
        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {selectedEmployee.name}
          </p>
          <p>
            <strong>Age:</strong> {selectedEmployee.age}
          </p>
          <p>
            <strong>Gender:</strong> {selectedEmployee.gender}
          </p>
          <p>
            <strong>Feedback:</strong> {selectedEmployee.feedback}
          </p>
          <p>
            <strong>Country:</strong> {selectedEmployee.country}
          </p>
          <p>
            <strong>Region:</strong> {selectedEmployee.region}
          </p>

          {selectedEmployee.salaryFields &&
          selectedEmployee.salaryFields.length > 0 ? (
            <div>
              <p>
                <strong>Salary Details:</strong>
              </p>
              <table className="w-full min-w-max divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    {SalaryHeadinginModal.map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedEmployee.salaryFields.map((salaryField, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {salaryField.salary}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {salaryField.monthOfSalary}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {salaryField.pf}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No salary details available.</p>
          )}

          {selectedEmployee.images && selectedEmployee.images.length > 0 ? (
            <div>
              <p>
                <strong>Images:</strong>
              </p>
              <div className="flex flex-wrap gap-4">
                {selectedEmployee.images.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Employee Image ${index + 1}`}
                    className="w-24 h-24 object-cover cursor-pointer border rounded-md"
                    onClick={() => handleImageClick(imageUrl)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p>No images available.</p>
          )}
        </div>
      </Modal>
    );
  };

  const renderTable = () => {
    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full" style={{ width: "100%" }}>
          <thead className="border-b-2 border-emerald-200">
            <tr className="font-medium">
              {ListHeading.map((heading) => (
                <th
                  key={heading}
                  className="font-[0.1rem] text-sm border-t-2 border-l-2 border-emerald-200"
                >
                  {heading}
                </th>
              ))}
              <th className="font-medium w-[1%] border-t-2 border-l-2 border-emerald-200 border-r-2 ">
                <FontAwesomeIcon
                  icon={faPlus} 
                  style={{ color: "#63E6BE", fontSize: "1rem" }}
                  onClick={handleAddClick}
                  className="cursor-pointer hover:scale-105 transition-transform duration-150"
                  title="Add Employee"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map((employee, index) => (
              <tr
                key={employee.id}
                className="border-b-2 border-r-2 border-l-2 border-emerald-200"
              >
                <td className="text-sm font-normal w-[3%] text-gray-900 border-r-2 border-emerald-200 text-center">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td className="text-sm w-[15%] font-normal text-red-900 border-r-2 border-emerald-200 text-left">
                  {employee.name}
                </td>
                <td className="text-sm font-normal w-[3%] text-gray-900 border-r-2 border-emerald-200 text-center">
                  {employee.age}
                </td>
                <td className="text-sm w-[5%] font-normal text-gray-900 border-r-2 border-emerald-200 text-left">
                  {employee.gender}
                </td>
                <td className="text-sm w-[7%] font-normal text-gray-900 border-r-2 border-emerald-200 text-center">
                  {employee.date}
                </td>
                <td className="text-sm font-normal w-[15%] text-gray-900 border-r-2 border-emerald-200 text-left">
                  {employee.feedback}
                </td>
                <td className="text-sm font-normal w-[17%] text-gray-900 border-r-2 border-emerald-200 text-left">
                  {employee.country}
                </td>
                <td className="text-sm font-normal w-[17%] text-gray-900 border-r-2 border-emerald-200 text-left">
                  {employee.region}
                </td>
                <td className="font-normal text-gray-900 text-right flex gap-[1px] ">
                  <Button
                    type="link"
                    icon={
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        style={{ color: "#7c7979" }}
                      />
                    }
                    onClick={() => handleEdit(employee)}
                    title="Edit"
                    className="text-blue-600 hover:text-blue-900"
                  />
                  <Button
                    type="link"
                    icon={
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        style={{ color: "#7c7979" }}
                      />
                    }
                    onClick={() => handleDelete(employee.id)}
                    title="Delete"
                    className="text-red-600 hover:text-red-900"
                  />
                  <Button
                    type="link"
                    icon={
                      <FontAwesomeIcon
                        icon={faEye}
                        style={{ color: "#7c7979" }}
                      />
                    }
                    onClick={() => handleView(employee)}
                    title="View"
                    className="text-green-600 hover:text-green-900"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const isEmployeesListEmpty = (employees: string | any[]) => {
    return employees.length === 0;
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    const params = new URLSearchParams({ page: page.toString() });
    if (pageSize) {
        params.set("pageSize", pageSize.toString());
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employee List</h1>
      </div>
      {isEmployeesListEmpty(employees) && (
        <p className="text-gray-500 text-center text-lg">
          No employees available.
        </p>
      )}

      {renderTable()}

      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={employees.length}
          onChange={handlePageChange}
          showSizeChanger
        />
      </div>

      {renderEmployeeDetailsModal()}

      {zoomedImage && (
        <Modal
          open={!!zoomedImage}
          onCancel={handleCloseZoom}
          footer={null}
          width="50%"
        >
          <img
            src={zoomedImage}
            alt="Zoomed Image"
            style={{ width: "100%", height: "auto" }}
            className="object-contain"
          />
        </Modal>
      )}

      <FormComponent
        open={open}
        setOpen={setOpen}
        editing={editing}
        fetchemployee={fetchEmployees}
      />
    </div>
  );
};

export default List;
