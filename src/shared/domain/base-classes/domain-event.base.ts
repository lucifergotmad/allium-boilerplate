import { UUID } from '@shared/core/utils/uuid.util';

export abstract class DomainEvent<T = any> {
  public readonly id: string;
  public readonly aggregateId: string;
  public readonly dateOccurred: Date;
  public readonly props: T; // <-- Tempat menyimpan data spesifik event (email, dll)
  public readonly metadata?: unknown;

  constructor(params: { aggregateId: string; props: T; metadata?: unknown }) {
    this.id = UUID.generate();
    this.aggregateId = params.aggregateId;
    this.dateOccurred = new Date();
    this.props = params.props;
    this.metadata = params.metadata;
  }
}
