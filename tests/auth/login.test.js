const request = require('supertest');
const app = require('../../app');
const { User } = require("../../app/models");
const bcrypt = require("bcryptjs");

describe('Login User', () => {
  const password = "gaktausayang"
  const createUser = {
    name: "Hu Tao",
    email: "hutaocantik@binar.co.id",
    encryptedPassword: bcrypt.hashSync(password, 10),
    roleId: 1,
  };

  beforeAll(async () => {
    await User.create(createUser)
  });

  it('Not have any problem, response should be 201 with the accessToken', async () => {
		return request(app)
      .post('/v1/auth/login')
      .set('Accept', 'application/json')
      .send({
        email: createUser.email,
        password,
      })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
          expect.objectContaining({
            accessToken: expect.any(String),
          }),
        );
      });
  });

  it("Login new user, but email is empty", async () => {    
    return request(app)
      .post("/v1/auth/login")
      .set("Content-Type", "application/json")
      .send({ 
        email: "", 
        password 
      })
      .then((res) => {
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      });
  });

  it('Email is not registered, response should be 404', async () => {
    // Testing the email is not registered, 
    // Choose (for example) "typo version of createUser.email"
    const emailPick = createUser.email.split("@")[0];
    const notRegisteredEmail = emailPick.substring(0, emailPick.length - 2) + "@binar.co.id";

    return request(app)
      .post('/v1/auth/login')
      .set('Accept', 'application/json')
      .send({
        email: notRegisteredEmail,
        password,
      })
      .then((res) => {
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
          error: {
            name: expect.any(String),
            message: expect.any(String),
            details: {
              email: expect.any(String),
            },
          },
        });
      });
  });

  it('Email is fine, but the password is incorrect, response should be 401', async () => {
    // Testing the password is incorrect, 
    // Choose (for example) "typo version of password"
    const wrongPassword = password.substring(0, password.length - 2);

    return request(app)
      .post('/v1/auth/login')
      .set('Accept', 'application/json')
      .send({
        email: createUser.email,
        password: wrongPassword
      })
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect.objectContaining({
          error: {
            name: expect.any(String),
            message: expect.any(String),
            details: null,
          },
        });
      });
  });
});