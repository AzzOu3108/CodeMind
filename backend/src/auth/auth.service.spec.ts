import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/module/user/user.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const mockUserService = { findRawById: jest.fn(), findByEmail: jest.fn() };
    const mockJwtService = { sign: jest.fn().mockReturnValue('token') };
    const mockRefreshRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: mockRefreshRepo,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
