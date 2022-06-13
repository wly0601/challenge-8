const request = require('supertest');
const app = require('../../app');
const { Car } = require('../../app/models');
const { User } = require('../../app/models');
const bcrypt = require("bcryptjs");


let accessToken;
let customerToken;

describe('CREATE car', () => {
  beforeAll(async () => {
    const password = "orangkayanihbos";
    await User.create({
      name: "Anya Forger",
      email: "anya@binar.co.id",
      encryptedPassword: bcrypt.hashSync(password, 10),
      roleId: 1,
    })

    const response = await request(app)
      .post('/v1/auth/login')
      .send({
        email: 'admin@binar.co.id',
        password: 'iloveyou',
      });
    accessToken = response.body.accessToken;

    await request(app)
      .post('/v1/auth/login')
      .send({
        email: "anya@binar.co.id",
        password,
      })
      .then((res) => {
        customerToken = res.body.accessToken;
      })
  });

  afterAll(async () => {
    await Car.destroy({
      where: {
        name: 'Tesla Model Y',
      },
    });

    await User.destroy({
      where: {
        email: "anya@binar.co.id",
      }
    })
  });

  it('Create car, should response 201 as status code', () => {
    return request(app)
      .post('/v1/cars')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Tesla Model Y',
        price: 10000000,
        image: 'https://source.unsplash.com/531x531',
        size: 'SMALL',
      })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(Number),
          size: expect.any(String),
          image: expect.any(String),
          isCurrentlyRented: expect.any(Boolean),
          updatedAt: expect.any(String),
          createdAt: expect.any(String),
        });
      });
  });

  it("Create car, but not an Admin, response should be 401", async () => {
    return request(app)
      .post('/v1/cars')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'Tesla Model Y',
        price: 10000000,
        image: 'https://source.unsplash.com/531x531',
        size: 'SMALL',
      })
      .then((res) => {
        expect(res.statusCode).toBe(401);
      });
  })

  it('Create car, but format input is incorrect', async () => {
    return request(app)
      .post('/v1/cars')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Tesla Model Y',
        price: '10 grand',
        image: 'https://source.unsplash.com/531x531',
        size: 'SMALL',
      })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({
          error: {
            name: expect.any(String),
            message: expect.any(String),
          },
        });
      });
  });
});