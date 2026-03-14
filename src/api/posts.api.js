import api from "./axios.js";

class PostsApi {
    async fetchPosts(params = {}) {
        const { data } = await api.get("/posts", { params });
        return data;
    }

    async fetchPostById(id) {
        const { data } = await api.get(`/posts/${id}`);
        return data;
    }

    async createPost(payload) {
        const { data } = await api.post("/posts", payload);
        return data?.result ?? data;
    }

    async updatePost(id, payload) {
        const { data } = await api.put(`/posts/${id}`, payload);
        return data;
    }

    async deletePost(id) {
        await api.delete(`/posts/${id}`);
        return id;
    }
}

export const postsApi = new PostsApi();