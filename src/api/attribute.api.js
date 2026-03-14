import api from "./axios.js";

class SchoolApi {
    async fetchAttributes() {
        const { data } = await api.get("/attributes");
        return data;
    }

    async addAttribute(payload) {
        const { data } = await api.post("/attributes", payload);
        return data?.result ?? data;
    }

    async updateAttribute(id, payload) {
        const { data } = await api.put(`/attributes/${id}`, payload);
        return data?.updated ?? data;
    }

    async deleteAttribute(id) {
        await api.delete(`/attributes/${id}`);
        return id;
    }
}

export const schoolApi = new SchoolApi();