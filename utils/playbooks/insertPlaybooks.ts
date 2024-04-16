import { prisma } from '@/lib/db';
import { title } from '@/utils/playbooks/data';
import { getContent } from '@/utils/playbooks/playbooks';

const TITLE = title;
const CONTENT: string = getContent();

function validate() {
  const content = JSON.parse(CONTENT);

  if (!!content.checkedItems) {
    throw new Error("Content doesn't have checkedItems dict");
  }
}

async function handle() {
  validate();

  const org = await prisma.organization.findFirstOrThrow({
    where: {
      name: {
        equals: 'Nuggets',
      },
    },
  });

  const organizationId = org.id;

  const call = await prisma.customerCall.findFirstOrThrow({
    where: {
      organizer: {
        organizationId: {
          equals: organizationId,
        },
      },
    },
  });

  const customerCallId = call.id;

  await prisma.playbookTemplate.create({
    data: {
      title: TITLE,
      content: CONTENT,
      organizationId,
    },
  });

  await prisma.playbook.create({
    data: {
      title: TITLE,
      content: CONTENT,
      organizationId,
      customerCallId,
    },
  });

  console.log(`Created playbook for org: ${org.name} (${organizationId})!`);
}

handle();
