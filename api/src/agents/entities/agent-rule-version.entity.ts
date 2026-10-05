import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { AgentRule } from './agent-rule.entity';

@Entity('agent_rule_versions')
export class AgentRuleVersion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'rule_id' })
  ruleId!: string;

  @Column()
  version!: number;

  @Column({ type: 'text' })
  content!: string;

  @Column({ name: 'change_reason', nullable: true })
  changeReason?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => AgentRule, (rule) => rule.versions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rule_id' })
  rule!: AgentRule;
}
