import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Agent } from './agent.entity';
import { AgentRuleVersion } from './agent-rule-version.entity';

@Entity('agent_rules')
export class AgentRule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'agent_id' })
  agentId!: string;

  @Column({ default: 'all' })
  scope!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ default: true })
  enabled!: boolean;

  @Column({ default: 1 })
  version!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Agent, (agent) => agent.rules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agent_id' })
  agent!: Agent;

  @OneToMany(() => AgentRuleVersion, (ver) => ver.rule, { cascade: true })
  versions!: AgentRuleVersion[];
}
