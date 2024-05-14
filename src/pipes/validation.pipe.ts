import Joi from "joi";
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Joi.Schema) {}

  transform(value: any, _: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException(error.message);
    }
    return value;
  }
}
