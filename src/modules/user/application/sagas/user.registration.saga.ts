import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { UserCreatedEvent } from '../../domain/events/user-created.event';

@Injectable()
export class UserRegistrationSagas {
  @Saga()
  userCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(ofType(UserCreatedEvent));
  };
}
