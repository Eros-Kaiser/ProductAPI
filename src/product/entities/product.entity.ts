import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductTranslation } from './product-translation.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    sku: string;

    @OneToMany(() => ProductTranslation, translation => translation.product)
    translations: ProductTranslation[];
}
