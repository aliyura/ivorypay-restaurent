import { v4 as uuidv4 } from 'uuid';

export type HttpClient = (
  path: string,
  queryParam: { [key: string]: string | number | boolean },
  headers: { [key: string]: string | number | boolean },
) => Promise<unknown>;

export class Helpers {
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

  static validateCordinates(lat, lon): boolean {
    const regexLat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
    const regexLon =
      /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;

    const validLat = regexLat.test(lat);
    const validLon = regexLon.test(lon);
    return validLat && validLon;
  }

  static toRad(value): number {
    return (value * Math.PI) / 180;
  }
}
