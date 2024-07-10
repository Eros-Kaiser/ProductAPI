import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductTranslation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    language_code: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => Product, product => product.translations)
    product: Product;
}
