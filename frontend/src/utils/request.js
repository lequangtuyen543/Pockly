import { getCookie } from "../helpers/cookie";

const api_domain = "http://localhost:3002/api/v1/";
// const api_domain = "https://cleanblog-be2.vercel.app/api/v1/";

export const GET = async (path) => {
  const token = getCookie("token");
  const response = await fetch(api_domain + path, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const result = await response.json();
  return result;
}

export const POST = async (path, data) => {
  const token = getCookie("token");
  const response = await fetch(api_domain + path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  return result;
}

export const PATCH = async (path, data) => {
  const token = getCookie("token");
  const response = await fetch(api_domain + path, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  return result;
}

export const DELETE = async (path) => {
  const token = getCookie("token");
  const response = await fetch(api_domain + path, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const result = await response.json();
  return result;
}