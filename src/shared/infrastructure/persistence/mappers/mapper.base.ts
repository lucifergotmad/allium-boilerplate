import { Mapper } from '@shared/application/mappers/mapper.interface';

export abstract class BaseMapper<DomainEntity, DbRecord> implements Mapper<DomainEntity, DbRecord> {
  abstract toPersistence(entity: DomainEntity): DbRecord;
  abstract toDomain(record: DbRecord): DomainEntity;

  toPersistenceList(entities: DomainEntity[]): DbRecord[] {
    return entities.map((entity) => this.toPersistence(entity));
  }

  toDomainList(records: DbRecord[]): DomainEntity[] {
    return records.map((record) => this.toDomain(record));
  }
}
