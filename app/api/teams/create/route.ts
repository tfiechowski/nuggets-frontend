import { OrganizationService } from '@/app/utils/server/OrganizationService';
import { getUserId } from '@/app/utils/server/getUserId';
import { FunctionalValidator, IFunctionalRuleValidator } from '@/lib/validator';
import { NextResponse } from 'next/server';
import { ZodError, z } from 'zod';

interface RequestBody {
  name: string;
}

const RequestBody = z.object({
  name: z.string(),
});

const validateFirstTeam: IFunctionalRuleValidator = (userId: string) => async () => {
  try {
    const userOrganisations = await OrganizationService.getUserOrganisations(userId);

    if (userOrganisations.length > 0) {
      return { error: 'User already has a team' };
    }
  } catch (error) {
    return { error: `Error happened: ${error}` };
  }

  return {};
};

async function handle(
  userId: string,
  body: { name: string }
): Promise<{ data?: any; error?: any }> {
  const { name } = body;

  const functionalValidator = new FunctionalValidator([validateFirstTeam(userId)]);

  const error = await functionalValidator.validate();

  if (error.error) {
    return error;
  }

  const organization = await OrganizationService.createOrganization(userId, name);

  console.log(`Created an "${organization.name} account (id: ${organization.id})!`);

  return { data: organization, error: undefined };
}

export async function POST(request: Request) {
  try {
    const body = RequestBody.parse(await request.json());

    const userId = await getUserId();

    if (userId === undefined) {
      return NextResponse.json({ error: 'Invalid user session' });
    }

    const { data, error } = await handle(userId, body);

    if (error) {
      return NextResponse.json({ error });
    }
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error: ', error);
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.issues });
    } else {
      return NextResponse.json({ error }, { status: 400 });
    }
  }
}
