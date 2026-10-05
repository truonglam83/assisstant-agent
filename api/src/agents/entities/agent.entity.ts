import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AgentRule } from './agent-rule.entity';

export interface AgentCapabilities {
  can: string[];
  cannot: string[];
}

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', default: '' })
  description!: string;

  @Column({ type: 'text', default: '' })
  instructions!: string;

  @Column({ type: 'jsonb', default: { can: [], cannot: [] } })
  capabilities!: AgentCapabilities;

  @Column({ type: 'jsonb', default: [] })
  tools!: string[];

  @Column({ type: 'jsonb', default: [] })
  skills!: string[];

  @Column({ default: 'claude-3-5-sonnet-latest' })
  model!: string;

  @Column({ name: 'is_default', default: false })
  isDefault!: boolean;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ default: true })
  enabled!: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => AgentRule, (rule) => rule.agent, { cascade: true })
  rules!: AgentRule[];
}
