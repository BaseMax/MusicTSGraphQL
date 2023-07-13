import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';
import { Role } from 'src/modules/users/user.model';

const gql = '/graphql';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let users: User[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService);

    await app.init();
  });
  beforeEach(async () => {
    await prisma.user.deleteMany({});
    // create test users
    await prisma.user.createMany({
      data: [
        {
          name: 'John',
          email: 'johndoe@example.com',
          password: await hash('Password123!'),
          role: Role.admin
        },
        {
          name: 'Jane',
          email: 'janedoe@example.com',
          password: await hash('Password123!'),
          role: Role.user
        },
      ],
    });

    users = await prisma.user.findMany();
    // create test short urls
  });
  describe('login mutation', () => {
    it('should successfully login with valid credentials', async () => {
      // Arrange
      const email = users[0].email;
      const password = 'Password123!';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            login(input: { email: "${email}", password: "${password}" }) {
              token
              user {
                id
                name
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).not.toBeNull();
      expect(response.body.data.login.token).toBeDefined();
      expect(response.body.data.login.user.id).toBe(users[0].id);
      expect(response.body.data.login.user.name).toBe(users[0].name);
    });

    it('should not login with invalid email address', async () => {
      // Arrange
      const email = 'invalidemail@example.com';
      const password = 'Password123!';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            login(input: { email: "${email}", password: "${password}" }) {
              token
              user {
                id
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('should not login with invalid password', async () => {
      // Arrange
      const email = users[0].email;
      const password = 'invalidpassword';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            login(input: { email: "${email}", password: "${password}" }) {
              token
              user {
                id
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });
  });
  describe('register mutation', () => {
    it('should successfully register a new user', async () => {
      // Arrange
      const name = 'Smith';
      const email = 'alicesmith@example.com';
      const password = 'Password123!';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            register(input: {  name: "${name}", email: "${email}", password: "${password}" }) {
              token
              user {
                id
                name
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).not.toBeNull();
      expect(response.body.data.register.token).toBeDefined();
      expect(response.body.data.register.user.name).toBe(name);
    });

    it('should not register a user with an existing email address', async () => {
      // Arrange
      const name = 'Doe';
      const email = users[0].email;
      const password = 'password123!';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            register(input: {  name: "${name}", email: "${email}", password: "${password}" }) {
              token
              user {
                id
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('should not register a user with an invalid email address', async () => {
      // Arrange
      const name = 'Smith';
      const email = 'invalidemail';
      const password = 'password123!';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            register(input: {  name: "${name}", email: "${email}", password: "${password}" }) {
              token
              user {
                id
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('should not register a user with an invalid password', async () => {
      // Arrange
      const name = 'Smith';
      const email = 'charliesmith@example.com';
      const password = 'invalidpassword';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            register(input: {  name: "${name}", email: "${email}", password: "${password}" }) {
              token
              user {
                id
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('should not register a user with a password that is too short', async () => {
      // Arrange
      const name = 'Smith';
      const email = 'davidsmith@example.com';
      const password = 'pass123!';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            register(input: {  name: "${name}", email: "${email}", password: "${password}" }) {
              token
              user {
                id
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('should not register a user with a password that does not meet complexity requirements', async () => {
      // Arrange
      const name = 'Smith';
      const email = 'evesmith@example.com';
      const password = '1234';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            register(input: {  name: "${name}", email: "${email}", password: "${password}" }) {
              token
              user {
                id
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });
  });
  describe('authentication', () => {
    let user: User;
    let authToken: string;

    it('should register a new user and allow them to log in', async () => {
      // Register a new user
      const name = 'Smith';
      const email = 'alicesmith@example.com';
      const password = 'Password1!';

      const registerResponse = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            register(input: {  name: "${name}", email: "${email}", password: "${password}" }) {
              token
              user {
                id
                name
              }
            }
          }
        `,
        });

      console.log(registerResponse);
      // Assert
      expect(registerResponse.status).toBe(200);
      expect(registerResponse.body.data).not.toBeNull();
      expect(registerResponse.body.data.register.token).toBeDefined();
      expect(registerResponse.body.data.register.user.name).toBe(name);

      user = registerResponse.body.data.register.user;
      authToken = registerResponse.body.data.register.token;

      // Log in with the same credentials used during registration
      const loginResponse = await request(app.getHttpServer())
        .post(gql)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
          mutation {
            login(input: { email: "${email}", password: "${password}" }) {
              token
              user {
                id
                name
              }
            }
          }
        `,
        });

      // Assert
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.data).not.toBeNull();
      expect(loginResponse.body.data.login.token).toBeDefined();
      expect(loginResponse.body.data.login.user.name).toBe(name);
    });
  });
  ;
  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });
});
