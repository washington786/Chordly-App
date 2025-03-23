import { fetchFromStorage } from "@utils/AsyncStorage";
import { Keys } from "@utils/enums";
import axios, { CreateAxiosDefaults } from "axios";

const baseUrl = "https://chordly-server-ey1woymm8-washington786s-projects.vercel.app";

const client = axios.create({
  baseURL: "https://chordly-server-ey1woymm8-washington786s-projects.vercel.app",
});

type headers = CreateAxiosDefaults<any>['headers'];

export async function getClient(headers?: headers) {
  const token = await fetchFromStorage(Keys.AUTH_TOKEN);
  if (!token) {
    return axios.create({
      baseURL: baseUrl,
    });
  }
  const defaultHeaders = {
    Authorization: "Bearer " + token,
    ...headers,
  };
  return axios.create({
    baseURL: baseUrl,
    headers: defaultHeaders,
  });
}

export default client;
