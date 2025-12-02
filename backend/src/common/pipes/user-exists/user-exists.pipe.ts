import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UserService } from 'src/module/user/user.service';

@Injectable()
export class UserExistsPipe implements PipeTransform {
  constructor(private readonly userService: UserService){}

  async transform(value: number) {
    const user = await this.userService.findRawById(value)
    if (!user) {
      throw new NotFoundException(`User with ID ${value} not found`);
    }
    return value;
  }
}
