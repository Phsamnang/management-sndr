import axios from "axios";
import {getSession, signOut} from "next-auth/react";
import {Session} from "next-auth";

const baseURLAPI =
  process.env.NEXT_PUBLIC_POS_API || "http://54.254.13.51:8080";

export const http = axios.create({
  baseURL:`${baseURLAPI}/api/v1`,
});

http.interceptors.request.use(async (request) => {
  const userSession: Session | null = await getSession();

  if (!userSession) return request;

  request.headers.Authorization = `Bearer ${(userSession)?.user?.accessToken}`;
  try { request.headers['X-Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone; }
  catch (e) { console.log(e) }
  return request;
});

http.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const response = error?.response
      if (!response) {
        return Promise.reject(error);
      } else if (response.status === 401) {
        return signOut({
          callbackUrl: `/login`,
          redirect: true
        });
      } else {
        const data = response?.data
        const error = (data && data?.message) || response.statusText || data?.status?.message;

        return Promise.reject({
          message: error,
          data: data.data,
          status: response.status
        });
      }
    },
);


declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as
   * a prop on the `SessionProvider` React Context
   */
  interface Session {
    refreshTokenExpires?: number;
    accessTokenExpires?: number;
    refreshToken?: string;
    accessToken?: string;
    error?: string;
    user?: User;
    visitor_id?: string;
  }

  interface User {
      accessToken: string;
  }
}