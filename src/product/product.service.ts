import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductTranslation } from './entities/product-translation.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private productRepo: Repository<Product>,
        @InjectRepository(ProductTranslation) private translationRepo: Repository<ProductTranslation>
    ) { }

    async createProduct(sku: string, translations: { language_code: string; name: string; description?: string; }[]) {
        const product = this.productRepo.create({ sku, translations: [] });
        await this.productRepo.save(product);

        for (const translation of translations) {
            const newTranslation = this.translationRepo.create({
                ...translation,
                product
            });
            await this.translationRepo.save(newTranslation);
        }

        return product;
    }

    async searchProducts(name: string, language_code: string, page: number, limit: number) {
        const [products, count] = await this.translationRepo.findAndCount({
            where: { name: ILike(`%${name}%`), language_code },
            relations: ['product'],
            take: limit,
            skip: (page - 1) * limit
        });

        return {
            products,
            count
        };
    }
}
