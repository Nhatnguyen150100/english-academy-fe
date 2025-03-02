import axiosRequest from '../plugins/request';
import { IChangePass, ILogin, IResponseLogin } from '../types/auth.tyes';
import { IBaseResponse } from '../types/response.types';
import { IUser } from '../types/user.types';
import onRemoveParams from '../utils/functions/on-remove-params';
import { IPagination } from './pagination.types';

class AuthService {
  private _prefixURL = '/v1/auth';

  public async login(data: ILogin): Promise<IBaseResponse<IResponseLogin>> {
    try {
      const rs = await axiosRequest.post(`${this._prefixURL}/login`, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getListUser(parameters: Record<string, any>): Promise<IBaseResponse<IPagination<IUser>>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/list-user`, {
        params: onRemoveParams(parameters),
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async updateAccountType(userId: string, accountType: "PREMIUM" | "FREE"): Promise<IBaseResponse<IUser>> {
    try {
      const rs = await axiosRequest.put(`${this._prefixURL}/update-account-type/${userId}`, {
        accountType,
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async register(data: ILogin): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.post(`${this._prefixURL}/register`, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async changePassword(data: IChangePass): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.post(
        `${this._prefixURL}/change-password`,
        data,
      );
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async resetPasswordRequest(
    email: string,
  ): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.post(
        `${this._prefixURL}/reset-password-request`,
        {
          email,
        },
      );
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async resetPassword(
    token: string,
    password: string,
  ): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.post(
        `${this._prefixURL}/reset-password`,
        {
          token,
          password,
        },
      );
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default AuthService;
