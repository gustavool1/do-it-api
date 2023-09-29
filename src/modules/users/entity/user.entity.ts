import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  constructor(user: Partial<User>) {
    this.id = user?.id;
    this.createdAt = user?.createdAt;
    this.name = user?.name;
    this.email = user?.email;
    this.passwordHash = user?.passwordHash;
  }
}
