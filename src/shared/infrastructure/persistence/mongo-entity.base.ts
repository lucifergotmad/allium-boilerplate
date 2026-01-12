import { Prop } from '@nestjs/mongoose';

export abstract class BaseMongoEntity<MongoModel> {
  @Prop({ required: true, type: String })
  _id: string;

  @Prop()
  created_by?: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_by?: string;

  @Prop()
  updated_at: Date;

  constructor(props?: Partial<MongoModel>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
