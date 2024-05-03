import ManagerError from './Manager.error';

/**
 * @extends ManagerError
 */
class ValidationError extends ManagerError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }

  public toString(): string {
    return `${this.name}: ${this.message}`;
  }
}

export default ValidationError;
