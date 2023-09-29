import { Injectable } from '@nestjs/common';

@Injectable()
export class DaprRequestParserService {
  Parse<T>(body: any): T {
    if (body.data) {
      return body.data as T;
    }
  }
}
