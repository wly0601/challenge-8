const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const bcrypt = require("bcryptjs");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");

const {
  ApplicationController,
  AuthenticationController,
  CarController,
} = require("./controllers");

const {
  User,
  Role,
  Car,
  UserCar,
} = require("./models");

function apply(app) {
  const carModel = Car;
  const roleModel = Role;
  const userModel = User;
  const userCarModel = UserCar;

  const applicationController = new ApplicationController();
  const authenticationController = new AuthenticationController({
    bcrypt, 
    jwt, 
    roleModel, 
    userModel, 
  });
  const carController = new CarController({
    carModel, 
    userCarModel, 
    dayjs 
  });

  const accessControl = authenticationController.accessControl;
  const options = {
    customCssUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
      ],
  };

  app.get('/api-docs.json', (req, res) => res.send(swaggerDocument));
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument, options));
  
  app.get("/", applicationController.handleGetRoot)
  app.get("/favicon.ico", (req, res) => res.status(204).end())

  app.get("/v1/cars", carController.handleListCars);
  app.post("/v1/cars", authenticationController.authorize(accessControl.ADMIN), carController.handleCreateCar);
  app.post("/v1/cars/:id/rent", authenticationController.authorize(accessControl.CUSTOMER), carController.handleRentCar);
  app.get("/v1/cars/:id", carController.handleGetCar);
  app.put("/v1/cars/:id", authenticationController.authorize(accessControl.ADMIN), carController.handleUpdateCar);
  app.delete("/v1/cars/:id", authenticationController.authorize(accessControl.ADMIN), carController.handleDeleteCar);

  app.post("/v1/auth/login", authenticationController.handleLogin);
  app.post("/v1/auth/register", authenticationController.handleRegister);
  app.get("/v1/auth/whoami", authenticationController.authorize(accessControl.CUSTOMER), authenticationController.handleGetUser);

  app.use(applicationController.handleNotFound);
  app.use(applicationController.handleError);
  return app;
}

module.exports = {
  apply, 
}
