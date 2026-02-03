import { prisma } from '@/lib/db';

const MAX_DEVICES = 2;

export async function registerDevice({
  userId,
  deviceId,
  userAgent
}: {
  userId: string;
  deviceId: string;
  userAgent: string;
}) {
  const existing = await prisma.device.findMany({
    where: { userId },
    orderBy: { lastSeen: 'desc' }
  });

  if (existing.length >= MAX_DEVICES) {
    return { allowed: false, devices: existing };
  }

  await prisma.device.upsert({
    where: { userId_deviceId: { userId, deviceId } },
    update: { lastSeen: new Date(), userAgent },
    create: { userId, deviceId, userAgent }
  });

  return { allowed: true, devices: [] };
}

export async function revokeDevice(userId: string, deviceId: string) {
  await prisma.device.delete({
    where: { userId_deviceId: { userId, deviceId } }
  });
}
