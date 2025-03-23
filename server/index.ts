import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import fastifyCors from "@fastify/cors";
import { Server } from "socket.io";
import { namespaces, wikiNs } from "./constants";
import Room from "./classes/Room";

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
}

const server = fastify({});

// Declare a route
server.get("/add-room", async (request, reply) => {
  console.log("comming request");
  wikiNs.addRoom(new Room(4, "deleted message"));
  server.io.of("/wiki").emit("addRoom", wikiNs);
  return wikiNs;
});

await server.register(fastifyIO, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

server.ready().then(() => {
  console.log("server is ready");

  server.io.on("connection", (socket) => {
    console.log(socket.id, "is connected");
    socket.join("chat");
    server.io.emit("namespace-lists", namespaces);
  });
  server.io.of("/wiki").on("connection", (socket) => {
    console.log(socket.id, "is connected to wikinamespace");
  });
});

// Run the server!
try {
  await server.listen({ port: 3000 });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
