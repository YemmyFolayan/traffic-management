export interface ApiResponseShape<T> {
  entity: T;
  error: { code: string; message: string } | null;
  status: boolean;
}

export function successResponse<T>(entity: T): ApiResponseShape<T> {
  return { entity, error: null, status: true };
}

export function errorResponse(code: string, message: string): ApiResponseShape<null> {
  return { entity: null, error: { code, message }, status: false };
}
