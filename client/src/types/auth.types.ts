 export interface LoginPayload{
    email:string;
    password:string;

}
export interface RegisterPayload{
    username:string;
    email:string;
    password:string;
    
}
export interface AuthResponse{

    token:string;
    user:{
        id:number;
        email:string;
        username:string
    }
}

export interface IProfile {
  status: number;
  message: string;
  data: IProfileData;
}

export interface IProfileData {
  id: string;
  username: string;
  email: string;
  roles: string;
}
export interface ILogout{
    status:number,
    message:string,
    data:null
}