import {
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User.entity";
@Entity("user_role")
export class RoleUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_role_name: string;
  @ManyToOne(() => User, (user) => user.role)
  user: User;
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
