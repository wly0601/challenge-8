class ApplicationError extends Error {
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
