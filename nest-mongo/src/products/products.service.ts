import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './products.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  private products: Product[] = [];

  async insertProduct(title: string, desc: string, price: number) {
    const newProduct = new this.productModel({
      title,
      description: desc,
      price,
    });
    const newID = await newProduct.save();
    return newID.id as string;
  }

  async getProducts() {
    const products = await this.productModel.find();
    return products.map((prod) => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    }));
  }

  async getSingleProduct(id: string) {
    const product = await this.findProduct(id);
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    };
  }

  async updateProduct(
    id: string | undefined,
    title: string | undefined,
    desc: string | undefined,
    price: number | undefined,
  ) {
    const product = await this.findProduct(id);
    if (title) {
      product.title = title;
    }
    if (desc) {
      product.description = desc;
    }
    if (price) {
      product.price = price;
    }

    product.save();
  }

  async removeProduct(id: string) {
    const result = await this.productModel
      .deleteOne({
        _id: id,
      })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException("Couldn't find product.");
    }
  }

  private async findProduct(id: string) {
    let product: Product;
    try {
      product = await this.productModel.findById(id);
    } catch (error) {
      throw new NotFoundException("Couldn't find product.");
    }

    if (!product) {
      throw new NotFoundException("Couldn't find product.");
    }
    return product;
  }
}
