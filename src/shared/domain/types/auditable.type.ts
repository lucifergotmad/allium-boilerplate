import { DateVO } from '@shared/domain/value-objects/date.value-object';

export interface AuditableProps {
  createdBy?: string;
  createdAt?: DateVO;
  updatedBy?: string;
  updatedAt?: DateVO;
  deletedBy?: string;
  deletedAt?: DateVO;
}
