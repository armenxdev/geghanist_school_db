import api from "./axios.js";

class StaffApi {
    async fetchStaff({ page = 1, limit = 10 } = {}) {
        const { data } = await api.get("/staff", { params: { page, limit } });
        return data;
    }

    async createEmployee({ fullName, role }) {
        const { data } = await api.post("/staff", { fullName, role });
        return data;
    }

    async updateEmployee(id, { fullName, role }) {
        const { data } = await api.put(`/staff/${id}`, { fullName, role });
        return data;
    }

    async deleteEmployee(id) {
        await api.delete(`/staff/${id}`);
        return id;
    }
}

export const staffApi = new StaffApi();