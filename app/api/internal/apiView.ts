import { API_KEY } from '@/app/api/internal/apiKey';
import { ZodError } from 'zod';
import { NextResponse } from 'next/server';

export const InternalAPIView =
  (handler: (request: Request) => Promise<NextResponse>) => (request: Request) => {
    try {
      const authHeader = request.headers.get('Authorization');

      if (authHeader === null) {
        return NextResponse.json({}, { status: 403 });
      }

      if (!authHeader.includes(API_KEY)) {
        return NextResponse.json({}, { status: 403 });
      }
      return handler(request);
    } catch (error) {
      console.error('Error: ', error);
      if (error instanceof ZodError) {
        return NextResponse.json({ errors: error.issues }, { status: 400 });
      } else {
        return NextResponse.json({ error }, { status: 400 });
      }
    }
  };
