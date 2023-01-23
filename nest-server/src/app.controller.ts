import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

// Controller implementation

@Controller() // Root segment, default route is '/'
export class AppController {
  // Dependency injection
  constructor(private readonly appService: AppService) {}

  @Get() // Sub segment, default route is '/'
  @Header('Content-Type', 'text/plain') // Set response header manually
  getHello(): string {
    return this.appService.getHello();
  }
}
