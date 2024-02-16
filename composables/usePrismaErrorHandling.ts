import { Prisma } from '@prisma/client';

export function usePrismaErrorHandling(e: unknown) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    return showError({
      message: e.message,
      statusCode: Number(e.code),
    });
  }

  if (typeof e === 'object') {
    return showError({
      message: JSON.parse(e as any),
      statusCode: 500,
    });
  }

  showError({
    message: e as any,
    statusCode: 500,
  });
}
