export interface Mapper<DomainEntity, DbRecord> {
  toPersistence(entity: DomainEntity): DbRecord;
  toDomain(record: DbRecord): DomainEntity;
}
