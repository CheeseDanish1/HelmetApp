import axios from "axios";
import { SERVER_URL } from "../constants.json";

export async function addHelmet({ id }: { id: any }) {
  return axios({
    url: `${SERVER_URL}/api/helmet`,
    method: "PUT",
    withCredentials: true,
    data: { id },
  });
}

export async function addChild_api({
  first_name,
  last_name,
  age,
  helmet_id,
}: {
  first_name: string;
  last_name: string;
  age: number;
  helmet_id: string;
}) {
  return axios({
    url: `${SERVER_URL}/api/child`,
    method: "PUT",
    withCredentials: true,
    data: { first_name, last_name, age, helmet_id },
  });
}

export async function getHelmets() {
  return axios({
    url: `${SERVER_URL}/api/helmets`,
    method: "get",
    withCredentials: true,
  });
}

export async function removeHelmet({ id }: { id: any }) {
  return axios({
    url: `${SERVER_URL}/api/helmet`,
    method: "DELETE",
    withCredentials: true,
    data: { id },
  });
}

export async function logout({ expoPushToken }: { expoPushToken: any }) {
  return axios({
    url: `${SERVER_URL}/auth/local/logout`,
    method: "POST",
    withCredentials: true,
    data: { token: expoPushToken },
  });
}

export function saveNotificationToken({ token }: { token: any }) {
  return axios({
    url: `${SERVER_URL}/api/notification_token`,
    method: "POST",
    withCredentials: true,
    data: { token },
  });
}

export function crashDetected() {
  return axios({
    url: `${SERVER_URL}/api/crash_detected`,
    method: "PUT",
    withCredentials: true,
  });
}

export async function getUser() {
  return axios({
    url: `${SERVER_URL}/auth/local/user`,
    method: "GET",
    withCredentials: true,
  });
}

export async function login({
  password,
  email,
}: {
  password: string;
  email: string;
}) {
  return axios({
    url: `${SERVER_URL}/auth/local/login`,
    method: "POST",
    withCredentials: true,
    data: { password, email },
  });
}

export async function signup_api({
  password,
  email,
  phone,
  first_name,
  last_name,
}: {
  password: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
}) {
  return axios({
    url: `${SERVER_URL}/auth/local/signup`,
    method: "POST",
    withCredentials: true,
    data: { password, email, phone, first_name, last_name },
  });
}
