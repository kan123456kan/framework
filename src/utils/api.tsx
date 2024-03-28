import axios, { AxiosInstance } from "axios";

export const base_url = "https://test-front.framework.team/";

const instance: AxiosInstance = axios.create({
  baseURL: base_url,
});

export interface IPaintingsResponse {
  authorId: number;
  created: string;
  id: number;
  imageUrl: string;
  locationId: number;
  name: string;
}

export interface IAuthor {
  id: number;
  name: string;
}

export interface ILocation {
  id: number;
  location: string;
}

export const api = {
  authors: async (): Promise<IAuthor[] | undefined> => {
    try {
      const response = await instance.get("authors");
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Ошибка при запросе к API:", error);
    }
  },

  paintings: async (
    q?: string,
    page = 1,
    limit = 6
  ): Promise<IPaintingsResponse[] | undefined> => {
    try {
      const response = await instance.get(
        `paintings?_page=${page}&_limit=${limit}&q=${q ?? ""}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Ошибка при запросе к API:", error);
    }
  },

  getPaintings: async (id: number): Promise<IPaintingsResponse | undefined> => {
    try {
      const response = await instance.get(`paintings?id=${id}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Ошибка при запросе к API:", error);
    }
  },

  locations: async (): Promise<ILocation[] | undefined> => {
    try {
      const response = await instance.get("locations");
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Ошибка при запросе к API:", error);
    }
  },
};
