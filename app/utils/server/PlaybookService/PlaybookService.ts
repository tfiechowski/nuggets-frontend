import { UserMembership } from '@/app/utils/server/getUserTeam';
import { PlaybookStep } from '@/app/utils/types';
import { prisma } from '@/lib/db';
import { Playbook } from '@prisma/client';
import { omit } from 'lodash';

export class PlaybookService {
  static getPlaybooks(
    userMembership: UserMembership,
    customerCallId: string
  ): Promise<Array<Playbook>> {
    return prisma.playbook.findMany({
      where: {
        organizationId: {
          equals: userMembership.organization.id,
        },
        customerCallId: {
          equals: customerCallId,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  static async setupDefaultPlaybookTemplatesForOrganization(organizationId: string): Promise<void> {
    const defaultPlaybookTemplates: Array<{
      content: Record<string, PlaybookStep>;
      organizationId: string;
      title: string;
    }> = [
      {
        content: {
          '1': { id: '1', name: 'Step #1', done: false },
          '2': { id: '2', name: 'Step #2', done: false },
          '3': { id: '3', name: 'Step #3', done: false },
          '4': { id: '4', name: 'Step #4', done: false },
        },
        organizationId,
        title: 'Playbook Template #1',
      },
      {
        content: {
          '1': { id: '1', name: 'Step #A', done: false },
          '2': { id: '2', name: 'Step #B', done: false },
          '3': { id: '3', name: 'Step #C', done: false },
        },
        organizationId,
        title: 'Playbook Template #2',
      },
    ];

    await prisma.playbookTemplate.createMany({
      data: defaultPlaybookTemplates.map((playbookTemplateData) => ({
        ...playbookTemplateData,
        content: JSON.stringify(playbookTemplateData.content),
      })),
    });
  }

  static async updateContent(
    userMembership: UserMembership,
    id: string,
    content: string
  ): Promise<void> {
    await prisma.playbook.update({
      data: {
        content,
      },
      where: {
        id,
        organizationId: {
          equals: userMembership.organization.id,
        },
      },
    });
  }

  static async setupPlaybooksForCall(
    organizationId: string,
    customerCallId: string
  ): Promise<void> {
    const playbookTemplates = await prisma.playbookTemplate.findMany({
      where: {
        organizationId: {
          equals: organizationId,
        },
      },
    });

    await prisma.playbook.createMany({
      data: playbookTemplates.map((playbookTemplate) => ({
        ...omit(playbookTemplate, ['id', 'createdAt', 'updatedAt']),
        customerCallId,
      })),
    });
  }
}
