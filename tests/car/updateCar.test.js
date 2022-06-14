const request = require('supertest');
const app = require('../../app');
const { Car } = require('../../app/models');

let pickCar;
let accessToken;
let carCount;

describe('UPDATE Cars', () => {
  beforeAll(async () => {
    const loginAsAdmin = await request(app)
      .post('/v1/auth/login')
      .send({
        email: 'admin@binar.co.id',
        password: 'iloveyou',
      });
      accessToken = loginAsAdmin.body.accessToken;
    
    //Let say we update car by Id randomly.
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

  it('Update car by Id', () => {
    return request(app)
      .put(`/v1/cars/${pickCar.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'BMW Jumbo M369',
        price: 3000000,
        image: 'https://source.unsplash.com/500x500',
        size: 'LARGE',
      })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            message: 'succesfully updated!',
            data: {
              ...res.body.data,
            }
          })
      });
  });

  it('Update car with wrong input id', () => {
    //Choose Id that not contain in car database
    return request(app)
      .put(`/v1/cars/${carCount + 10}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Lamborgini after update',
        price: 3000000,
        image: 'https://source.unsplash.com/500x500',
        size: 'LARGE',
      })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({
          ...res.body
        });
      });
  });
});