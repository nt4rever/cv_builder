import { Prisma } from '@prisma/client';

export const CVStorageResponse = {
  id: true,
  template: {
    select: {
      id: true,
      category: true,
      name: true,
      description: true,
      urlImage: true,
      theme: true,
    },
  },
  about: true,
  contact: true,
  sections: {
    select: {
      id: true,
      order: true,
      type: true,
      heading: true,
      standards: {
        select: {
          id: true,
          name: true,
          title: true,
          start: true,
          stop: true,
          current: true,
          description: true,
          website: true,
          order: true,
        },
        orderBy: {
          order: Prisma.SortOrder.asc,
        },
      },
      details: {
        select: {
          id: true,
          title: true,
          subTitle: true,
          order: true,
        },
        orderBy: {
          order: Prisma.SortOrder.asc,
        },
      },
      tags: true,
    },
    orderBy: {
      order: Prisma.SortOrder.asc,
    },
  },
  theme: true,
  avatar: true,
  urlImage: true,
  isPublic: true,
  createdAt: true,
  updatedAt: true,
};
