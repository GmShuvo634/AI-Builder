import { config } from "dotenv";
config({ path: ".env.local" });  // load before anything else

import { Sandbox } from "@e2b/code-interpreter";

async function main() {
  console.log("[E2B] creating sandbox from template: jmyay7zebprm39mysw27");
  
  try {
    const sandbox = await Sandbox.create("base", {
      apiKey: process.env.E2B_API_KEY,  // explicit is safer
    });
    
    console.log("[E2B] sandbox created:", sandbox.sandboxId);
    
    const result = await sandbox.commands.run("node --version");
    console.log("[E2B] node version:", result.stdout);
    
    await sandbox.kill();
    console.log("[E2B] sandbox test passed");
  } catch (e) {
    console.error("[E2B] sandbox test failed");
    console.error(e);
  }
}

main();