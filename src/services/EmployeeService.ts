import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { EmployeeModel } from "../models/EmployeeModels";
import app from "../firebaseconfig";
import { deleteData, getData, updateData } from "./BaseService";

const db = getDatabase(app);

export const addEmployee = async (employee: Omit<EmployeeModel, "id">) => {
  try {
    const newRef = push(ref(db, "employees"));
    const newEmployee: EmployeeModel = {
      id: newRef.key || "",
      ...employee,
    };
    await set(newRef, newEmployee);
    return newEmployee;
  } catch (error) {
    console.error("Lỗi khi thêm nhân viên: ", error);
    throw error;
  }
};

export const listenEmployees = (
  callBack: (employees: EmployeeModel[]) => void
) => {
  const employeesRef = ref(db, "employees");

  onValue(employeesRef, (snapshot) => {
    const employeesData = snapshot.val() as Record<
      string,
      EmployeeModel
    > | null;
    const employeesList = employeesData ? Object.values(employeesData) : [];
    callBack(employeesList);
  });
};

export const getListEmployees = async () => {
  try {
    return await getData("employees");
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhân viên: ", error);
    throw error;
  }
};

export const updateEmployee = async (
  id: string,
  data: Partial<EmployeeModel>
) => {
  try {
    return await updateData(`employees/${id}`, data);
  } catch (error) {
    console.error("Lỗi cập nhật nhân viên: ", error);
    throw error;
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    return await deleteData(`employees/${id}`);
  } catch (error) {
    console.error("lỗi khi xóa nhân viên: ", error);
    throw error;
  }
};
