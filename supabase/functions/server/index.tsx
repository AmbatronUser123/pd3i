import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { handleKasusMR01Request } from "./kasus_mr01.tsx";

const app = new Hono();

// Export CORS headers for use in other modules
export const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Expose-Headers": "Content-Length",
  "Access-Control-Max-Age": "600",
};

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b2c9964a/health", (c) => {
  return c.json({ status: "ok" });
});

// KV store operations for case data
app.post("/make-server-b2c9964a/kasus", async (c) => {
  try {
    const body = await c.req.json();
    const { action, key, value, keys, values, prefix } = body;

    switch (action) {
      case 'set':
        if (!key || value === undefined) {
          return c.json({ error: "Key and value are required for set operation" }, 400);
        }
        await kv.set(key, value);
        return c.json({ success: true });

      case 'get':
        if (!key) {
          return c.json({ error: "Key is required for get operation" }, 400);
        }
        const data = await kv.get(key);
        return c.json({ data });

      case 'del':
        if (!key) {
          return c.json({ error: "Key is required for delete operation" }, 400);
        }
        await kv.del(key);
        return c.json({ success: true });

      case 'mset':
        if (!keys || !values || keys.length !== values.length) {
          return c.json({ error: "Keys and values arrays are required and must be same length" }, 400);
        }
        await kv.mset(keys, values);
        return c.json({ success: true });

      case 'mget':
        if (!keys || !Array.isArray(keys)) {
          return c.json({ error: "Keys array is required for mget operation" }, 400);
        }
        const multiData = await kv.mget(keys);
        return c.json({ data: multiData });

      case 'mdel':
        if (!keys || !Array.isArray(keys)) {
          return c.json({ error: "Keys array is required for mdel operation" }, 400);
        }
        await kv.mdel(keys);
        return c.json({ success: true });

      case 'getByPrefix':
        if (!prefix) {
          return c.json({ error: "Prefix is required for getByPrefix operation" }, 400);
        }
        const prefixData = await kv.getByPrefix(prefix);
        return c.json({ data: prefixData });

      default:
        return c.json({ error: "Invalid action. Supported actions: set, get, del, mset, mget, mdel, getByPrefix" }, 400);
    }
  } catch (error) {
    console.error("KV store operation error:", error);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
});

// Kasus MR01 table operations
app.post("/make-server-b2c9964a/kasus-mr01", async (c) => {
  try {
    return await handleKasusMR01Request(c.req.raw);
  } catch (error) {
    console.error("Kasus MR01 operation error:", error);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
});

Deno.serve(app.fetch);