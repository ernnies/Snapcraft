import { Request, Response } from "express";
import PDFDocument from "pdfkit";

export const generateReport = async (req: Request, res: Response) => {
  try {
    const { workflow, performanceData } = req.body as {
      workflow: string[];
      performanceData: { successRate: number; averageYield: number };
    };

    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdf = Buffer.concat(buffers);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="workflow-report.pdf"');
      res.send(pdf);
    });

    doc.fontSize(20).text("C0mrad Workflow Report", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Workflow: ${workflow.join(" → ")}`);
    doc.text(`Success Rate: ${(performanceData.successRate * 100).toFixed(1)}%`);
    doc.text(`Average Yield: ${(performanceData.averageYield * 100).toFixed(1)}%`);
    doc.text(`Generated: ${new Date().toISOString()}`);
    doc.end();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};