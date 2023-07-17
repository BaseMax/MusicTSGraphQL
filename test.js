const fastify = require("fastify");

const app = fastify();
app.register(require('@fastify/multipart'), {
  limits: {
    fieldNameSize: 100, // Max field name size in bytes
    fieldSize: 100,     // Max field value size in bytes
    fields: 10,         // Max number of non-file fields
    fileSize: 1000000000,  // For multipart forms, the max file size in bytes
    files: 1,           // Max number of file fields
    headerPairs: 2000,  // Max number of header key=>value pairs
    parts: 1000         // For multipart forms, the max number of parts (fields + files)
  }
});

app.post("/", {
  // config: {
  //   // add the rawBody to this route. if false, rawBody will be disabled when global is true
  //   rawBody: true,
  // },
  async handler(req, reply) {
    const file = await req.file()
    
    // req.rawBody the string raw body
    reply.send(await file.toBuffer());
  },
});

app.listen({
  port: 3010,
});



