const request = require("supertest");
const app = require("../app");
const { User } = require('../app/models');
const { Op } = require("sequelize");

describe("Register", () => {
  const names = ["Elaina","Aurellia","Anya","Gabriella"];
  afterEach(async () => {
    const user = await User.destroy({
      where: {
        [Op.or]: names.map((name) => {
          return {
            name:name,
          }
        })
      },
    });
  });

  it("Register new user, not have any problem, response should be 201", async () => {
    //Generate random name from names[], then set it's email and password.
    const name = names[Math.floor(Math.random()*names.length)];
    const email = `${name}@binar.co.id`;
    const password = "password";
    
    return request(app)
      .post("/v1/auth/register")
      .set("Content-Type", "application/json")
      .send({ 
        name, 
        email, 
        password 
      })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      });
  });

  it("Register new user, but email already taken, response should be 422", async () => {
    
    //Find random data user from database, then pick the email
    const userCount = await User.count();
    const randomId = Math.floor(Math.random()*userCount) + 1;
    const pickUser = await User.findOne({
      where : {
        id: randomId,
      }
    })

    //Find random name from names[], but set the email same as pickUser.email
    const name = names[Math.floor(Math.random()*names.length)];
    const password = "password";

    return request(app)
      .post("/v1/auth/register")
      .set("Content-Type", "application/json")
      .send({ 
        name,
        email: pickUser.email,
        password,
      })
      .then((res) => {
        expect(res.statusCode).toBe(422);
      });
  });
});
