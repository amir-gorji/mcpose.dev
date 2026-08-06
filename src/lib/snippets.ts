/* Hero code snippets, extracted character-exact from the landing mock
   (design_handoff/"mcpose Landing.dc.html"), including the deliberate
   trailing-comment alignment whitespace. Do not reflow. */

/* Variant "audit-http" — the shipped build-time default. */
export const HERO_AUDIT_HTTP =
  "// Wrap any upstream MCP server — unmodified\nconst backend = await createBackendClient({\n  command: 'node',\n  args: ['./es-server.mjs'],\n});\n\nconst audit = createAuditMiddleware({\n  signingKey: createDefaultSigningKeyProvider(process.env.AUDIT_SECRET!),\n  onEvent: (e) => auditLog.append(e), // HMAC-chained, tamper-evident\n});\n\nawait startHttpProxy(backend, {\n  hiddenTools: ['delete_index'],        // rejections are audited too\n  toolMiddleware: [redactPii, audit.middleware],\n});                     // audit only ever sees redacted data";

/* Variant "minimal-stdio" — kept for the build-time toggle. */
export const HERO_MINIMAL_STDIO =
  "import { createBackendClient, startProxy } from 'mcpose';\n\n// Connect to the upstream MCP server (stdio)\nconst backend = await createBackendClient({\n  command: 'node',\n  args: ['./backend-server.mjs'],\n});\n\n// Onion middleware: runs before and after\nconst logging = async (req, next) => {\n  console.error(`→ ${req.params.name}`);\n  const result = await next(req);\n  console.error(`← ${req.params.name} done`);\n  return result;\n};\n\nawait startProxy(backend, { toolMiddleware: [logging] });";

export const HERO_SNIPPET = HERO_AUDIT_HTTP;
