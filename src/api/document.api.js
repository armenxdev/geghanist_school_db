import api from "./axios.js";

class DocumentApi {
    async fetchReports({ page = 1, limit = 15, search = "", orderBy = "", type = "" } = {}) {
        const params = { page, limit };
        if (search)  params.search  = search;
        if (orderBy) params.orderBy = orderBy;
        if (type)    params.type    = type;

        const { data } = await api.get("/reports", { params });
        return data;
    }

    async createReport({ title, file, type }) {
        const fd = new FormData();
        fd.append("title", title.trim());
        fd.append("file", file);
        fd.append("type", type);

        const { data } = await api.post("/reports", fd, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data.report ?? data;
    }

    async deleteReport(id) {
        await api.delete(`/reports/${id}`);
        return id;
    }
}

export const documentApi = new DocumentApi();