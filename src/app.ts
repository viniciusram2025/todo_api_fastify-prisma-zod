import { buildServer } from "./server";

const app = buildServer();

async function main() {
  try {
    await app
      .listen({ port: 3000 })
      .then(() => console.log(
        `Server running http://localhost:3000`
      )
    )
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();