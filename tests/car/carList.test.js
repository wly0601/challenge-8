const request = require('supertest');
const app = require('../../app');
const { Car } = require('../../app/models')

describe('GET Cars', () => {
  it('Should success to get car list', async () => {
    const carCount = await Car.count();

    // Get random page and pageSize
    // Max pageSize in this test is 10
    const pageSize = Math.floor(Math.random()*10) + 1;
    const pageCount = Math.ceil(carCount / pageSize)
    const page = Math.floor(Math.random()*pageCount) + 1;

    return request(app)
      .get(`/v1/cars?page=${page}&pageSize=${pageSize}`)
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            cars: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                price: expect.any(Number),
                size: expect.any(String),
                image: expect.any(String),
                isCurrentlyRented: expect.any(Boolean),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              }),
            ]),
          }),
        );
      });
  });

  it('Get car list, but query is size and availableAt', async () => {
    const sizes = ["SMALL", "MEDIUM", "LARGE"];
    const size = sizes[Math.floor(Math.random()*sizes.length)];

    return request(app)
      .get(`/v1/cars?size=${size}&availableAt=2022-06-11T16:06:28.559Z`)
      .then((res) => {
        expect(res.statusCode).toBe(200);
      })
  });
});