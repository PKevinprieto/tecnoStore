import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from "mercadopago";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN,
});
const compras = {}; //esto es nuevo

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});
app.post("/crear-preferencia", async (req, res) => {
  try {
    const { items } = req.body;
    const orderId = `ORDEN-${Date.now()}`; //esto es nuevo
    compras[orderId] = {
      productos: items,
      estado: "pendiente",
    }; //esto es nuevo

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items,
        external_reference: orderId,
        back_urls: {
          success: "http://127.0.0.1:5500/?status=success",
          failure: "http://127.0.0.1:5500/?status=failure",
          pending: "http://127.0.0.1:5500/?status=pending",
        },
        // auto_return: "approved", ACTIVAR CUANDO SUBA A  UN DOMINIO
      },
    });

    res.json({
      id: response.id,
      init_point: response.init_point,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al crear la preferencia",
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
