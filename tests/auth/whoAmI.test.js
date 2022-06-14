const request = require('supertest');
const app = require('../../app');
const { User } = require('../../app/models');
const bcrypt = require("bcryptjs");

let accessTokenAdmin;
let accessTokenCustomer;

describe('Who Am I', () => {
  beforeEach(async () => {
    const password = "gaktausayang";
    await User.create({
      name: "Hu Tao",
      email: "hutaocantik@binar.co.id",
      encryptedPassword: bcrypt.hashSync(password, 10),
      roleId: 1,
    })

    const responseLoginAdmin = await request(app)
      .post('/v1/auth/login')
      .set('Accept', 'application/json')
      .send({
        email: 'admin@binar.co.id',
        password: 'iloveyou',
      });

    accessTokenAdmin = responseLoginAdmin.body.accessToken;

    await request(app)
      .post('/v1/auth/login')
      .set('Accept', 'application/json')
      .send({
        email: "hutaocantik@binar.co.id",
        password,
      })
      .then((res) => {
        accessTokenCustomer = res.body.accessToken;
      });
  });

  it('Should login as customer, status code 200', () => {
    return request(app)
      .get('/v1/auth/whoami')
      .set(
        'Authorization',
        `Bearer ${accessTokenCustomer}`,
      )
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );   
      });
  });

  it('Should login as admin, status code 401', () => {
    return request(app)
      .get('/v1/auth/whoami')
      .set(
        'Authorization',
        `Bearer ${accessTokenAdmin}`,
      )
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );   
      });
  });

  describe("Who am I, but (the I) is deleted", () => {
    beforeEach(async () => {
      await User.destroy({
        where: {
          email: 'hutaocantik@binar.co.id',
        },
      });
    });

    it('Should response 404 as status code', async () => {
      return request(app)
        .get('/v1/auth/whoami')
        .set('Accept', 'application/json')
        .set(
          'Authorization',
          `Bearer ${accessTokenCustomer}`,
        )
        .then((res) => {
          expect(res.statusCode).toBe(404);
          expect(res.body).toEqual(
            expect.objectContaining({
              ...res.body,
            })
          );   
        });
    });
  });
});