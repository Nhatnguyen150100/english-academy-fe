import axiosRequest from "../plugins/request";
import { IBlogDetail, IBlogInfo, TStatusBlog } from "../types/blogs.types";
import { IBaseResponse } from "../types/response.types";
import onRemoveParams from "../utils/functions/on-remove-params";
import { IPagination } from "./pagination.types";

class BlogService {
  private _prefixURL = "/v1/blogs";

  public async getAllBlogs(
    parameters: Record<string, any>
  ): Promise<IBaseResponse<IPagination<IBlogInfo>>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/by-admin`, {
        params: onRemoveParams(parameters),
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getBlogDetail(
    blogId: string
  ): Promise<IBaseResponse<IBlogDetail>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/${blogId}`);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async updateStatusBlog(
    blogId: string,
    status: TStatusBlog
  ): Promise<IBaseResponse<IBlogDetail>> {
    try {
      const rs = await axiosRequest.put(
        `${this._prefixURL}/status-blog/${blogId}`,
        { status }
      );
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }


  public async deleteBlog(blogId: string): Promise<IBaseResponse<IBlogDetail>> {
    try {
      const rs = await axiosRequest.delete(`${this._prefixURL}/${blogId}`);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default BlogService;
