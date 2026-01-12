import { DomainEvent } from '@shared/domain/base-classes/domain-event.base';
import { UserCreatedEventPayload } from '@modules/user/domain/events/payloads/user-created.event.payload';

export class UserCreatedEvent extends DomainEvent<UserCreatedEventPayload> {
  constructor(props: { userId: string; email: string }) {
    super({
      aggregateId: props.userId,
      props: {
        email: props.email,
      },
    });
  }
}
