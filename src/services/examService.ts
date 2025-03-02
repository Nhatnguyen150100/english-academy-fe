import axiosRequest from '../plugins/request';
import { IExamDetail } from '../types/exam.types';
import { IBaseResponse } from '../types/response.types';
import { IPagination } from './pagination.types';

class ExamService {
  private _prefixURL = '/v1/exams';

  public async getExamList(
    courseId: string,
    query: Record<string, any>,
  ): Promise<IBaseResponse<IPagination<IExamDetail>>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/list-exam-in-course/${courseId}`, { params: query });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getExamDetail(
    examId: string,
  ): Promise<IBaseResponse<IExamDetail>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/${examId}`);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async updateExam(
    examId: string,
    data: Record<string, any>,
  ): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.put(`${this._prefixURL}/${examId}`, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async createExam(
    data: Record<string, any>,
  ): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.post(`${this._prefixURL}`, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async deleteExam(
    examId: string,
  ): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.delete(`${this._prefixURL}/${examId}`);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default ExamService;
