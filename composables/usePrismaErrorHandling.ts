// Type guard to check if error is a Prisma-like error
interface PrismaLikeError {
  name: string;
  message: string;
  code: string;
}

function isPrismaLikeError(e: unknown): e is PrismaLikeError {
  return (
    typeof e === 'object' &&
    e !== null &&
    'name' in e &&
    'message' in e &&
    'code' in e &&
    typeof (e as PrismaLikeError).name === 'string' &&
    (e as PrismaLikeError).name.includes('Prisma')
  );
}

// Error handling for database operations (works with both Prisma and mock mode)
export function usePrismaErrorHandling(e: unknown) {
  // Check if it's a Prisma error using type guard
  if (isPrismaLikeError(e)) {
    return showError({
      message: e.message,
      statusCode: Number(e.code),
    });
  }

  if (typeof e === 'object') {
    return showError({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: JSON.parse(e as any),
      statusCode: 500,
    });
  }

  showError({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message: e as any,
    statusCode: 500,
  });
}
