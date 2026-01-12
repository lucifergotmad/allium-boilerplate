export class Paginated<T> {
  readonly count: number;
  readonly limit: number;
  readonly page: number;
  readonly data: readonly T[];

  constructor(props: Paginated<T>) {
    this.count = props.count;
    this.limit = props.limit;
    this.page = props.page;
    this.data = props.data;
  }
}

export type OrderBy = { field: string | true; param: 'asc' | 'desc' };

export type PaginatedQueryParams = {
  limit: number;
  page: number;
  offset: number;
  orderBy: OrderBy;
};

export abstract class RepositoryPort<Entity, TransactionSession = unknown> {
  abstract save(entity: Entity, session?: TransactionSession): Promise<void>;
  abstract insert(entity: Entity | Entity[], session?: TransactionSession): Promise<void>;
  abstract deleteById(id: string, session?: TransactionSession): Promise<boolean>;
  abstract findOneById(id: string, session?: TransactionSession): Promise<Entity | null>;
  abstract findAll(session?: TransactionSession): Promise<Entity[]>;
  abstract findAllPaginated(
    params: PaginatedQueryParams,
    session?: TransactionSession
  ): Promise<Paginated<Entity>>;
  abstract transaction<T>(handler: (session: TransactionSession) => Promise<T>): Promise<T>;
}
