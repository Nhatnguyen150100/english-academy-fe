import axiosRequest from "../plugins/request";
import { ICourse } from "../types/course.type";
import { IBaseResponse } from "../types/response.types";
import onRemoveParams from "../utils/functions/on-remove-params";
import { IPagination } from "./pagination.types";

class CourseService {
  private _prefixURL = '/v1/courses';


  public async createCourse(data: Record<string, any>): Promise<IBaseResponse<ICourse>> {
    try {
      const rs = await axiosRequest.post(this._prefixURL, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getAllCourse(parameters: Record<string, any>): Promise<IBaseResponse<IPagination<ICourse>>> {
    try {
      const rs = await axiosRequest.get(this._prefixURL, {
        params: onRemoveParams(parameters)
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async updateCourse(id: string, data: Record<string, any>): Promise<IBaseResponse<ICourse>> {
    try {
      const rs = await axiosRequest.put(`${this._prefixURL}/${id}`, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getCourseDetail(courseId: string): Promise<IBaseResponse<ICourse>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/${courseId}`);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default CourseService;
