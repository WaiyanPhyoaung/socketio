import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import fastifyCors from "@fastify/cors";
import { Server } from "socket.io";

// Type augmentation for FastifyInstance
declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
}

// Enable logger if you want to use server.log
const server = fastify({});

// Register Socket.IO with CORS configuration
await server.register(fastifyIO, {
  cors: {
    origin: "http://localhost:5173", // Match your frontend origin
    methods: ["GET", "POST"], // Allow necessary methods
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
    console.log("a user connected");
    socket.on("from-client", (data) => {
      console.log("from-client", data);
    });
  });
});

// Run the server!
try {
  await server.listen({ port: 3000 });
} catch (err) {
  server.log.error(err); // Works if logger is enabled
  // Alternatively: console.error(err);
  process.exit(1);
}
