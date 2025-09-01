import { Prisma } from '@prisma/client';

export function usePrismaErrorHandling(e: unknown) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    return showError({
      message: e.message,
      statusCode: Number(e.code),
    });
  }

  if (e instanceof Error) {
    return showError({
      message: e.message,
      statusCode: 500,
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
