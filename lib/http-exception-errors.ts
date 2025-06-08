export default class HttpException extends Error {
  constructor(
    readonly message: string,
    readonly code: number,
  ) {
    super(message);
  }
}

export class Error404NotFound extends HttpException {
  constructor(message: string) {
    super("ErrorNotFound: " + message, 404);
  }
}

export class ErrorBadRequest extends HttpException {
  constructor(message: string) {
    super("ErrorBadRequest: " + message, 400);
  }
}

export class ErrorUnauthorised extends HttpException {
  constructor(message: string) {
    super("ErrorUnauthorised: " + message, 401);
  }
}

export class ErrorForbidden extends HttpException {
  constructor(message: string) {
    super("ErrorForbidden: " + message, 403);
  }
}
