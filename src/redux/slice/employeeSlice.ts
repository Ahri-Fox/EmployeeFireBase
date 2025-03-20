import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EmployeeModel } from "../../models/EmployeeModels";
import {
  addEmployee,
  deleteEmployee,
  getListEmployees,
  listenEmployees,
  updateEmployee,
} from "../../services/EmployeeService";

const initialState = {
  employees: [] as EmployeeModel[],
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployeesRealtime: (state, action) => {
      state.employees = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllListEmployees.fulfilled, (state, action) => {
        state.employees = action.payload;
      })
      .addCase(
        createEmployee.fulfilled,
        (state, action: PayloadAction<EmployeeModel>) => {
          state.employees.push(action.payload);
        }
      )
      .addCase(modifyEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(
          (emp) => emp.id === action.payload.id
        );
        if (index !== -1) {
          state.employees[index] = {
            ...state.employees[index],
            ...action.payload.data,
          };
        }
      })
      .addCase(
        removeEmployee.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.employees = state.employees.filter(
            (emp) => emp.id !== action.payload
          );
        }
      );
  },
});
export const { setEmployeesRealtime } = employeeSlice.actions;
export default employeeSlice.reducer;

//............................THUNK..........................................

export const startListeningEmployees = createAsyncThunk(
  "employees/startListening",
  async (_, { dispatch }) => {
    listenEmployees((employees) => {
      dispatch(setEmployeesRealtime(employees));
    });
  }
);

export const getAllListEmployees = createAsyncThunk<EmployeeModel[], void>(
  "employees/getAllListEmployees",
  async () => {
    const employees = await getListEmployees();
    return employees ? Object.values(employees) : [];
  }
);

export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (employee: Omit<EmployeeModel, "id">) => {
    const newEmployee = await addEmployee(employee);
    return newEmployee;
  }
);

export const modifyEmployee = createAsyncThunk(
  "employees/modifyEmployee",
  async (
    { id, data }: { id: string; data: Partial<EmployeeModel> },
    { rejectWithValue }
  ) => {
    try {
      await updateEmployee(id, data);
      return { id, data };
    } catch (error) {
      console.error("Lỗi cập nhật nhân viên:", error);
      return rejectWithValue(error);
    }
  }
);

export const removeEmployee = createAsyncThunk(
  "employees/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteEmployee(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
