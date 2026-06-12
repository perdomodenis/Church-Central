import { listMembers } from './src/lib/dataconnect/index.esm.js';

async function test() {
  try {
    const res = await listMembers();
    console.log(res);
  } catch (e) {
    console.error(e);
  }
}
test();
