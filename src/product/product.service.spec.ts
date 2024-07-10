import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductTranslation } from './entities/product-translation.entity';

describe('ProductService', () => {
  let service: ProductService;
  let productRepo: Repository<Product>;
  let translationRepo: Repository<ProductTranslation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getRepositoryToken(Product), useClass: Repository },
        { provide: getRepositoryToken(ProductTranslation), useClass: Repository },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepo = module.get<Repository<Product>>(getRepositoryToken(Product));
    translationRepo = module.get<Repository<ProductTranslation>>(getRepositoryToken(ProductTranslation));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product with translations', async () => {
      const sku = 'TESTSKU123';
      const translations = [
        { language_code: 'en', name: 'Test Product', description: 'A product for testing' },
        { language_code: 'fr', name: 'Produit de Test', description: 'Un produit pour les tests' },
      ];

      const savedProduct = { id: 1, sku, translations: [] } as Product;
      jest.spyOn(productRepo, 'create').mockReturnValue(savedProduct);
      jest.spyOn(productRepo, 'save').mockResolvedValue(savedProduct);

      jest.spyOn(translationRepo, 'create').mockImplementation((translation) => ({
        ...translation,
        id: Math.random(),
        product: savedProduct,
      } as ProductTranslation));
      jest.spyOn(translationRepo, 'save').mockImplementation(async (translation) => translation as ProductTranslation);

      const result = await service.createProduct(sku, translations);

      expect(productRepo.create).toHaveBeenCalledWith({ sku, translations: [] });
      expect(productRepo.save).toHaveBeenCalledWith(savedProduct);
      expect(translationRepo.create).toHaveBeenCalledTimes(translations.length);
      expect(translationRepo.save).toHaveBeenCalledTimes(translations.length);
      expect(result).toEqual(savedProduct);
    });
  });

  describe('searchProducts', () => {
    it('should return paginated products matching the search criteria', async () => {
      const name = 'Test';
      const language_code = 'en';
      const page = 1;
      const limit = 10;

      const product = { id: 1, sku: 'TESTSKU123', translations: [] } as Product;
      const translation = {
        id: 1,
        language_code,
        name: 'Test Product',
        description: 'A product for testing',
        product,
      } as ProductTranslation;

      const paginatedResult = [translation];
      const totalCount = 1;

      jest.spyOn(translationRepo, 'findAndCount').mockResolvedValue([paginatedResult, totalCount]);

      const result = await service.searchProducts(name, language_code, page, limit);

      expect(translationRepo.findAndCount).toHaveBeenCalledWith({
        where: { name: ILike(`%${name}%`), language_code },
        relations: ['product'],
        take: limit,
        skip: (page - 1) * limit,
      });

      expect(result).toEqual({
        products: paginatedResult,
        count: totalCount,
      });
    });
  });
});
