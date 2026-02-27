import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
  @InjectRepository(User)
  private readonly userRepo: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {
  const { fullname, email, password } = createUserDto;

  const normalizedEmail = email.toLowerCase();

  const existingEmail = await this.userRepo.findOne({
    where: { email: normalizedEmail },
  });

  if (existingEmail) {
    throw new BadRequestException('Email already taken');
  }

  // const existingName = await this.userRepo.findOne({
  //   where: { fullname },
  // });

  // if (existingName) {
  //   throw new BadRequestException('Name already taken');
  // }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = this.userRepo.create({
    ...createUserDto,
    email: normalizedEmail,
    password: hashedPassword,
  });

  const savedUser = await this.userRepo.save(user);

  const { password: _pwd, ...userWithoutPassword } = savedUser;
  return userWithoutPassword as Omit<User, 'password'>;
}


  async findAll(){
    return this.userRepo.find();
  }

  async findRawById(id: number) {
  return this.userRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    const normalized = email.toLowerCase();
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: normalized })
      .getOne();
  }

  async findOne(id: number){
  const user = await this.userRepo.findOne({ where: { id } });

  if (!user) throw new NotFoundException('User not found');

  return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto){
   const user = await this.userRepo.findOne({ where: { id } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (updateUserDto.password) {
    user.password = await bcrypt.hash(updateUserDto.password, 10);
  }

  Object.assign(user, updateUserDto);

  const updated = await this.userRepo.save(user)

  const {password:_pwd, ...userWithoutPassword} = updated
  return userWithoutPassword as Omit<User, 'password'>;
  }

  async remove(id:number){
  const user = await this.findOne(id);

  await this.userRepo.remove(user);

  return { message: 'User deleted successfully' };
  }
}
