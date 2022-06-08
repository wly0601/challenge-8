class ApplicationError extends Error {
  get Details() {
    return this.details;
  }

  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        details: this.details,
      }
    }
  }
}

module.exports = ApplicationError;
