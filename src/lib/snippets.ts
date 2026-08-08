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

/* Landing diptych. The "with" side is the shape of examples/pii-redaction-audit.ts
   in the mcpose repo; the "without" side is the same three concerns inlined into
   a single SDK tool handler, which is where they lived before mcpose existed
   (the pattern was extracted from a financial Elasticsearch MCP server that had
   them hardcoded). It is not a strawman: it is shorter than the real thing,
   because the real thing repeats per handler. */
export const DIPTYCH_WITHOUT =
  "server.setRequestHandler(CallToolRequestSchema, async (req) => {\n  // auth, inline\n  const id = await verifyJwt(req.params._meta?.token);\n  if (!id.roles.includes('analyst')) throw new Error('denied');\n\n  const out = await runTool(req.params.name, req.params.args);\n\n  // redaction, inline\n  const text = PII.reduce(\n    (t, re) => t.replace(re, '[REDACTED]'),\n    out.text,\n  );\n\n  // \"audit\", inline\n  console.log(JSON.stringify({ tool: req.params.name }));\n\n  return { content: [{ type: 'text', text }] };\n});\n\n// Welded to this server. Nothing chains the log lines,\n// so nothing detects that one was edited or dropped.\n// Copy the whole thing for the next server.";

export const DIPTYCH_WITH =
  "// The upstream tool handler is untouched.\n\nconst backend = await createBackendClient({\n  url: UPSTREAM_URL,\n});\n\nawait startHttpProxy(\n  backend,\n  { toolMiddleware: [redactPii, audit.middleware] },\n  {\n    port: 3000,\n    resolveIdentity,\n    onSessionClosed: audit.closeSession,\n  },\n);\n\n// Ordering is the contract: redactPii is listed first,\n// so audit never sees raw PII. Point it at the next\n// server and it is the same three lines.";

/* Landing use-case tabs. Each maps to one of the three recipe docs; the code
   is the shape of the corresponding file under examples/ in the mcpose repo.
   Kept under ~66 columns so neither the tab panel nor the diptych scrolls
   horizontally at the widths the landing grid actually uses. */
export const USE_CASE_PII =
  "// recipes/pii-redaction-audit\nconst redactPii: ToolMiddleware = async (req, next) => {\n  const result = await next(req);\n  if (!hasToolContent(result)) return result;\n\n  return {\n    ...result,\n    content: result.content.map((item) =>\n      item.type === 'text'\n        ? { ...item, text: redact(item.text) }\n        : item,\n    ),\n  };\n};\n\n// redactPii is listed first, so audit only ever\n// sees text that has already been scrubbed.\nawait startHttpProxy(backend, {\n  toolMiddleware: [redactPii, audit.middleware],\n});";

export const USE_CASE_LIST_TOOLS =
  "// recipes/list-tools-rewriting\n// The tool list is a response like any other, so it\n// goes through middleware too — an analyst never\n// learns that wire_transfer exists.\nconst roleAware: ListToolsMiddleware = async (req, next, ctx) => {\n  const result = await next(req);\n  if (ctx.identity?.roles.includes('treasury')) return result;\n\n  return {\n    ...result,\n    tools: result.tools.filter((t) => t.name !== 'wire_transfer'),\n  };\n};\n\nawait startHttpProxy(backend, {\n  listToolsMiddleware: [roleAware],\n  hiddenTools: ['delete_index'], // rejections are audited\n});";

export const USE_CASE_OAUTH =
  "// recipes/oauth-upstream\n// The upstream has its own auth. mcpose holds those\n// credentials, so the LLM client never sees them and\n// never needs to.\nconst backend = await createBackendClient({\n  url: 'https://vendor.example.com/mcp',\n  authProvider,   // drives MCP OAuth, refreshes tokens\n  headers: { 'x-tenant': process.env.TENANT_ID! },\n});\n\nawait startHttpProxy(backend, {\n  toolMiddleware: [audit.middleware],\n});";
