import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, SearchProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    async createProduct(@Body() createProductDto: CreateProductDto) {
        const { sku, translations } = createProductDto;
        return this.productService.createProduct(sku, translations);
    }

    @Get('search')
    async searchProducts(@Query() searchProductDto: SearchProductDto) {
        const { name, language_code, page, limit } = searchProductDto;
        return this.productService.searchProducts(name, language_code, page, limit);
    }
}
