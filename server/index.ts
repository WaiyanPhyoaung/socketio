import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import fastifyCors from "@fastify/cors";
import { Server } from "socket.io";
import { namespaces } from "./constants";

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
}

const server = fastify({});

await server.register(fastifyIO, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Declare a route
server.get("/", async (request, reply) => {
  console.log("request", request);
  return { hello: "world" };
});

server.ready().then(() => {
  console.log("server is ready");
  server.io.on("connection", (socket) => {
    console.log("A user connected");
    server.io.emit("namespace-lists", namespaces);
  });
});

// Run the server!
try {
  await server.listen({ port: 3000 });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
