async function main(): Promise<void> {
  console.log('sync-example-upstreams: not yet implemented');
}

if (!process.env.VITEST) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
