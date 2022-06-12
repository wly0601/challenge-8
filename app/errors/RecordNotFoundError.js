const ApplicationError = require("./ApplicationError");

class RecordNotFoundError extends ApplicationError {
  constructor(name) {
    super(`${name} not found!`)
    this.message = `Please try again!`;
  }

  get details(){
    return {
      message: this.message
    }
  }
}

module.exports = RecordNotFoundError;
