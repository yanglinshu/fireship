import { Injectable } from '@nestjs/common';

// Service implementation

@Injectable() // Injectable service
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
