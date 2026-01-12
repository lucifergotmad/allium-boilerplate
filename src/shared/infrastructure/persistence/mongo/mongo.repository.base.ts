import { AggregateRoot } from '@shared/domain/base-classes/aggregate-root.base';
import { Mapper } from '@shared/application/mappers/mapper.interface';
import { Model, Document, ClientSession, AnyObject } from 'mongoose';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import {
  Paginated,
  PaginatedQueryParams,
  RepositoryPort,
} from '@shared/domain/ports/repository.port';

export abstract class MongoRepositoryBase<
  TEntity extends AggregateRoot<unknown>,
  TDocument extends Document<unknown>,
  TPersistence extends AnyObject,
> implements RepositoryPort<TEntity> {
  constructor(
    private readonly model: Model<TDocument>,
    private readonly mapper: Mapper<TEntity, TPersistence>,
    private readonly eventEmitter?: EventEmitter
  ) {}

  async save(entity: TEntity, session?: ClientSession): Promise<void> {
    const persistenceModel = this.mapper.toPersistence(entity);

    await this.model.updateOne(
      { _id: entity.id },
      { $set: persistenceModel },
      { upsert: true, updatePipeline: true, session }
    );

    if (this.eventEmitter) {
      await this.dispatchEvents(entity);
    }
  }

  async insert(entity: TEntity | TEntity[], session?: ClientSession): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity];
    const records = entities.map((e) => this.mapper.toPersistence(e));

    await this.model.insertMany(records, { session: session });

    if (this.eventEmitter) {
      await Promise.all(entities.map((e) => this.dispatchEvents(e)));
    }
  }

  async deleteById(id: string, session?: ClientSession): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id }, { session });
    return !!result.deletedCount;
  }

  async findOneById(id: string, session?: ClientSession): Promise<TEntity | null> {
    const found = await this.model.findById(id).session(session ?? null);

    if (!found) return null;
    return this.mapper.toDomain(found as unknown as TPersistence);
  }

  async findAll(session?: ClientSession): Promise<TEntity[]> {
    const docs = await this.model.find().session(session ?? null);

    return docs.map((doc) => this.mapper.toDomain(doc as unknown as TPersistence));
  }

  async findAllPaginated(
    params: PaginatedQueryParams,
    session?: ClientSession
  ): Promise<Paginated<TEntity>> {
    const count = await this.model.countDocuments().session(session ?? null);
    const docs = await this.model
      .find()
      .session(session ?? null)
      .skip(params.offset)
      .limit(params.limit)
      .sort({ [params.orderBy.field as string]: params.orderBy.param === 'asc' ? 1 : -1 });

    return new Paginated({
      data: docs.map((doc) => this.mapper.toDomain(doc as unknown as TPersistence)),
      count,
      limit: params.limit,
      page: params.page,
    });
  }

  async transaction<T>(handler: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = await this.model.db.startSession();
    session.startTransaction();
    try {
      const result = await handler(session);
      await session.commitTransaction();
      return result;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Helper private untuk dispatch event dengan aman
   */
  private async dispatchEvents(entity: TEntity): Promise<void> {
    if (!this.eventEmitter) return;

    const events = entity.domainEvents;

    const promises = events.map((event) => {
      return this.eventEmitter!.emitAsync(event.constructor.name, event);
    });

    await Promise.all(promises);
    entity.clearEvents();
  }
}
