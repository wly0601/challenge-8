const ApplicationError = require("./ApplicationError");

class CarAlreadyRentedError extends ApplicationError {
  constructor(car) {
    super(`${car.name} is already rented!!`);
    this.message = "Please choose another car!";
  }

  get details() {
    return {
      message: this.message 
    }
  }
}

module.exports = CarAlreadyRentedError;
