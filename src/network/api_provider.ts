/* eslint-disable prefer-const */
import { showNotification } from "@mantine/notifications";
import { AxiosError } from "axios";
import ApiClient from "./api_client";

class ApiProvider {
  showAlert(message: string, success: boolean) {
    showNotification({
      color: success ? "green" : "red",
      title: success ? "Success" : "Error",
      message,
    });
  }

  axiosError(error: any) {
    let message = "Something went wrong";
    if (error instanceof AxiosError && error.response) {
      message = error.response.data?.message ?? message;
    } else {
      message = error.toString();
    }
    this.showAlert(message, false);
  }

  async fetchUserData(params: any) {
    try {
      const result = await ApiClient.get<any | null>("user", {
        params: params,
      });
      const statusCode = result.status ?? 0;
      const message = "Something went wrong";
      if (statusCode === 200 || statusCode === 201) {
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);

      return null;
    }
  }

  async get_dashboard() {
    try {
      const result = await ApiClient.get<any | null>("dashboard");
      const statusCode = result.status ?? 0;
      const message = "Something went wrong";
      if (statusCode === 200 || statusCode === 201) {
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async addUser(data: any) {
    try {
      const result = await ApiClient.post<any | null>("/user", data);
      let statusCode = result.status ?? 0;
      let message = result.data?.message ?? "something went Wrong";
      if (statusCode == 200 || statusCode == 201) {
        message = "User added successfully";
        this.showAlert(message, true);
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async EditUser(userId: any, data: any) {
    try {
      const result = await ApiClient.patch<any | null>(`/user/${userId}`, data);
      let statusCode = result.status ?? 0;
      let message = result.data?.message ?? "something wennt wrong";
      if (statusCode == 200 || statusCode == 201) {
        message = "User details updated successfully";
        this.showAlert(message, true);
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async project_data(params: any) {
    try {
      const result = await ApiClient.get<any | null>("project", {
        params: params,
      });
      const statusCode = result.status ?? 0;
      const message = "Something went wrong";
      if (statusCode === 200 || statusCode === 201) {
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async create_project(data: any) {
    try {
      const result = await ApiClient.post<any | null>("/project", data);
      let statusCode = result.status ?? 0;
      let message = result.data?.message ?? "something went Wrong";
      if (statusCode == 200 || statusCode == 201) {
        message = "Project added successfully";
        this.showAlert(message, true);
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async create_task(data: any) {
    try {
      const result = await ApiClient.post<any | null>("/task", data);
      let statusCode = result.status ?? 0;
      let message = result.data?.message ?? "something went Wrong";
      if (statusCode == 200 || statusCode == 201) {
        message = "Task added successfully";
        this.showAlert(message, true);
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async get_task(params: any, taskId: any) {
    try {
      const result = await ApiClient.get<any | null>(`task/all/${taskId}`, {
        params: params,
      });
      const statusCode = result.status ?? 0;
      let message = result.data?.message ?? "Something went wrong";
      if (statusCode === 200 || statusCode === 201) {
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async update_project(data: any) {
    try {
      const result = await ApiClient.patch<any | null>("project", data);
      const statusCode = result.status ?? 0;
      let message = result.data?.message ?? "Something went wrong";
      if (statusCode === 200 || statusCode === 201) {
        message = "Project updated successfully";
        this.showAlert(message, true);
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }

  async update_task(data: any, taskId: any) {
    try {
      const result = await ApiClient.patch<any | null>(`task/${taskId}`, data);
      const statusCode = result.status ?? 0;
      let message = result.data?.message ?? "Something went wrong";
      if (statusCode === 200 || statusCode === 201) {
        message = "Task  updated successfully";
        this.showAlert(message, true);
        return result;
      } else {
        this.showAlert(message, false);
        return null;
      }
    } catch (error: any) {
      this.axiosError(error);
      return null;
    }
  }
}

const apiProvider = new ApiProvider();

export default apiProvider;
