

 export const endpoints = {
   register: "/api/user/register",
   login: "/api/user/login",
   me: "api/user/me",
   getById: (id: string | number) => `/api/user/me${id}`,
   logoutApi: "api/user/logout",
 };
      //"http://192.168.1.141:3000";