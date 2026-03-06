import { onRequestPost as __api_internal_auth_ts_onRequestPost } from "/app/functions/api/internal/auth.ts"
import { onRequestGet as __api_internal_stream_ts_onRequestGet } from "/app/functions/api/internal/stream.ts"
import { onRequestPost as __api_internal_typing_ts_onRequestPost } from "/app/functions/api/internal/typing.ts"
import { onRequestGet as __api_internal_users_ts_onRequestGet } from "/app/functions/api/internal/users.ts"
import { onRequest as __api_internal_chat_ts_onRequest } from "/app/functions/api/internal/chat.ts"
import { onRequest as __api_internal_crm_appointments_ts_onRequest } from "/app/functions/api/internal/crm_appointments.ts"
import { onRequest as __api_internal_crm_customers_ts_onRequest } from "/app/functions/api/internal/crm_customers.ts"
import { onRequest as __api_internal_crm_invoices_ts_onRequest } from "/app/functions/api/internal/crm_invoices.ts"
import { onRequest as __api_internal_presence_ts_onRequest } from "/app/functions/api/internal/presence.ts"
import { onRequest as __api_internal_read_receipts_ts_onRequest } from "/app/functions/api/internal/read_receipts.ts"
import { onRequest as __api_internal_tasks_ts_onRequest } from "/app/functions/api/internal/tasks.ts"
import { onRequestPost as __api_contact_ts_onRequestPost } from "/app/functions/api/contact.ts"
import { onRequestPost as __api_onboarding_ts_onRequestPost } from "/app/functions/api/onboarding.ts"
import { onRequest as ___middleware_ts_onRequest } from "/app/functions/_middleware.ts"

export const routes = [
    {
      routePath: "/api/internal/auth",
      mountPath: "/api/internal",
      method: "POST",
      middlewares: [],
      modules: [__api_internal_auth_ts_onRequestPost],
    },
  {
      routePath: "/api/internal/stream",
      mountPath: "/api/internal",
      method: "GET",
      middlewares: [],
      modules: [__api_internal_stream_ts_onRequestGet],
    },
  {
      routePath: "/api/internal/typing",
      mountPath: "/api/internal",
      method: "POST",
      middlewares: [],
      modules: [__api_internal_typing_ts_onRequestPost],
    },
  {
      routePath: "/api/internal/users",
      mountPath: "/api/internal",
      method: "GET",
      middlewares: [],
      modules: [__api_internal_users_ts_onRequestGet],
    },
  {
      routePath: "/api/internal/chat",
      mountPath: "/api/internal",
      method: "",
      middlewares: [],
      modules: [__api_internal_chat_ts_onRequest],
    },
  {
      routePath: "/api/internal/crm_appointments",
      mountPath: "/api/internal",
      method: "",
      middlewares: [],
      modules: [__api_internal_crm_appointments_ts_onRequest],
    },
  {
      routePath: "/api/internal/crm_customers",
      mountPath: "/api/internal",
      method: "",
      middlewares: [],
      modules: [__api_internal_crm_customers_ts_onRequest],
    },
  {
      routePath: "/api/internal/crm_invoices",
      mountPath: "/api/internal",
      method: "",
      middlewares: [],
      modules: [__api_internal_crm_invoices_ts_onRequest],
    },
  {
      routePath: "/api/internal/presence",
      mountPath: "/api/internal",
      method: "",
      middlewares: [],
      modules: [__api_internal_presence_ts_onRequest],
    },
  {
      routePath: "/api/internal/read_receipts",
      mountPath: "/api/internal",
      method: "",
      middlewares: [],
      modules: [__api_internal_read_receipts_ts_onRequest],
    },
  {
      routePath: "/api/internal/tasks",
      mountPath: "/api/internal",
      method: "",
      middlewares: [],
      modules: [__api_internal_tasks_ts_onRequest],
    },
  {
      routePath: "/api/contact",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_contact_ts_onRequestPost],
    },
  {
      routePath: "/api/onboarding",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_onboarding_ts_onRequestPost],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_ts_onRequest],
      modules: [],
    },
  ]