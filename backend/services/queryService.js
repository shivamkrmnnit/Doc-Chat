import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";
import { sendQueryToLLM } from "../utils/callFastAPI.js";

const prisma = new PrismaClient();

export async function createQuery(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return {
      status: 400,
      body: {
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      },
    };
  }

  const { question, documentId } = req.body;
  const userId = req.user.id;

  if (documentId) {
    const doc = await prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!doc) {
      return {
        status: 404,
        body: { success: false, message: "Document not found" },
      };
    }
  }

  // 🧠 Call LLM service
  const response = await sendQueryToLLM({ user: userId, question });

  const answerByLLM = response.body.answer;
  const metadata = response.body?.metadata ?? {};
  
  // 🗃️ Store query and answer in DB
    const query = await prisma.query.create({
      data: {
        question,
        userId,
        documentId: documentId || null,
        answer: answerByLLM,
      },
      include: {
        document: {
          select: {
            id: true,
            originalName: true,
            mimeType: true,
          },
        },
      },
    });

  return {
    status: 201,
    body: {
      success: true,
      message: "Query created successfully",
      data: { query,  metadata}
    },
  };
}

export async function getAllQueries(req) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const documentId = req.query.documentId;
    const skip = (page - 1) * limit;
    const userId = req.user.id;

    const where = {
      userId,
      ...(documentId && { documentId }),
    };

    const [queries, total] = await Promise.all([
      prisma.query.findMany({
        where,
        include: {
          document: {
            select: { id: true, originalName: true, mimeType: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.query.count({ where }),
    ]);

    return {
      status: 200,
      body: {
        success: true,
        data: {
          queries,
          pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        },
      },
    };
  } catch (error) {
    console.error("Get queries error:", error);
    return {
      status: 500,
      body: { success: false, message: "Internal server error" },
    };
  }
}

export async function getQueryById(req) {
  try {
    const userId = req.user.id;

    const query = await prisma.query.findFirst({
      where: { id: req.params.id, userId },
      include: {
        document: {
          select: { id: true, originalName: true, mimeType: true },
        },
      },
    });

    if (!query) {
      return {
        status: 404,
        body: { success: false, message: "Query not found" },
      };
    }

    return { status: 200, body: { success: true, data: { query } } };
  } catch (error) {
    console.error("Get query error:", error);
    return {
      status: 500,
      body: { success: false, message: "Internal server error" },
    };
  }
}

export async function updateQueryAnswer(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return {
      status: 400,
      body: {
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      },
    };
  }

  const { answer, metadata } = req.body;
  const userId = req.user.id;
  const query = await prisma.query.findFirst({
    where: { id: req.params.id, userId },
  });

  if (!query) {
    return {
      status: 404,
      body: { success: false, message: "Query not found" },
    };
  }

  const updated = await prisma.query.update({
    where: { id: req.params.id },
    data: { answer },
    include: {
      document: {
        select: { id: true, originalName: true, mimeType: true },
      },
    },
  });

  return {
    status: 200,
    body: {
      success: true,
      message: "Query updated successfully",
      data: { query: updated },
    },
  };
}

export async function deleteQuery(req) {
  const userId = req.user.id;

  const query = await prisma.query.findFirst({
    where: { id: req.params.id, userId },
  });

  if (!query) {
    return {
      status: 404,
      body: { success: false, message: "Query not found" },
    };
  }

  await prisma.query.delete({ where: { id: req.params.id } });

  return {
    status: 200,
    body: { success: true, message: "Query deleted successfully" },
  };
}

export async function getQueryStats(req) {
  try {
    const userId = req.user.id;

    const [totalQueries, totalDocuments, recentQueries] = await Promise.all([
      prisma.query.count({ where: { userId } }),
      prisma.document.count({ where: { userId } }),
      prisma.query.findMany({
        where: { userId },
        include: { document: { select: { originalName: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return {
      status: 200,
      body: {
        success: true,
        data: {
          statistics: { totalQueries, totalDocuments, recentQueries },
        },
      },
    };
  } catch (error) {
    console.error("Get query stats error:", error);
    return {
      status: 500,
      body: { success: false, message: "Internal server error" },
    };
  }
}
