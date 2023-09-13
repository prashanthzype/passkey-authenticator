import getServer from './server.js';

(async () => {
  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });
  const server = await getServer()
  const port = server.config.PORT;
  const host = server.config.SERVER_HOST;
  
  server.listen({ host, port });

  server.ready(err => {
    if (err) {
      server.log.error(err)
      server.close().then((err) => {
          console.log(`close application on ${Error}`);
          process.exit(err ? 1 : 0);
      })
    }
    console.log(`Server listening on ${host} at port ${port}`)
  })
  
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () =>
    server.close().then((err) => {
        console.log(`close application on ${signal}`);
        process.exit(err ? 1 : 0);
      }),
    );
  }
})()


