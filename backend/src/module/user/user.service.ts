import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Course } from '../course/entities/course.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { fullname, email, password } = createUserDto;

    const normalizedEmail = email.toLowerCase();

    const existingEmail = await this.userRepo.findOne({
      where: { email: normalizedEmail },
    });

    if (existingEmail) {
      throw new BadRequestException('Email already taken');
    }

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

  async findAll() {
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

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, confirmPassword, email, ...rest } = updateUserDto;

    if (email) {
      const normalizedEmail = email.toLowerCase();

      const existingUser = await this.userRepo.findOne({
        where: { email: normalizedEmail },
      });

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email already taken');
      }

      user.email = normalizedEmail;
    }

    if (password || confirmPassword) {
      if (!password || !confirmPassword) {
        throw new BadRequestException('Both password fields are required');
      }
      if (password !== confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
      user.password = await bcrypt.hash(password, 10);
    }

    Object.assign(user, rest);

    const updated = await this.userRepo.save(user);

    const { password: _pwd, ...userWithoutPassword } = updated;
    return userWithoutPassword as Omit<User, 'password'>;
  }

  async remove(id: number) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.courseRepo.delete({ user: { id } });
    await this.userRepo.remove(user);

    return { message: 'User deleted successfully' };
  }
}
