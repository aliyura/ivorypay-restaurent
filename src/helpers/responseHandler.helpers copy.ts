import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '../dtos/ApiResponse.dto';
import { Messages } from '../utils/messages/messages';

export type HttpClient = (
  path: string,
  queryParam: { [key: string]: string | number | boolean },
  headers: { [key: string]: string | number | boolean },
) => Promise<unknown>;

export class Response {
  static send(
    status: HttpStatus,
    message: string,
    payload: any = null,
  ): ApiResponse {
    const data = {
      success:
        status == HttpStatus.CREATED || status == HttpStatus.OK ? true : false,
      message,
      payload,
    } as ApiResponse;

    console.log(data);

    if (!payload) delete data.payload;
    throw new HttpException(data, status);
  }

  static success(content: any): ApiResponse {
    const data = {
      success: true,
      message: Messages.RequestSuccessful,
      payload: content,
    } as ApiResponse;
    return data;
  }

  static failure(message): ApiResponse {
    const data = {
      success: false,
      message,
    } as ApiResponse;
    return data;
  }
}
