import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import WebSocket = require("ws");
import { log } from "console";

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

wss.on("connection", (ws: WebSocket) => {
    console.log("New Websocket connection established");

    ws.on("message", (message: string) => {
        console.log("Received:", message);

        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on("close", () => console.log("Websocket connection closed"));
});

app.get("/", (_, res) => {
  res.send("NexaShare Backend is running");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});