class ResponseShape {
  constructor(
    readonly status: "success" | "fail" | "error",
    readonly message: string,
    readonly code: number,
    readonly data: object | null,
  ) {}
}

export class SuccessResponse extends ResponseShape {
  constructor(message: string, data: object | null = null) {
    super("success", message, 200, data);
  }
}

export class FailureResponse extends ResponseShape {
  constructor(message: string, code: number, data: object | null = null) {
    super("fail", message, code, data);
  }
}

export class ErrorResponse extends ResponseShape {
  constructor(message: string, code: number, data: object | null = null) {
    super("error", message, code, data);
  }
}
