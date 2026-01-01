import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addEmployeeStaff,
  deleteEmployeeStaff,
  getAllEmployeesStaff,
  softDeleteEmployeeStaff,
  updateEmployeeStaff,
} from "../../Apis/StaffApis";

// ================= EMPLOYEES =================

// get all employees
export const useStaffEmployees = () => {
  return useQuery({
    queryKey: ["staff-employees"],
    queryFn: getAllEmployeesStaff,
  });
};

// add employee
export const useAddEmployeeStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addEmployeeStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-employees"] });
    },
  });
};

// soft delete employee
export const useSoftDeleteEmployeeStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => softDeleteEmployeeStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-employees"] });
    },
  });
};

// hard delete employee
export const useDeleteEmployeeStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEmployeeStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-employees"] });
    },
  });
};

// update employee
export const useUpdateEmployeeStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEmployeeStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-employees"] });
    },
  });
};
