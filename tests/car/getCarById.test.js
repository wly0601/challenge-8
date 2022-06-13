const request = require('supertest');
const app = require('../../app');
const { Car } = require('../../app/models');

let pickCar;
describe('GET Car By specific Id', () => {
  beforeAll(async () => {

    //Let say we get car by Id randomly.
    const carCount = await Car.count();
    const randomId = Math.floor(Math.random()*carCount) + 1;
    pickCar = await Car.findOne({
      where : {
        id: randomId,
      }
    })

    //If database car is empty, then we must create first
    if(!pickCar){
      pickCar = await Car.create({
        name: 'BMW M3 GTR',
        price: 2000000,
        size: 'SMALL',
        image: 'https://source.unsplash.com/500x500',
        isCurrentlyRented: false,
      });
    }
  });

  afterAll(async () => {
    Car.destroy({
      where: {
        name: 'BMW M3 GTR'
      }
    })
  })

  it('Should get spesific car, status code 200', () => {
    return request(app)
      .get(`/v1/cars/${pickCar.id}`)
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.statusCode).toBe(200);
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
});