// Error handling for database operations (works with both Prisma and mock mode)
export function usePrismaErrorHandling(e: unknown) {
  // Check if it's a Prisma error (only available when not in mock mode)
  // We do a dynamic check since Prisma might not be available in mock mode
  if (
    typeof e === 'object' &&
    e !== null &&
    'code' in e &&
    'message' in e &&
    'name' in e &&
    typeof (e as { name: unknown }).name === 'string' &&
    ((e as { name: string }).name as string).includes('Prisma')
  ) {
    const prismaError = e as { message: string; code: string };
    return showError({
      message: prismaError.message,
      statusCode: Number(prismaError.code),
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
