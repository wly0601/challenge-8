const request = require('supertest');
const app = require('../../app');
const { Car } = require('../../app/models');

let accessToken;
let pickCar;

describe('CREATE car', () => {
  beforeAll(async () => {
    const response = await request(app)
      .post('/v1/auth/login')
      .send({
        email: 'admin@binar.co.id',
        password: 'iloveyou',
      });
    accessToken = response.body.accessToken;

    //Let say we delete car by Id randomly.
    carCount = await Car.count();
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
    await Car.destroy({
      where: {
        name: 'BMW M3 GTR',
      },
    });
  });

  it('Delete User, Should response with 204 as status code', async () => {
    return request(app)
      .delete(`/v1/cars/${pickCar.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .then((res) => {
        expect(res.statusCode).toBe(204);
      });
  });
});