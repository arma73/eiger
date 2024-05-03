/**
 * @abstract
 */
abstract class ManagerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Logs the error message to the console.
   */
  public logError() {
    console.error(`[${this.name}]: ${this.message}`);
  }

  protected abstract override toString(): string;

  /**
   * Returns a JSON representation of the error object.
   */
  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
    };
  }
}

export default ManagerError;
