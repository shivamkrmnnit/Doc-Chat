import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUserProfile = async (id) => {
  if (!id) throw new Error("User ID is required");
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  if (!user) throw new Error("User not found");
  return user;
};




export const createHistory = async ({ userId, query, response }) => {
  const res = await prisma.History.create({
    data: {
      userId: parseInt(userId),
      query,
      response,
    },
  });

  return res;
};

export const fetchHistoryByUserId = async (userId) => {
  return await prisma.history.findMany({
    where: { userId: parseInt(userId) },
    orderBy: { timestamp: "desc" },
  });
};

export const deleteHistoryById = async (historyId, userId) => {
  const history = await prisma.history.findUnique({
    where: { id: historyId },
  });

  if (!history) {
    throw { status: 404, message: 'History not found' };
  }

  if (history.userId !== userId) {
    throw { status: 403, message: 'Unauthorized to delete this entry' };
  }

  await prisma.history.delete({
    where: { id: historyId },
  });

  return { message: 'History deleted successfully' };
};