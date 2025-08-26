export abstract class DomainError extends Error {
  public readonly name: string;
  public readonly code: string;
  public readonly timestamp: Date;
  public readonly context?: Record<string, any>;

  constructor(message: string, code: string, context?: Record<string, any>) {
    super(message);

    // Ensure proper inheritance for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date();
    this.context = context;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // public toJSON(): Record<string, any> {
  //   return {
  //     name: this.name,
  //     message: this.message,
  //     code: this.code,
  //     timestamp: this.timestamp.toISOString(),
  //     context: this.context,
  //     stack: this.stack,
  //   };
  // }

  public hasContext(): boolean {
    return this.context !== undefined && Object.keys(this.context).length > 0;
  }
}
