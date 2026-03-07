var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../.wrangler/tmp/bundle-kmCIkI/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// api/internal/auth.ts
var onRequestPost = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  try {
    let email = "";
    let password = "";
    try {
      const body = await request.json();
      email = (body?.email || "").toLowerCase().trim();
      password = body?.password || "";
    } catch (e) {
      return new Response(JSON.stringify({ message: "Bad Request: Invalid Payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!env.DB) return new Response("DB binding missing", { status: 503 });
    const user = await env.DB.prepare(
      "SELECT id, name as username, role FROM users WHERE LOWER(email) = ? AND password_hash = ?"
    ).bind(email, password).first();
    if (!user) {
      return new Response(JSON.stringify({ message: "Authorization Denied: Member Not Recognized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": "dr_token=verified; Path=/; SameSite=Strict; HttpOnly"
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ message: "Sovereign Node Auth Error", details: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestPost");

// api/internal/debug_schema.ts
var onRequestGet = /* @__PURE__ */ __name(async (context) => {
  const { env } = context;
  if (!env.DB) return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 503, headers: { "Content-Type": "application/json" } });
  try {
    const { results: tables } = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const schema = {};
    for (const table of tables || []) {
      const { results: columns } = await env.DB.prepare(`PRAGMA table_info(${table.name})`).all();
      schema[table.name] = columns;
    }
    return new Response(JSON.stringify(schema, null, 2), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestGet");

// api/internal/logout.ts
var onRequestPost2 = /* @__PURE__ */ __name(async () => {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": "dr_token=; Path=/; SameSite=Strict; HttpOnly; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
  });
}, "onRequestPost");

// api/internal/read_receipts.ts
var jsonResponse = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json" }
}), "jsonResponse");
var onRequestPost3 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  if (!env.DB) return jsonResponse({ error: "DB binding missing" }, 503);
  try {
    const { userId, roomId, taskId } = await request.json();
    if (!userId || !roomId && !taskId) return jsonResponse({ error: "Missing required fields" }, 400);
    let finalRoomId = roomId;
    if (!finalRoomId && taskId) {
      if (taskId === "0") finalRoomId = "global-room";
      else {
        const room = await env.DB.prepare("SELECT id FROM chat_rooms WHERE task_id = ?").bind(taskId).first();
        finalRoomId = room?.id || null;
      }
    }
    if (!finalRoomId) return jsonResponse({ error: "Room not found" }, 404);
    try {
      await env.DB.prepare(`
          INSERT INTO message_read_receipts (id, user_id, room_id, last_read_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(user_id, room_id) DO UPDATE SET last_read_at = CURRENT_TIMESTAMP
        `).bind(crypto.randomUUID(), userId, finalRoomId).run();
    } catch (sqlErr) {
      return jsonResponse({ error: "SQL_READ_RECEIPT_FAILED", message: sqlErr.message, hint: "Ensure message_read_receipts table exists." }, 500);
    }
    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}, "onRequestPost");

// api/internal/stream.ts
var onRequestGet2 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  if (!env.DB) return new Response("DB binding missing", { status: 503 });
  try {
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const sendEvent = /* @__PURE__ */ __name((event) => {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}

`));
          } catch {
          }
        }, "sendEvent");
        sendEvent({ type: "HEARTBEAT", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
        let lastMsgTimestamp = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").split(".")[0];
        let lastSignalTimestamp = lastMsgTimestamp;
        let lastSignalId = "";
        let lastReactionTimestamp = lastMsgTimestamp;
        const pollInterval = setInterval(async () => {
          if (!env.DB) return;
          try {
            const { results: newMessages } = await env.DB.prepare(
              "SELECT m.*, u.name as sender_name, cr.task_id FROM messages m JOIN users u ON m.sender_id = u.id LEFT JOIN chat_rooms cr ON m.room_id = cr.id WHERE m.created_at > ? ORDER BY m.created_at ASC"
            ).bind(lastMsgTimestamp).all();
            for (const msg of newMessages || []) {
              sendEvent({
                type: "CHAT_MSG",
                room: msg.task_id || (msg.room_id === "global-room" ? "0" : msg.room_id),
                payload: {
                  id: msg.id,
                  room_id: msg.room_id,
                  content: msg.message_content,
                  sender: msg.sender_name,
                  timestamp: msg.created_at
                }
              });
              lastMsgTimestamp = msg.created_at;
            }
            const { results: signals } = await env.DB.prepare(
              "SELECT * FROM notifications WHERE type = 'typing' AND created_at > ? ORDER BY created_at ASC LIMIT 20"
            ).bind(lastSignalTimestamp).all();
            for (const sig of signals || []) {
              if (sig.id === lastSignalId) continue;
              sendEvent({
                type: "TYPING_STATUS",
                room: sig.reference_id === "global-room" ? "0" : sig.reference_id,
                userId: sig.user_id,
                message: sig.message
              });
              lastSignalId = sig.id;
              lastSignalTimestamp = sig.created_at;
            }
            const { results: newReactions } = await env.DB.prepare(
              "SELECT mr.*, cr.task_id, m.room_id FROM message_reactions mr JOIN messages m ON mr.message_id = m.id LEFT JOIN chat_rooms cr ON m.room_id = cr.id WHERE mr.created_at > ? ORDER BY mr.created_at ASC"
            ).bind(lastReactionTimestamp).all();
            for (const reaction of newReactions || []) {
              sendEvent({
                type: "REACTION_UPDATE",
                room: reaction.task_id || (reaction.room_id === "global-room" ? "0" : reaction.room_id),
                messageId: reaction.message_id
              });
              lastReactionTimestamp = reaction.created_at;
            }
          } catch (err) {
            console.error("SSE Poll Error:", err);
          }
        }, 3e3);
        const heartbeat = setInterval(() => {
          sendEvent({ type: "HEARTBEAT", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
        }, 3e4);
        request.signal.addEventListener("abort", () => {
          clearInterval(pollInterval);
          clearInterval(heartbeat);
          try {
            controller.close();
          } catch {
          }
        });
      }
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}, "onRequestGet");

// api/internal/typing.ts
var onRequestPost4 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  if (!env.DB) return new Response("DB binding missing", { status: 503 });
  try {
    const body = await request.json();
    const { roomId, userId, username, isTyping } = body;
    if (!userId || !roomId) return new Response("Missing required fields", { status: 400 });
    await env.DB.prepare(
      "INSERT INTO notifications (id, user_id, type, reference_id, message) VALUES (?, ?, ?, ?, ?)"
    ).bind(crypto.randomUUID(), userId, "typing", roomId, isTyping ? `${username} is typing...` : "STOP").run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestPost");

// api/internal/users.ts
var onRequestGet3 = /* @__PURE__ */ __name(async (context) => {
  const { env } = context;
  try {
    if (!env.DB) return new Response("DB binding missing", { status: 503 });
    const { results } = await env.DB.prepare(
      "SELECT id, name as username, email, role FROM users ORDER BY name ASC"
    ).all();
    return new Response(JSON.stringify(results || []), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "GET_USERS_FAILED", message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestGet");

// api/internal/analytics.ts
var jsonResponse2 = /* @__PURE__ */ __name((data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}, "jsonResponse");
var onRequest = /* @__PURE__ */ __name(async (context) => {
  const { env } = context;
  if (!env.DB) return jsonResponse2({ error: "DB binding missing" }, 503);
  try {
    const now = /* @__PURE__ */ new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);
    const incomeRes = await env.DB.prepare(
      "SELECT SUM(amount) as total FROM crm_invoices WHERE status = 'payment_received' AND strftime('%Y-%m', created_at) = ?"
    ).bind(currentMonth).first();
    const prevIncomeRes = await env.DB.prepare(
      "SELECT SUM(amount) as total FROM crm_invoices WHERE status = 'payment_received' AND strftime('%Y-%m', created_at) = ?"
    ).bind(lastMonth).first();
    const ordersRes = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM crm_invoices WHERE strftime('%Y-%m', created_at) = ?"
    ).bind(currentMonth).first();
    const prevOrdersRes = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM crm_invoices WHERE strftime('%Y-%m', created_at) = ?"
    ).bind(lastMonth).first();
    const avgRes = await env.DB.prepare(
      "SELECT AVG(amount) as avg FROM crm_invoices WHERE strftime('%Y-%m', created_at) = ?"
    ).bind(currentMonth).first();
    const { results: annualSales } = await env.DB.prepare(`
      SELECT strftime('%m', created_at) as month, SUM(amount) as total
      FROM crm_invoices
      WHERE status = 'payment_received' AND strftime('%Y', created_at) = strftime('%Y', 'now')
      GROUP BY month
      ORDER BY month ASC
    `).all();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const balanceData = months.map((m, i) => {
      const sales = annualSales.find((s) => parseInt(s.month) === i + 1);
      const net = sales?.total || 0;
      const gross = net * 1.2;
      return { name: m, gross, net };
    });
    const regions = [
      { name: "US", value: 38.6 },
      { name: "Canada", value: 22.5 },
      { name: "Mexico", value: 30.8 },
      { name: "Other", value: 8.1 }
    ];
    const { results: topProducts } = await env.DB.prepare(`
        SELECT description as name, SUM(amount) as value
        FROM crm_invoices
        WHERE status = 'payment_received'
        GROUP BY description
        ORDER BY value DESC
        LIMIT 4
    `).all();
    const curIncome = incomeRes?.total || 0;
    const preIncome = prevIncomeRes?.total || 0;
    const curOrders = ordersRes?.count || 0;
    const preOrders = prevOrdersRes?.count || 0;
    return jsonResponse2({
      kpis: {
        netIncome: { value: curIncome, trend: preIncome ? ((curIncome - preIncome) / preIncome * 100).toFixed(1) : "+10" },
        orders: { value: curOrders, trend: preOrders ? ((curOrders - preOrders) / preOrders * 100).toFixed(1) : "+19" },
        avgContract: { value: Math.round(avgRes?.avg || 0), trend: "+70" },
        growthRate: { value: "36.8%", trend: "-20" }
      },
      balanceData,
      totalSales: balanceData.map((d) => ({ name: d.name, value: d.net })),
      regions,
      topProducts: topProducts.length ? topProducts : [
        { name: "Visa analysis", value: 244 },
        { name: "Enterprise Suite", value: 326 },
        { name: "CRM Platform", value: 408 },
        { name: "B2B Market enterprise", value: 408 }
      ]
    });
  } catch (err) {
    return jsonResponse2({ error: err.message }, 500);
  }
}, "onRequest");

// api/internal/chat.ts
var jsonResponse3 = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json" }
}), "jsonResponse");
var onRequest2 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  if (!env.DB) return jsonResponse3({ error: "DB binding missing" }, 503);
  try {
    if (request.method === "GET") {
      const taskId = url.searchParams.get("taskId");
      const roomId = url.searchParams.get("roomId");
      const userId = url.searchParams.get("userId");
      let finalRoomId = roomId;
      if (!finalRoomId && taskId) {
        if (taskId === "0") finalRoomId = "global-room";
        else {
          const room = await env.DB.prepare("SELECT id FROM chat_rooms WHERE task_id = ?").bind(taskId).first();
          finalRoomId = room?.id || null;
        }
      }
      if (!finalRoomId) return jsonResponse3({ messages: [], lastReadAt: null });
      const { results } = await env.DB.prepare(`
        SELECT m.*, m.message_content as content, m.created_at as timestamp, u.name as sender_name,
        (SELECT JSON_GROUP_ARRAY(JSON_OBJECT('id', ma.id, 'name', ma.file_name, 'type', ma.file_type, 'url', ma.file_url)) FROM message_attachments ma WHERE ma.message_id = m.id) as attachments,
        (SELECT JSON_GROUP_ARRAY(JSON_OBJECT('emoji', mr.emoji, 'count', (SELECT COUNT(*) FROM message_reactions mr2 WHERE mr2.message_id = m.id AND mr2.emoji = mr.emoji), 'me', (SELECT COUNT(*) FROM message_reactions mr3 WHERE mr3.message_id = m.id AND mr3.emoji = mr.emoji AND mr3.user_id = ?))) FROM (SELECT DISTINCT emoji FROM message_reactions WHERE message_id = m.id) mr) as reactions
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.room_id = ?
        ORDER BY m.created_at ASC
      `).bind(userId || "", finalRoomId).all();
      const lastRead = await env.DB.prepare("SELECT last_read_at FROM message_read_receipts WHERE user_id = ? AND room_id = ?").bind(userId || "", finalRoomId).first();
      const processedResults = (results || []).map((r) => ({
        ...r,
        attachments: JSON.parse(r.attachments || "[]"),
        reactions: JSON.parse(r.reactions || "[]"),
        is_edited: !!r.edited
      }));
      return jsonResponse3({ messages: processedResults, lastReadAt: lastRead?.last_read_at || null });
    }
    if (request.method === "POST") {
      const body = await request.json();
      const messageId = crypto.randomUUID();
      let finalRoomId = body.roomId;
      if (!finalRoomId && body.taskId !== void 0) {
        if (body.taskId === 0 || body.taskId === "0") finalRoomId = "global-room";
        else {
          const room = await env.DB.prepare("SELECT id FROM chat_rooms WHERE task_id = ?").bind(body.taskId).first();
          finalRoomId = room?.id;
        }
      }
      if (!finalRoomId) return jsonResponse3({ error: "Target room not found" }, 404);
      try {
        await env.DB.prepare(
          "INSERT INTO messages (id, room_id, sender_id, message_content, parent_message_id, message_type) VALUES (?, ?, ?, ?, ?, ?)"
        ).bind(
          messageId,
          finalRoomId,
          body.senderId,
          body.content || "",
          body.parentMessageId || null,
          body.messageType || "text"
        ).run();
      } catch (sqlErr) {
        return jsonResponse3({ error: "SQL_INSERT_FAILED", message: sqlErr.message, detail: "Check if parent_message_id, message_type, and edited columns exist." }, 500);
      }
      if (body.attachments && Array.isArray(body.attachments)) {
        for (const att of body.attachments) {
          await env.DB.prepare(
            "INSERT INTO message_attachments (id, message_id, file_name, file_type, file_size, file_url) VALUES (?, ?, ?, ?, ?, ?)"
          ).bind(crypto.randomUUID(), messageId, att.name, att.type, att.size || 0, att.url).run();
        }
      }
      return jsonResponse3({ id: messageId, success: true }, 201);
    }
    if (request.method === "PATCH") {
      const id = url.searchParams.get("id");
      if (!id) return jsonResponse3({ error: "Missing message ID" }, 400);
      const body = await request.json();
      const userId = body.userId;
      if (!userId) return jsonResponse3({ error: "Missing userId for authorization" }, 400);
      const message = await env.DB.prepare("SELECT sender_id, message_content FROM messages WHERE id = ?").bind(id).first();
      if (!message) return jsonResponse3({ error: "Message not found" }, 404);
      if (message.sender_id !== userId) return jsonResponse3({ error: "Unauthorized edit" }, 403);
      try {
        await env.DB.prepare("INSERT INTO message_edits (id, message_id, old_content) VALUES (?, ?, ?)").bind(crypto.randomUUID(), id, message.message_content).run();
        await env.DB.prepare("UPDATE messages SET message_content = ?, edited = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(body.content, id).run();
      } catch (sqlErr) {
        return jsonResponse3({ error: "SQL_UPDATE_FAILED", message: sqlErr.message }, 500);
      }
      return jsonResponse3({ success: true });
    }
    if (request.method === "DELETE") {
      const id = url.searchParams.get("id");
      const userId = url.searchParams.get("userId");
      if (!id) return jsonResponse3({ error: "Missing message ID" }, 400);
      if (!userId) return jsonResponse3({ error: "Missing userId for authorization" }, 400);
      const message = await env.DB.prepare("SELECT sender_id FROM messages WHERE id = ?").bind(id).first();
      if (!message) return jsonResponse3({ error: "Message not found" }, 404);
      if (message.sender_id !== userId) return jsonResponse3({ error: "Unauthorized delete" }, 403);
      await env.DB.prepare("DELETE FROM messages WHERE id = ?").bind(id).run();
      return jsonResponse3({ success: true });
    }
    return jsonResponse3({ error: "Method Not Allowed" }, 405);
  } catch (err) {
    return jsonResponse3({ error: err.message, stack: err.stack }, 500);
  }
}, "onRequest");

// api/internal/crm_appointments.ts
var onRequest3 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  if (!env.DB) return new Response("DB binding missing", { status: 503 });
  if (request.method === "GET") {
    const customerId = url.searchParams.get("customerId");
    try {
      let query = "SELECT * FROM crm_appointments";
      let results;
      if (customerId) {
        query += " WHERE customer_id = ? ORDER BY appointment_date ASC, appointment_time ASC";
        const { results: dbResults } = await env.DB.prepare(query).bind(customerId).all();
        results = dbResults;
      } else {
        query += " ORDER BY appointment_date ASC, appointment_time ASC";
        const { results: dbResults } = await env.DB.prepare(query).all();
        results = dbResults;
      }
      return new Response(JSON.stringify(results || []), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
  if (request.method === "POST") {
    try {
      const body = await request.json();
      const id = crypto.randomUUID();
      await env.DB.prepare(
        "INSERT INTO crm_appointments (id, customer_id, customer_name, email, phone, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(
        id,
        body.customer_id,
        body.customer_name,
        body.email || null,
        body.phone || null,
        body.appointment_date,
        body.appointment_time,
        body.status || "scheduled"
      ).run();
      return new Response(JSON.stringify({ id, success: true }), { status: 201 });
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
  if (request.method === "PATCH") {
    try {
      const id = url.searchParams.get("id");
      const body = await request.json();
      const updates = [];
      const values = [];
      for (const [key, value] of Object.entries(body)) {
        if (["customer_name", "email", "phone", "appointment_date", "appointment_time", "status"].includes(key)) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }
      if (updates.length > 0) {
        updates.push("updated_at = CURRENT_TIMESTAMP");
        await env.DB.prepare(`UPDATE crm_appointments SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run();
      }
      return new Response(JSON.stringify({ success: true }));
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
  if (request.method === "DELETE") {
    const id = url.searchParams.get("id");
    try {
      await env.DB.prepare("DELETE FROM crm_appointments WHERE id = ?").bind(id).run();
      return new Response(JSON.stringify({ success: true }));
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
  return new Response("Method Not Allowed", { status: 405 });
}, "onRequest");

// api/internal/crm_customers.ts
var onRequest4 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  if (!env.DB) return new Response("DB binding missing", { status: 503 });
  if (request.method === "GET") {
    const id = url.searchParams.get("id");
    try {
      if (id) {
        const customer = await env.DB.prepare("SELECT * FROM crm_customers WHERE id = ?").bind(id).first();
        return new Response(JSON.stringify(customer), { headers: { "Content-Type": "application/json" } });
      }
      const { results } = await env.DB.prepare("SELECT * FROM crm_customers ORDER BY created_at DESC").all();
      return new Response(JSON.stringify(results || []), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
  if (request.method === "POST") {
    try {
      const body = await request.json();
      const id = crypto.randomUUID();
      await env.DB.prepare(
        "INSERT INTO crm_customers (id, name, phone, email, address, notes, sales_stage) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind(
        id,
        body.name,
        body.phone || null,
        body.email || null,
        body.address || null,
        body.notes || null,
        body.sales_stage || "Discovery"
      ).run();
      return new Response(JSON.stringify({ id, success: true }), { status: 201 });
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
  if (request.method === "PATCH") {
    try {
      const id = url.searchParams.get("id");
      const body = await request.json();
      const updates = [];
      const values = [];
      for (const [key, value] of Object.entries(body)) {
        if (["name", "phone", "email", "address", "notes", "sales_stage"].includes(key)) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }
      if (updates.length > 0) {
        updates.push("updated_at = CURRENT_TIMESTAMP");
        await env.DB.prepare(`UPDATE crm_customers SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run();
      }
      return new Response(JSON.stringify({ success: true }));
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
  if (request.method === "DELETE") {
    const id = url.searchParams.get("id");
    try {
      await env.DB.prepare("DELETE FROM crm_customers WHERE id = ?").bind(id).run();
      return new Response(JSON.stringify({ success: true }));
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
  return new Response("Method Not Allowed", { status: 405 });
}, "onRequest");

// api/internal/crm_invoices.ts
var onRequest5 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  if (!env.DB) return new Response("DB binding missing", { status: 503 });
  if (request.method === "GET") {
    const customerId = url.searchParams.get("customerId");
    try {
      let query = "SELECT i.*, c.name as customer_name FROM crm_invoices i JOIN crm_customers c ON i.customer_id = c.id";
      let results;
      if (customerId) {
        query += " WHERE i.customer_id = ? ORDER BY i.created_at DESC";
        const { results: dbResults } = await env.DB.prepare(query).bind(customerId).all();
        results = dbResults;
      } else {
        query += " ORDER BY i.created_at DESC";
        const { results: dbResults } = await env.DB.prepare(query).all();
        results = dbResults;
      }
      return new Response(JSON.stringify(results || []), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
  if (request.method === "POST") {
    try {
      const body = await request.json();
      const id = crypto.randomUUID();
      await env.DB.prepare(
        "INSERT INTO crm_invoices (id, customer_id, amount, description, status) VALUES (?, ?, ?, ?, ?)"
      ).bind(
        id,
        body.customer_id,
        body.amount,
        body.description || null,
        body.status || "invoice_created"
      ).run();
      return new Response(JSON.stringify({ id, success: true }), { status: 201 });
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
  if (request.method === "PATCH") {
    try {
      const id = url.searchParams.get("id");
      const body = await request.json();
      const updates = [];
      const values = [];
      for (const [key, value] of Object.entries(body)) {
        if (["amount", "description", "status"].includes(key)) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }
      if (updates.length > 0) {
        updates.push("updated_at = CURRENT_TIMESTAMP");
        await env.DB.prepare(`UPDATE crm_invoices SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run();
      }
      return new Response(JSON.stringify({ success: true }));
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
  if (request.method === "DELETE") {
    const id = url.searchParams.get("id");
    try {
      await env.DB.prepare("DELETE FROM crm_invoices WHERE id = ?").bind(id).run();
      return new Response(JSON.stringify({ success: true }));
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
  return new Response("Method Not Allowed", { status: 405 });
}, "onRequest");

// api/internal/message_history.ts
var onRequest6 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const messageId = url.searchParams.get("messageId");
  const userId = url.searchParams.get("userId");
  if (!env.DB) return new Response("DB binding missing", { status: 503 });
  if (!messageId || !userId) return new Response("Missing messageId or userId", { status: 400 });
  try {
    const userRes = await env.DB.prepare("SELECT role FROM users WHERE id = ?").bind(userId).first();
    const msgRes = await env.DB.prepare("SELECT m.*, r.task_id FROM messages m JOIN chat_rooms r ON m.room_id = r.id WHERE m.id = ?").bind(messageId).first();
    if (!userRes || !msgRes) return new Response("Resource not found", { status: 404 });
    let taskCreatorId = null;
    if (msgRes.task_id) {
      const taskRes = await env.DB.prepare("SELECT created_by FROM tasks WHERE id = ?").bind(msgRes.task_id).first();
      taskCreatorId = taskRes?.created_by;
    }
    const isAuthorized = ["admin", "superuser"].includes(userRes.role) || userId === msgRes.sender_id || userId === taskCreatorId;
    if (!isAuthorized) return new Response("Unauthorized access", { status: 403 });
    const { results: history } = await env.DB.prepare(
      "SELECT * FROM message_edits WHERE message_id = ? ORDER BY edited_at ASC"
    ).bind(messageId).all();
    return new Response(JSON.stringify({
      current_content: msgRes.message_content,
      created_at: msgRes.created_at,
      edits: history
    }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}, "onRequest");

// api/internal/presence.ts
var onRequest7 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  if (!env.DB) return new Response("DB binding missing", { status: 503 });
  if (request.method === "POST") {
    try {
      const { userId } = await request.json();
      if (userId) {
        await env.DB.prepare("UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(userId).run();
      }
      return new Response(JSON.stringify({ success: true }));
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
  return new Response("Method Not Allowed", { status: 405 });
}, "onRequest");

// api/internal/reactions.ts
var jsonResponse4 = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json" }
}), "jsonResponse");
var onRequest8 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  if (!env.DB) return jsonResponse4({ error: "DB binding missing" }, 503);
  try {
    if (request.method === "POST") {
      const { messageId, userId, emoji } = await request.json();
      if (!messageId || !userId || !emoji) return jsonResponse4({ error: "Missing required fields" }, 400);
      const existing = await env.DB.prepare(
        "SELECT id, emoji FROM message_reactions WHERE message_id = ? AND user_id = ?"
      ).bind(messageId, userId).first();
      try {
        if (existing) {
          await env.DB.prepare(
            "DELETE FROM message_reactions WHERE message_id = ? AND user_id = ?"
          ).bind(messageId, userId).run();
          if (existing.emoji !== emoji) {
            await env.DB.prepare(
              "INSERT INTO message_reactions (id, message_id, user_id, emoji) VALUES (?, ?, ?, ?)"
            ).bind(crypto.randomUUID(), messageId, userId, emoji).run();
          }
        } else {
          await env.DB.prepare(
            "INSERT INTO message_reactions (id, message_id, user_id, emoji) VALUES (?, ?, ?, ?)"
          ).bind(crypto.randomUUID(), messageId, userId, emoji).run();
        }
      } catch (sqlErr) {
        return jsonResponse4({ error: "SQL_REACTION_FAILED", message: sqlErr.message }, 500);
      }
      return jsonResponse4({ success: true });
    }
    if (request.method === "GET") {
      const userId = url.searchParams.get("userId");
      if (!userId) return jsonResponse4({ error: "Missing userId" }, 400);
      const { results } = await env.DB.prepare("SELECT emoji FROM user_favorite_emojis WHERE user_id = ?").bind(userId).all();
      return jsonResponse4(results.map((r) => r.emoji));
    }
    if (request.method === "PUT" || request.method === "PATCH") {
      const { userId, emoji } = await request.json();
      if (!userId || !emoji) return jsonResponse4({ error: "Missing required fields" }, 400);
      try {
        const exists = await env.DB.prepare("SELECT id FROM user_favorite_emojis WHERE user_id = ? AND emoji = ?").bind(userId, emoji).first();
        if (!exists) {
          await env.DB.prepare("INSERT INTO user_favorite_emojis (id, user_id, emoji) VALUES (?, ?, ?)").bind(crypto.randomUUID(), userId, emoji).run();
        }
      } catch (sqlErr) {
        return jsonResponse4({ error: "SQL_FAVORITE_FAILED", message: sqlErr.message }, 500);
      }
      return jsonResponse4({ success: true });
    }
    return jsonResponse4({ error: "Method Not Allowed" }, 405);
  } catch (err) {
    return jsonResponse4({ error: err.message }, 500);
  }
}, "onRequest");

// api/internal/room_members.ts
var onRequest9 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  if (!env.DB) return new Response("DB binding missing", { status: 503 });
  if (request.method === "GET") {
    const roomId = url.searchParams.get("roomId");
    if (!roomId) return new Response("Missing roomId", { status: 400 });
    try {
      const { results } = await env.DB.prepare(`
        SELECT u.id, u.name, u.role, rm.joined_at
        FROM users u
        JOIN chat_room_members rm ON u.id = rm.user_id
        WHERE rm.room_id = ?
        ORDER BY u.name ASC
      `).bind(roomId).all();
      return new Response(JSON.stringify(results || []), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
  if (request.method === "POST") {
    try {
      const { roomId, userId } = await request.json();
      await env.DB.prepare(
        "INSERT OR IGNORE INTO chat_room_members (id, room_id, user_id) VALUES (?, ?, ?)"
      ).bind(crypto.randomUUID(), roomId, userId).run();
      return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
  if (request.method === "DELETE") {
    const roomId = url.searchParams.get("roomId");
    const userId = url.searchParams.get("userId");
    if (!roomId || !userId) return new Response("Missing params", { status: 400 });
    try {
      await env.DB.prepare(
        "DELETE FROM chat_room_members WHERE room_id = ? AND user_id = ?"
      ).bind(roomId, userId).run();
      return new Response(JSON.stringify({ success: true }));
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
  return new Response("Method Not Allowed", { status: 405 });
}, "onRequest");

// api/internal/tasks.ts
var onRequest10 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  if (!env.DB) return new Response("DB binding missing", { status: 503 });
  if (request.method === "GET") {
    try {
      const { results } = await env.DB.prepare(`
        SELECT t.*, u.name as assigned_name, creator.name as creator_name,
        (SELECT JSON_GROUP_ARRAY(JSON_OBJECT('id', user_id, 'name', name))
         FROM task_assignees ta
         JOIN users u2 ON ta.user_id = u2.id
         WHERE ta.task_id = t.id) as assignees,
        EXISTS (
            SELECT 1 FROM messages m
            JOIN chat_rooms cr ON m.room_id = cr.id
            LEFT JOIN message_read_receipts rr ON rr.room_id = cr.id AND rr.user_id = ?
            WHERE cr.task_id = t.id AND (rr.last_read_at IS NULL OR m.created_at > rr.last_read_at)
        ) as hasUnread
        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id
        LEFT JOIN users creator ON t.created_by = creator.id
        ORDER BY t.created_at DESC
      `).bind(userId || "").all();
      const processedResults = (results || []).map((r) => ({
        ...r,
        assignees: JSON.parse(r.assignees || "[]"),
        hasUnread: !!r.hasUnread
      }));
      return new Response(JSON.stringify(processedResults), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "GET_TASKS_FAILED", message: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  }
  if (request.method === "POST") {
    try {
      const body = await request.json();
      const taskId = crypto.randomUUID();
      const lastTask = await env.DB.prepare("SELECT task_number FROM tasks ORDER BY created_at DESC LIMIT 1").first();
      let nextNum = 101;
      if (lastTask && lastTask.task_number.startsWith("TASK-")) {
        nextNum = parseInt(lastTask.task_number.replace("TASK-", "")) + 1;
      }
      const taskNumber = `TASK-${nextNum}`;
      await env.DB.prepare(
        "INSERT INTO tasks (id, task_number, title, description, assigned_to, due_date, priority, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(
        taskId,
        taskNumber,
        body.title || "Untitled Directive",
        body.description || null,
        body.assignees && body.assignees[0] ? body.assignees[0] : null,
        body.due_date || null,
        body.priority || "Medium",
        body.status || "todo",
        body.created_by
      ).run();
      if (body.assignees && Array.isArray(body.assignees)) {
        for (const userId2 of body.assignees) {
          await env.DB.prepare(
            "INSERT OR IGNORE INTO task_assignees (id, task_id, user_id) VALUES (?, ?, ?)"
          ).bind(crypto.randomUUID(), taskId, userId2).run();
        }
      }
      await env.DB.prepare(
        "INSERT INTO chat_rooms (id, type, task_id) VALUES (?, ?, ?)"
      ).bind(crypto.randomUUID(), "task", taskId).run();
      return new Response(JSON.stringify({ id: taskId, success: true }), { status: 201 });
    } catch (err) {
      return new Response(JSON.stringify({ error: "POST_TASK_FAILED", message: err.message }), { status: 500 });
    }
  }
  if (request.method === "PATCH") {
    try {
      const id = url.searchParams.get("id");
      if (!id) return new Response(JSON.stringify({ error: "Missing directive ID" }), { status: 400 });
      const body = await request.json();
      const updates = [];
      const values = [];
      if (body.status !== void 0) {
        updates.push("status = ?");
        values.push(body.status);
      }
      if (body.priority !== void 0) {
        updates.push("priority = ?");
        values.push(body.priority);
      }
      if (body.title !== void 0) {
        updates.push("title = ?");
        values.push(body.title);
      }
      if (body.description !== void 0) {
        updates.push("description = ?");
        values.push(body.description);
      }
      if (body.due_date !== void 0) {
        updates.push("due_date = ?");
        values.push(body.due_date);
      }
      if (updates.length > 0) {
        updates.push("updated_at = CURRENT_TIMESTAMP");
        const query = `UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`;
        await env.DB.prepare(query).bind(...values, id).run();
      }
      if (body.assignees !== void 0 && Array.isArray(body.assignees)) {
        await env.DB.prepare("DELETE FROM task_assignees WHERE task_id = ?").bind(id).run();
        for (const userId2 of body.assignees) {
          await env.DB.prepare(
            "INSERT INTO task_assignees (id, task_id, user_id) VALUES (?, ?, ?)"
          ).bind(crypto.randomUUID(), id, userId2).run();
        }
        if (body.assignees.length > 0) {
          await env.DB.prepare("UPDATE tasks SET assigned_to = ? WHERE id = ?").bind(body.assignees[0], id).run();
        } else {
          await env.DB.prepare("UPDATE tasks SET assigned_to = NULL WHERE id = ?").bind(id).run();
        }
      }
      return new Response(JSON.stringify({ success: true }));
    } catch (err) {
      return new Response(JSON.stringify({ error: "PATCH_TASK_FAILED", message: err.message }), { status: 500 });
    }
  }
  if (request.method === "DELETE") {
    try {
      const id = url.searchParams.get("id");
      if (!id) return new Response(JSON.stringify({ error: "Missing directive ID" }), { status: 400 });
      await env.DB.prepare("DELETE FROM tasks WHERE id = ?").bind(id).run();
      return new Response(JSON.stringify({ success: true }));
    } catch (err) {
      return new Response(JSON.stringify({ error: "DELETE_TASK_FAILED", message: err.message }), { status: 500 });
    }
  }
  return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 });
}, "onRequest");

// api/contact.ts
function escapeHtml(value) {
  if (typeof value !== "string") return String(value || "");
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
__name(escapeHtml, "escapeHtml");
function ContactEmailTemplate(data) {
  const typeLabel = data.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : "General Inquiry";
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0a0d36; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">New Contact Request</h1>
      </div>
      <div style="padding: 30px;">
        <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
          <p style="margin: 0 0 10px; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Request Details</p>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 5px 0; font-weight: bold; width: 100px;">Type:</td>
              <td style="padding: 5px 0;">${escapeHtml(typeLabel)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Name:</td>
              <td style="padding: 5px 0;">${escapeHtml(data.name)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold;">Email:</td>
              <td style="padding: 5px 0;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
            </tr>
          </table>
        </div>
        <div>
          <p style="margin: 0 0 10px; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Message</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
        </div>
      </div>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #999;">
        Sent via the Dynamic Rankers website
      </div>
    </div>
  `;
}
__name(ContactEmailTemplate, "ContactEmailTemplate");
var onRequestPost5 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  try {
    const resendApiKey = env.RESEND_API_KEY;
    const resendFromEmail = env.RESEND_FROM_EMAIL || env.CONTACT_FROM_EMAIL;
    const resendTargetEmail = env.RESEND_TARGET_EMAIL || env.CONTACT_TO_EMAIL;
    if (!resendApiKey || !resendFromEmail || !resendTargetEmail) {
      console.error("Missing Resend configuration.");
      return new Response(JSON.stringify({
        error: "Email service is not configured"
      }), { status: 500 });
    }
    const data = await request.json();
    if (!data.email || !data.name || !data.message) {
      return new Response(JSON.stringify({
        error: "Name, email, and message are required"
      }), { status: 400 });
    }
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [resendTargetEmail],
        subject: `[${data.type || "General"}] Website Contact: ${data.name}`,
        html: ContactEmailTemplate(data),
        replyTo: data.email
      })
    });
    const result = await resendResponse.json();
    if (!resendResponse.ok) {
      return new Response(JSON.stringify({ error: result.message || "Failed to send email" }), { status: resendResponse.status });
    }
    return new Response(JSON.stringify({
      success: true,
      id: result.id
    }), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Contact API error:", message);
    return new Response(JSON.stringify({
      error: "Failed to process contact request",
      details: message
    }), { status: 500 });
  }
}, "onRequestPost");

// api/onboarding.ts
function escapeHtml2(value) {
  if (typeof value !== "string") return String(value || "");
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
__name(escapeHtml2, "escapeHtml");
function OnboardingEmailTemplate(data) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #4f46e5; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Onboarding Submission</h1>
      </div>

      <div style="padding: 32px; background-color: #ffffff;">

        <!-- Section: Appointment -->
        <div style="margin-bottom: 32px; padding: 16px; background-color: #f5f3ff; border-left: 4px solid #7c3aed; border-radius: 4px;">
          <h2 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #6d28d9;">Confirmed Appointment</h2>
          <p style="margin: 8px 0 0; font-size: 18px; font-weight: bold; color: #1e1b4b;">
            ${escapeHtml2(data.appointmentType || "ERIC WILLIAM | 30-Minute Strategy")}
          </p>
          <p style="margin: 4px 0 0; font-size: 12px; color: #5b21b6;">Booked via Google Calendar Appointment Scheduling</p>
        </div>

        <!-- Section: Client Info -->
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; color: #374151;">Client Information</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 40%;">Organization</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml2(data.orgName)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Industry</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml2(data.industry)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Location</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml2(data.location)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Contact Person</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml2(data.role)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Email</td>
              <td style="padding: 8px 0; font-weight: 500;"><a href="mailto:${escapeHtml2(data.email)}" style="color: #4f46e5; text-decoration: none;">${escapeHtml2(data.email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Phone / WhatsApp</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml2(data.phone)}</td>
            </tr>
          </table>
        </div>

        <!-- Section: Strategic Intent -->
        <div style="margin-bottom: 8px;">
          <h2 style="font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; color: #374151;">Strategic Intent</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 40%;">Primary Objective</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml2(data.primaryIntent)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Refinement</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml2(data.refinement)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Preferred Channel</td>
              <td style="padding: 8px 0; font-weight: 500;">${escapeHtml2(data.communicationChannel)}</td>
            </tr>
          </table>
        </div>

      </div>

      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
          This is an automated notification from the Dynamic Rankers Onboarding Engine.
        </p>
      </div>
    </div>
  `;
}
__name(OnboardingEmailTemplate, "OnboardingEmailTemplate");
var onRequestPost6 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  try {
    const resendApiKey = env.RESEND_API_KEY;
    const resendFromEmail = env.RESEND_FROM_EMAIL || env.CONTACT_FROM_EMAIL;
    const resendTargetEmail = env.RESEND_TARGET_EMAIL || env.CONTACT_TO_EMAIL;
    if (!resendApiKey || !resendFromEmail || !resendTargetEmail) {
      console.error("Missing Resend configuration.");
      return new Response(JSON.stringify({
        error: "Email service is not configured"
      }), { status: 500 });
    }
    const data = await request.json();
    if (!data.email || !data.orgName) {
      return new Response(JSON.stringify({
        error: "Email and Organization Name are required"
      }), { status: 400 });
    }
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [resendTargetEmail],
        subject: `Onboarding & Strategy Call: ${data.orgName}`,
        html: OnboardingEmailTemplate(data)
      })
    });
    const result = await resendResponse.json();
    if (!resendResponse.ok) {
      return new Response(JSON.stringify({ error: result.message || "Failed to send email" }), { status: resendResponse.status });
    }
    return new Response(JSON.stringify({
      success: true,
      id: result.id
    }), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Onboarding API error:", message);
    return new Response(JSON.stringify({
      error: "Failed to process onboarding data",
      details: message
    }), { status: 500 });
  }
}, "onRequestPost");

// _middleware.ts
var onRequest11 = /* @__PURE__ */ __name(async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);
  const response = await next();
  if (url.pathname.startsWith("/internal/") || url.pathname.startsWith("/api/internal/")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}, "onRequest");

// ../.wrangler/tmp/pages-gnFsC5/functionsRoutes-0.6966859725990551.mjs
var routes = [
  {
    routePath: "/api/internal/auth",
    mountPath: "/api/internal",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/internal/debug_schema",
    mountPath: "/api/internal",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/internal/logout",
    mountPath: "/api/internal",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/internal/read_receipts",
    mountPath: "/api/internal",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/internal/stream",
    mountPath: "/api/internal",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/internal/typing",
    mountPath: "/api/internal",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/internal/users",
    mountPath: "/api/internal",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/internal/analytics",
    mountPath: "/api/internal",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/api/internal/chat",
    mountPath: "/api/internal",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  },
  {
    routePath: "/api/internal/crm_appointments",
    mountPath: "/api/internal",
    method: "",
    middlewares: [],
    modules: [onRequest3]
  },
  {
    routePath: "/api/internal/crm_customers",
    mountPath: "/api/internal",
    method: "",
    middlewares: [],
    modules: [onRequest4]
  },
  {
    routePath: "/api/internal/crm_invoices",
    mountPath: "/api/internal",
    method: "",
    middlewares: [],
    modules: [onRequest5]
  },
  {
    routePath: "/api/internal/message_history",
    mountPath: "/api/internal",
    method: "",
    middlewares: [],
    modules: [onRequest6]
  },
  {
    routePath: "/api/internal/presence",
    mountPath: "/api/internal",
    method: "",
    middlewares: [],
    modules: [onRequest7]
  },
  {
    routePath: "/api/internal/reactions",
    mountPath: "/api/internal",
    method: "",
    middlewares: [],
    modules: [onRequest8]
  },
  {
    routePath: "/api/internal/room_members",
    mountPath: "/api/internal",
    method: "",
    middlewares: [],
    modules: [onRequest9]
  },
  {
    routePath: "/api/internal/tasks",
    mountPath: "/api/internal",
    method: "",
    middlewares: [],
    modules: [onRequest10]
  },
  {
    routePath: "/api/contact",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/api/onboarding",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost6]
  },
  {
    routePath: "/",
    mountPath: "/",
    method: "",
    middlewares: [onRequest11],
    modules: []
  }
];

// ../../home/jules/.npm/_npx/32026684e21afda6/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../home/jules/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../../home/jules/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../home/jules/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-kmCIkI/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../../home/jules/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-kmCIkI/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.9385919176303297.mjs.map
