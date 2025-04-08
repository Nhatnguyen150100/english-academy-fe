import axiosRequest from '../plugins/request';
import { IChapter } from '../types/chapter.types';
import { ICourse } from '../types/course.type';
import { IBaseResponse } from '../types/response.types';
import onRemoveParams from '../utils/functions/on-remove-params';
import { IPagination } from './pagination.types';

class ChapterService {
  private _prefixURL = '/v1/chapter';

  public async createChapter(
    data: Record<string, any>,
  ): Promise<IBaseResponse<IChapter>> {
    try {
      const rs = await axiosRequest.post(this._prefixURL, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getAllChapter(
    parameters: Record<string, any>,
  ): Promise<IBaseResponse<IPagination<IChapter>>> {
    try {
      const rs = await axiosRequest.get(this._prefixURL, {
        params: onRemoveParams(parameters),
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async updateChapter(
    id: string,
    data: Record<string, any>,
  ): Promise<IBaseResponse<IChapter>> {
    try {
      const rs = await axiosRequest.put(`${this._prefixURL}/${id}`, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async deleteChapter(id: string): Promise<IBaseResponse<IChapter>> {
    try {
      const rs = await axiosRequest.delete(`${this._prefixURL}/${id}`);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getChapterDetail(
    courseId: string,
  ): Promise<IBaseResponse<IChapter>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/${courseId}`);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default ChapterService;
