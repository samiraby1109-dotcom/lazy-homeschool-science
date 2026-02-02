import { prisma } from '../lib/db';

async function main() {
  const adminEmail = 'admin@lazyhomeschoolscience.local';
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin'
    }
  });

  const category = await prisma.category.create({
    data: {
      name: 'Forces & Motion',
      description: 'Pushes, pulls, and everyday motion.',
      topics: {
        create: {
          name: 'Why do magnets stick?',
          summary: 'Explore how magnets attract and repel.',
          subtopics: {
            create: {
              name: 'Everyday magnets',
              summary: 'Where kids see magnets at home.'
            }
          }
        }
      }
    }
  });

  const topic = await prisma.topic.findFirstOrThrow({
    where: { categoryId: category.id }
  });

  await prisma.resource.create({
    data: {
      url: 'https://example.com/magnets-video',
      title: 'Magnets for kids (placeholder)',
      provider: 'Sample Source',
      type: 'VIDEO',
      ageMin: 5,
      ageMax: 7,
      watchTimeMin: 6,
      summary: 'Placeholder vetted video summary.',
      notes: 'Replace with real vetted transcript.',
      vettedBy: admin.email ?? undefined,
      vettedAt: new Date(),
      status: 'APPROVED',
      topicId: topic.id,
      transcript: 'Magnets can attract some metals. Magnets have two poles.'
    }
  });

  const seasonalCategory = await prisma.category.create({
    data: {
      name: 'Seasonal Science',
      description: 'Celebrate seasons with timely science topics.',
      topics: {
        create: {
          name: 'Valentine’s Science: The Body',
          summary: 'Explore how hearts, brains, and healthy habits keep us feeling strong.',
          subtopics: {
            create: [
              { name: 'Heart', summary: 'How hearts beat and keep us moving.' },
              { name: 'Blood & Circulation', summary: 'How blood travels through our bodies.' },
              { name: 'Brain & Feelings', summary: 'How brains help us feel and think.' },
              { name: 'Healthy Habits', summary: 'Daily routines that support strong bodies.' }
            ]
          }
        }
      }
    }
  });

  await prisma.topic.findFirstOrThrow({
    where: { categoryId: seasonalCategory.id }
  });

  await prisma.trustedSource.createMany({
    data: [
      {
        name: 'SciShow Kids',
        type: 'YOUTUBE_CHANNEL',
        trustTier: 'HIGH',
        isActive: false,
        channelId: null,
        baseUrl: null,
        contentTypesAllowed: ['VIDEO'],
        notes: 'Add channelId to activate.'
      },
      {
        name: 'Peekaboo Kidz',
        type: 'YOUTUBE_CHANNEL',
        trustTier: 'HIGH',
        isActive: false,
        channelId: null,
        baseUrl: null,
        contentTypesAllowed: ['VIDEO'],
        notes: 'Add channelId to activate.'
      },
      {
        name: 'Amoeba Sisters',
        type: 'YOUTUBE_CHANNEL',
        trustTier: 'HIGH',
        isActive: false,
        channelId: null,
        baseUrl: null,
        contentTypesAllowed: ['VIDEO'],
        notes: 'Add channelId to activate.'
      },
      {
        name: 'Nat Geo Kids (YouTube)',
        type: 'YOUTUBE_CHANNEL',
        trustTier: 'HIGH',
        isActive: false,
        channelId: null,
        baseUrl: null,
        contentTypesAllowed: ['VIDEO'],
        notes: 'Add channelId to activate.'
      },
      {
        name: 'PBS Kids',
        type: 'WEBSITE',
        trustTier: 'HIGH',
        isActive: true,
        baseUrl: 'https://pbskids.org',
        contentTypesAllowed: ['VIDEO', 'ARTICLE', 'LESSON'],
        notes: 'Manual review required for specific pages.'
      },
      {
        name: 'National Geographic Kids',
        type: 'WEBSITE',
        trustTier: 'HIGH',
        isActive: true,
        baseUrl: 'https://kids.nationalgeographic.com',
        contentTypesAllowed: ['ARTICLE', 'VIDEO'],
        notes: 'Manual selection only.'
      },
      {
        name: 'NASA Kids Club',
        type: 'WEBSITE',
        trustTier: 'HIGH',
        isActive: true,
        baseUrl: 'https://www.nasa.gov/stem/kids',
        contentTypesAllowed: ['ARTICLE', 'LESSON'],
        notes: 'Manual selection only.'
      },
      {
        name: 'Science Buddies',
        type: 'WEBSITE',
        trustTier: 'HIGH',
        isActive: true,
        baseUrl: 'https://www.sciencebuddies.org',
        contentTypesAllowed: ['EXPERIMENT', 'ARTICLE'],
        notes: 'Manual selection only.'
      },
      {
        name: 'Exploratorium',
        type: 'WEBSITE',
        trustTier: 'HIGH',
        isActive: true,
        baseUrl: 'https://www.exploratorium.edu',
        contentTypesAllowed: ['EXPERIMENT', 'ARTICLE'],
        notes: 'Manual selection only.'
      },
      {
        name: 'Homeschool Blog A',
        type: 'WEBSITE',
        trustTier: 'REVIEW_REQUIRED',
        isActive: true,
        baseUrl: 'https://example-homeschool-blog-a.com',
        contentTypesAllowed: ['ARTICLE', 'EXPERIMENT'],
        notes: 'Blog source; never auto-approve.'
      },
      {
        name: 'Homeschool Blog B',
        type: 'WEBSITE',
        trustTier: 'REVIEW_REQUIRED',
        isActive: true,
        baseUrl: 'https://example-homeschool-blog-b.com',
        contentTypesAllowed: ['ARTICLE', 'LESSON'],
        notes: 'Blog source; never auto-approve.'
      },
      {
        name: 'Homeschool Blog C',
        type: 'WEBSITE',
        trustTier: 'REVIEW_REQUIRED',
        isActive: true,
        baseUrl: 'https://example-homeschool-blog-c.com',
        contentTypesAllowed: ['ARTICLE', 'WORKSHEET'],
        notes: 'Blog source; never auto-approve.'
      }
    ]
  });

  console.log('Seeded admin and sample content.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
