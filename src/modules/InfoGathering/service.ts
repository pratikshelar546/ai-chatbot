import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import * as fs from "fs";
import * as path from "path";
import { DataItem, DocumentRequest, DocumentResponse } from "./model";
import prisma from "../../database/client";

export class InfoGatheringService {
  async getAllData(): Promise<DataItem[]> {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: "desc" },
    });

    return documents.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      category: doc.category,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async getDataById(id: string): Promise<DataItem | null> {
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) return null;

    return {
      id: document.id,
      title: document.title,
      content: document.content,
      category: document.category,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  async getDataByCategory(category: string): Promise<DataItem[]> {
    const documents = await prisma.document.findMany({
      where: { category },
      orderBy: { createdAt: "desc" },
    });

    return documents.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      category: doc.category,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }


  async addDocumentWithFile(data: {
    title: string;
    content: string;
    category: string;
    fileName: string;
    originalName: string;
    cloudinaryUrl?: string;
  }): Promise<DataItem> {
    const newDocument = await prisma.document.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
        fileName: data.fileName,
        originalName: data.originalName,
        cloudinaryUrl: data.cloudinaryUrl,
      },
    });

    return {
      id: newDocument.id,
      title: newDocument.title,
      content: newDocument.content,
      category: newDocument.category,
      createdAt: newDocument.createdAt,
      updatedAt: newDocument.updatedAt,
    };
  }


}

export default InfoGatheringService;
