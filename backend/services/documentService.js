import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';
import { uploadFileToLLM } from '../utils/callFastAPI.js';

const prisma = new PrismaClient();


export async function uploadDocuments(req) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return {
        status: 401,
        body: { success: false, message: 'Unauthorized: User ID missing' }
      };
    }

    if (!req.files || req.files.length === 0) {
      return {
        status: 400,
        body: { success: false, message: 'No files uploaded' }
      };
    }

    const documents = [];
    const llmResults = [];

    for (const file of req.files) {
      const document = await prisma.document.create({
        data: {
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          uploadPath: file.path,
          userId: userId,
        }
      });

      documents.push(document);
      // 🔁 Send to LLM after upload
      const fileUrl = `${process.env.SERVER_BASE_URL}/public/uploads/${file.filename}`; // or however your file is publicly accessible

      const llmResponse = await uploadFileToLLM({ "userId": userId, fileUrl, originalName : file.originalname});
      
      llmResults.push({
        file: file.originalname,
        llmStatus: llmResponse.status,
        llmMessage: llmResponse.body.message,
      });
    }

    return {
      status: 201,
      body: {
        success: true,
        message: 'Documents uploaded and processed by LLM',
        data: {
          documents,
          llmResults,
        }
      }
    };
  } catch (error) {
    console.error('Upload error:', error);
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      }
    }

    return {
      status: 500,
      body: { success: false, message: 'Internal server error' }
    };
  }
}


export async function getDocuments(req) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return { status: 401, body: { success: false, message: 'Unauthorized' } };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where: { userId },
        select: {
          id: true, filename: true, originalName: true, mimeType: true, size: true, createdAt: true,
          _count: { select: { queries: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.document.count({ where: { userId } })
    ]);

    return {
      status: 200,
      body: {
        success: true,
        data: {
          documents,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      }
    };
  } catch (error) {
    console.error('Get documents error:', error);
    return { status: 500, body: { success: false, message: 'Internal server error' } };
  }
}

export async function getDocumentById(req) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return { status: 401, body: { success: false, message: 'Unauthorized' } };
    }

    const document = await prisma.document.findFirst({
      where: { id: req.params.id, userId },
      include: { _count: { select: { queries: true } } }
    });

    if (!document) {
      return { status: 404, body: { success: false, message: 'Document not found' } };
    }

    return { status: 200, body: { success: true, data: { document } } };
  } catch (error) {
    console.error('Get document error:', error);
    return { status: 500, body: { success: false, message: 'Internal server error' } };
  }
}

export async function deleteDocument(req) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return { status: 401, body: { success: false, message: 'Unauthorized' } };
    }

    const document = await prisma.document.findFirst({
      where: { id: req.params.id, userId }
    });

    if (!document) {
      return { status: 404, body: { success: false, message: 'Document not found' } };
    }

    await prisma.document.delete({ where: { id: document.id } });

    try {
      await fs.unlink(document.uploadPath);
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
    }

    return { status: 200, body: { success: true, message: 'Document deleted successfully' } };
  } catch (error) {
    console.error('Delete document error:', error);
    return { status: 500, body: { success: false, message: 'Internal server error' } };
  }
}

export async function downloadDocument(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const document = await prisma.document.findFirst({
      where: { id: req.params.id, userId }
    });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    try {
      await fs.access(document.uploadPath);
    } catch (err) {
      return res.status(404).json({ success: false, message: 'File not found on server' });
    }

    return res.download(document.uploadPath, document.originalName);
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
