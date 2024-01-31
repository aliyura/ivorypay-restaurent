import { HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from '../dtos/ApiResponse.dto';
import { Messages } from '../utils/messages/messages';

export type HttpClient = (
  path: string,
  queryParam: { [key: string]: string | number | boolean },
  headers: { [key: string]: string | number | boolean },
) => Promise<unknown>;

export class Helpers {
  /**
   * Sends default JSON resonse to client
   * @param {*} res
   * @param {*} content
   * @param {*} message
   */

  /**
   * Sends error resonse to client
   * @param {*} content
   * @param {*} message
   * @param {*} status
   */
  static response(
    status: HttpStatus,
    message: string,
    payload: any = null,
  ): ApiResponse {
    const data = {
      success: status == HttpStatus.CREATED || HttpStatus.OK ? true : false,
      message,
      payload,
    } as ApiResponse;

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

  static getUniqueId(): Promise<string> {
    const id = uuidv4();
    const uid = id.split('-').join('');
    return uid.substring(0, 11).toLowerCase();
  }

  static validEmailAddress(emailAddress: string): boolean {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const result = emailAddress.match(regex);
    if (result) return true;

    return false;
  }
}
