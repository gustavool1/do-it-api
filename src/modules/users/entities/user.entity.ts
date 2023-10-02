import { Task } from 'src/modules/tasks/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
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

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  constructor(user: Partial<User>) {
    this.id = user?.id;
    this.createdAt = user?.createdAt;
    this.name = user?.name;
    this.email = user?.email;
    this.passwordHash = user?.passwordHash;
  }
}
