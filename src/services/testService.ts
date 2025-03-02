import axiosRequest from '../plugins/request';
import { IQueryExam } from '../types/exam.types';
import { IBaseResponse, IBaseResponseList } from '../types/response.types';
import { IProcess, ITest } from '../types/test.types';
import onRemoveParams from '../utils/functions/on-remove-params';

class TestService {
  private _prefixURL = '/v1/test';

  public async saveScore(
    data: Record<string, any>,
  ): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.post(this._prefixURL, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getAllScoreTest(
    id: string,
    query: Partial<IQueryExam>,
  ): Promise<IBaseResponse<IBaseResponseList<ITest[]>>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/${id}`, {
        params: onRemoveParams(query),
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getProcess(
    id: string,
  ): Promise<IBaseResponse<IProcess[]>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/process/${id}`);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default TestService;
