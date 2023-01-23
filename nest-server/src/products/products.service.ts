import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './products.model';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  insertProduct(title: string, desc: string, price: number) {
    const newID = Math.random().toString();
    const newProduct = new Product(newID, title, desc, price);
    this.products.push(newProduct);
    return newID;
  }

  getProducts() {
    return [...this.products];
  }

  getSingleProduct(id: string) {
    const product = this.findProduct(id)[0];
    return { ...product };
  }

  updateProduct(
    id: string | undefined,
    title: string | undefined,
    desc: string | undefined,
    price: number | undefined,
  ) {
    const [product, index] = this.findProduct(id);
    const updatedProduct = { ...product };
    if (title) {
      updatedProduct.title = title;
    }
    if (desc) {
      updatedProduct.description = desc;
    }
    if (price) {
      updatedProduct.price = price;
    }
    this.products[index] = updatedProduct;
  }

  removeProduct(id: string) {
    const index = this.findProduct(id)[1];
    this.products.splice(index, 1);
  }

  private findProduct(id: string): [Product, number] {
    const productIndex = this.products.findIndex((prod) => prod.id === id);
    const product = this.products[productIndex];
    if (!product) {
      // NestJS will automatically throw a 404 error
      throw new NotFoundException('Could not find product.');
    }
    return [product, productIndex];
  }
}
