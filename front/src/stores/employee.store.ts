import { create } from 'zustand';
import { toast } from 'sonner';
import type { 
  Employee, 
  createEmployeeDto, 
  GetEmployeesQuery, 
  EmployeesResponse, 
  updateEmployee 
} from '@/types/employee.type';
import * as employeeService from '@/services/employee.service';
import axios from 'axios';

interface EmployeeStore {
  employees: Employee[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  
  fetchEmployees: (query?: GetEmployeesQuery) => Promise<void>;
  createEmployee: (data: createEmployeeDto) => Promise<Employee | undefined>;
  updateEmployee: (id: string, data: updateEmployee) => Promise<Employee | undefined>;
  // Nếu sau này có API hủy kích hoạt (xóa mềm) nhân viên thì dùng hàm này
  deactiveEmployee: (id: string) => Promise<boolean>;
}

// Hàm parse lỗi Axios xịn xò từ room.store của bạn
const getErrorMessage = (error: unknown, defaultMsg: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const responseError = error as { response?: { data?: { message?: string } } };
    if (responseError.response?.data?.message) return responseError.response.data.message;
  }
  if (axios.isAxiosError(error) && error.response?.data?.message) return error.response.data.message;
  if (error instanceof Error) return error.message;
  return defaultMsg;
};

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,

  fetchEmployees: async (query) => {
    set({ loading: true });
    try {
      const res: EmployeesResponse = await employeeService.getEmployees(query);

      console.log('API Response:', res);
      console.log('employees:', res.data);
      console.log('isArray:', Array.isArray(res.data));
      set({
        employees: res.data.data||[],
        total: res.data.total,
        page: res.data.page,
        totalPages: res.data.totalPages,
      });
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Không thể tải danh sách nhân viên');
      toast.error(message);
      console.error('fetchEmployees error:', error);
    } finally {
      set({ loading: false });
    }
  },

  createEmployee: async (data) => {
    set({ loading: true });
    try {
      const newEmployee = await employeeService.createEmployee(data);
      // Reload lại data ở trang hiện tại sau khi thêm
      await get().fetchEmployees({ page: get().page });
      toast.success('Thêm nhân viên thành công');
      return newEmployee;
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Có lỗi xảy ra khi thêm nhân viên');
      toast.error(message);
      console.error('createEmployee error:', error);
      return undefined;
    } finally {
      set({ loading: false });
    }
  },

  updateEmployee: async (id, data) => {
    set({ loading: true });
    try {
      const updated = await employeeService.adminUpdateEmployee(id, data);
      await get().fetchEmployees({ page: get().page });
      toast.success('Cập nhật thông tin nhân viên thành công');
      return updated;
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Có lỗi xảy ra khi cập nhật nhân viên');
      toast.error(message);
      return undefined;
    } finally {
      set({ loading: false });
    }
  },

  deactiveEmployee: async(id) => {
    set({ loading: true });
    try {
      // Giả sử sau này bạn có hàm deleteEmployee trong service
      await employeeService.deleteEmployee(id);
      await get().fetchEmployees({ page: get().page }); 
      toast.success('Hủy kích hoạt nhân viên thành công');
      return true; 
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Có lỗi xảy ra khi hủy kích hoạt');
      toast.error(message);
      console.error('deactiveEmployee error:', error);
      return false; 
    } finally {
      set({ loading: false });
    }
  },
}));