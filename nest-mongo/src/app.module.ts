import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

import * as dotenv from 'dotenv';
import * as path from 'node:path';

dotenv.config({
  path: path.join(
    path.resolve(process.cwd()),
    `.env.${process.env.NODE_ENV || 'development'}`,
  ),
});

// Module declaration, convert controller and service to a module

@Module({
  imports: [ProductsModule, MongooseModule.forRoot(process.env.MONGODB_URL)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
