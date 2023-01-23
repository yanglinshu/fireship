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
  addProduct(
    @Body('title') title: string,
    @Body('description') desc: string,
    @Body('price') price: number,
  ) {
    const newID = this.productsService.insertProduct(title, desc, price);
    return {
      id: newID,
    };
  }

  @Get()
  getAllProducts() {
    const products = this.productsService.getProducts();
    return products;
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productsService.getSingleProduct(id);
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: string | undefined,
    @Body('title') title: string | undefined,
    @Body('description') desc: string | undefined,
    @Body('price') price: number | undefined,
  ) {
    this.productsService.updateProduct(id, title, desc, price);
    return null;
  }

  @Delete(':id')
  removeProduct(@Param('id') id: string) {
    this.productsService.removeProduct(id);
    return null;
  }
}
