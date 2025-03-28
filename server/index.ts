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
let username = "";
let password = "";

const server = fastify({});
await server.register(fastifyCors, {
  origin: "http://localhost:5173",
});
await server.register(fastifyIO, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Declare a route
server.get("/nschange", async (request, reply) => {
  wikiNs.addRoom(new Room(4, "deleted message"));
  server.io.of("/wiki").emit("nschange", wikiNs);
  return wikiNs;
});

server.ready().then(() => {
  console.log("server is ready");

  server.io.on("connection", (socket) => {
    username = socket.handshake.auth.username;
    console.log(socket.id, "is connected to main namespace");

    // Send namespace list only once per connection
    socket.emit("namespaceList", namespaces);

    socket.on("disconnect", () => {
      console.log(socket.id, "disconnected from main namespace");
    });
  });

  namespaces.forEach((namespace: any) => {
    server.io.of(namespace.endpoint).on("connection", (socket) => {
      console.log(socket.id, "is connected to", namespace.endpoint);

      socket.on("joinroom", async (roomTitle, ackCB) => {
        console.log("joining to the ", roomTitle);

        // Before joining leave other rooms
        Array.from(socket.rooms)
          .slice(1)
          .forEach((room) => {
            socket.leave(room);
          });

        socket.join(roomTitle);

        const connectedSockets = await server.io
          .of(namespace.endpoint)
          .in(roomTitle)
          .fetchSockets();

        ackCB({
          numberOfUsers: connectedSockets.length,
        });
      });

      socket.on("new-message", (message) => {
        const rooms = Array.from(socket.rooms);
        console.log("room1", rooms);
        const time = new Date().toLocaleString();
        server.io
          .of(namespace.endpoint)
          .to(rooms[1])
          .emit("messages", { message, username, time });
      });
      socket.on("disconnect", () => {
        console.log(socket.id, "disconnected from", namespace.endpoint);
      });
    });
  });
});

// Run the server!
try {
  await server.listen({ port: 3000 });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
