import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'posts' })
@Index(['publishedAt', 'createdAt']) // Composite index for common query pattern
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index() // Index for slug lookups
  @Column({ unique: true })
  slug!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text', nullable: true })
  summary!: string | null;

  @Index() // Index for filtering published posts
  @Column({ type: 'datetime', nullable: true })
  publishedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}


