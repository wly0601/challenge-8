const request = require('supertest');
const dayjs = require('dayjs');
const app = require('../../app');
const { Car } = require('../../app/models');

dayjs().format();

describe('Rent Car', () => {
  let carResponse;
  let accessAdmin;
  let accessCustomer;
  let customer;
  const rentStartedAt = dayjs().add(1, 'day');
  const rentEndedAt = dayjs(rentStartedAt).add(1, 'day');

  beforeAll(async () => {
    accessAdmin = await request(app)
      .post('/v1/auth/login').send({
        email: 'admin@binar.co.id',
        password: 'iloveyou',
      });

    accessCustomer = await request(app)
      .post('/v1/auth/login').send({
        email: 'jayabaya@binar.co.id',
        password: '123456',
      });

    carResponse = await request(app)
      .post('/v1/cars')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${accessAdmin.body.accessToken}`)
      .send({
        name: 'Pajero Sport',
        price: 1500000,
        size: 'LARGE',
        image: 'https://source.unsplash.com/500x500',
      });

    return carResponse;
  });

  // afterAll(async () => {
  //   await Car.destroy({
  //     where: { id: carResponse.body.id },
  //   });
  // });

  it('Rent, but not login', () => {
    return request(app)
      .post(`/v1/cars/${carResponse.body.id}/rent`)
      .set('Content-Type', 'application/json')
      .send({ rentStartedAt, rentEndedAt })
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(res.body);
      });
  });

  it('Rent, but wrong input', () => {
    return request(app)
      .post(`/v1/cars/${carResponse.body.id}/rent`)
      .set('Authorization', `Bearer ${accessCustomer.body.accessToken}`)
      .set('Content-Type', 'application/json')
      .send({})
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });
  it('Rent, response should be 201', () => {
    return request(app)
      .post(`/v1/cars/${carResponse.body.id}/rent`)
      .set('Authorization', `Bearer ${accessCustomer.body.accessToken}`)
      .set('Content-Type', 'application/json')
      .send({ rentStartedAt })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject({
          id: expect.any(Number),
          carId: expect.any(Number),
          userId: expect.any(Number),
          rentStartedAt: expect.any(String),
          rentEndedAt: expect.any(String),
        });
      });
  });

  it('Rent, but car is already rented', () => {
    return request(app)
      .post(`/v1/cars/${carResponse.body.id}/rent`)
      .set('Authorization', `Bearer ${accessCustomer.body.accessToken}`)
      .set('Content-Type', 'application/json')
      .send({ 
        rentStartedAt, 
        rentEndedAt 
      })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toMatchObject({
          error: {
            name: expect.any(String),
            message: expect.any(String),
            details: {
              message: expect.any(String),
            },
          },
        });
      });
  });
});