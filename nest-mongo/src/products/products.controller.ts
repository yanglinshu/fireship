import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async addProduct(
    @Body('title') title: string,
    @Body('description') desc: string,
    @Body('price') price: number,
  ) {
    const newID = await this.productsService.insertProduct(title, desc, price);
    return {
      id: newID,
    };
  }

  @Get()
  async getAllProducts() {
    const products = await this.productsService.getProducts();
    return products;
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productsService.getSingleProduct(id);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') id: string | undefined,
    @Body('title') title: string | undefined,
    @Body('description') desc: string | undefined,
    @Body('price') price: number | undefined,
  ) {
    await this.productsService.updateProduct(id, title, desc, price);
    return null;
  }

  @Delete(':id')
  async removeProduct(@Param('id') id: string) {
    await this.productsService.removeProduct(id);
    return null;
  }
}
