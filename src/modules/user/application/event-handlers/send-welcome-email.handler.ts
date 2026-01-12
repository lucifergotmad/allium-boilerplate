import { UserCreatedEvent } from '@modules/user/domain/events/user-created.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(UserCreatedEvent)
export class SendWelcomeEmailHandler implements IEventHandler<UserCreatedEvent> {
  handle(event: UserCreatedEvent) {
    console.log(`[Email Service] Sending welcome email to ${event.props.email}...`);
  }
}
