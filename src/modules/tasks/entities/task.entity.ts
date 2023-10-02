import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  completed: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  constructor(task: Partial<Task>) {
    this.id = task?.id;
    this.createdAt = task?.createdAt;
    this.title = task?.title;
    this.description = task?.description;
    this.completed = task?.completed;
    this.user = task?.user;
  }
}
