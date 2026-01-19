import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiParseController {


    private GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || '';

    onParseDocument = async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                res.status(400).json({ error: "No file uploaded" });
                return;
            }

            // Convertimos el Buffer del archivo directamente a Base64
            const base64Data = req.file.buffer.toString('base64');
            const mimeType = req.file.mimetype;

            // Inicializamos Gemini
            const genAI = new GoogleGenerativeAI(this.GOOGLE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-3-flash-preview"
            });

            const prompt = `
      Actúa como un experto en contabilidad. Analiza esta imagen o PDF de factura.
      Extrae los datos y devuélvelos estrictamente en formato JSON:
      {
        "emisor": "nombre de la empresa",
        "nombre_cliente": "Nombre del cliente o razón social",
        "nit_o_id": "número de identificación tributaria",
        "numero_factura": "string",
        "fecha": "ISO date",
        "total": number,
        "moneda": "string",
        "productos": [
          { "descripcion": "string", "cantidad": number,"precio_unitario": number, "subtotal": number }
        ]
      }
    `;

            // 4. Enviamos el archivo directamente a Gemini
            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType
                    }
                }
            ]);


            const response = await result.response;
            const text = response.text();

            // Limpiamos la respuesta por si Gemini incluye markdown (```json ... ```)
            const jsonString = text.replace(/```json|```/g, "").trim();
            const datosFactura = JSON.parse(jsonString);

            res.json(datosFactura);


        } catch (err: any) {
            console.error("Error:", err.message);
            res.status(500).json({ error: "Error procesando factura" });
        }
    }

}