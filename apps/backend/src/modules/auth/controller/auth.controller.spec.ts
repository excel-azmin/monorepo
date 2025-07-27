import { CommandBus } from '@nestjs/cqrs/dist/command-bus';
import { QueryBus } from '@nestjs/cqrs/dist/query-bus';
import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationAuthDto } from '../dto/registration-auth.dto';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call commandBus.execute with RegistrationCommand', async () => {
      const registrationDto = new RegistrationAuthDto();
      registrationDto.firstName = 'John';
      registrationDto.lastName = 'Doe';
      registrationDto.email = 'test@example.com';
      registrationDto.password = 'password';

      await controller.register(registrationDto);
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registrationDto.email,
          password: registrationDto.password,
        }),
      );
    });
  });
});
