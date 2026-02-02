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
