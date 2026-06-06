import apiClient from '@/lib/axios';
import type { 
  Employee, 
  createEmployeeDto, 
  updateEmployee, 
  UpdateProfileDto, 
  GetEmployeeShiftsQuery,
  GetEmployeesQuery
} from '@/types/employee.type';

export const getEmployees = async (params?: GetEmployeesQuery) => { // Thêm GetEmployeesQuery sau nếu có
  const response = await apiClient.get('/employees', { params });
  return response.data; // Trả về cả { data, total, page... } nếu có phân trang
};

export const getEmployeeById = async (id: string): Promise<Employee> => {
  const response = await apiClient.get(`/employees/${id}`);
  return response.data.data;
};

export const createEmployee = async (data: createEmployeeDto): Promise<Employee> => {
  const response = await apiClient.post('/employees', data);
  return response.data.data;
};

// Admin cập nhật thông tin nhân viên
export const adminUpdateEmployee = async (id: string, data: updateEmployee): Promise<Employee> => {
  const response = await apiClient.patch(`/employees/${id}`, data);
  return response.data.data;
};

export const updateEmployeeProfile = async (data: UpdateProfileDto): Promise<Employee> => {
  const formData = new FormData();
  
  if (data.first_name) formData.append('first_name', data.first_name);
  if (data.last_name)  formData.append('last_name', data.last_name);
  if (data.phone)      formData.append('phone', data.phone);
  if (data.gender)     formData.append('gender', data.gender);
  
  // Xử lý file ảnh giống như cách làm trong room.service[cite: 9] và profile.service
  if (data.file) {
    formData.append('file', data.file);
  }

  const response = await apiClient.patch('/employees/profile', formData, {
    // Không cần set thủ công 'Content-Type': 'multipart/form-data', 
    // Trình duyệt và Axios sẽ tự động set kèm theo boundary khi nhận diện được FormData
  });
  
  return response.data.data;
};

// Xem lịch làm việc của bản thân
export const getMyShifts = async (params?: GetEmployeeShiftsQuery) => {
  const response = await apiClient.get('/employees/profile/shifts', { params });
  return response.data.data; // Có thể đổi Type trả về tuỳ theo struct Shift của bạn
};

export const deleteEmployee = async(id: string) =>{
  const response=await apiClient.delete(`/employees/${id}`);
  return response.data.data;
}