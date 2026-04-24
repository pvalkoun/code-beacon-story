export interface WebhookEndpoint {
  id: string;
  category: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  requestBody?: string;
  responseBody?: string;
  responseStatus?: number;
  headers?: { key: string; value: string }[];
}

export interface WebhookFieldDoc {
  path: string;
  type: string;
  required: boolean;
  description: string;
  constraints?: string;
}

export interface WebhookEndpointFieldDocs {
  requestFields?: WebhookFieldDoc[];
  responseFields?: WebhookFieldDoc[];
  pathParams?: WebhookFieldDoc[];
}

export const webhookEndpoints: WebhookEndpoint[] = [
  // ── Authentication ──
  {
    id: "wb-auth-token",
    category: "Authentication",
    name: "Create Auth Token",
    method: "POST",
    path: "/ccid/aam/v1/login",
    description: "Authenticate with the TCS platform to obtain a JWT access token. The returned access token must be supplied in the Authorization header (Bearer) of all subsequent webhook management, test, encryption, and delivery log requests.",
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    requestBody: `{
  "userId": "{{adminUserId}}",
  "password": "{{password}}"
}`,
    responseBody: `{
  "status": "success",
  "message": "Login is successful",
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIs...",
  "refreshToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCIs..."
}`,
    responseStatus: 200,
  },
  // ── Account Setup ──
  {
    id: "wb-enable-account",
    category: "Account Setup",
    name: "Enable Webhook Service",
    method: "POST",
    path: "/ccid/aam/v2/admin/account",
    description: "Create (or provision) an AAM enterprise account with the Webhook (WB) service enabled. This is a prerequisite before registering any webhook endpoints — the WB service entry must be present in the service array alongside any other services (e.g. SDPR) the account uses.",
    headers: [
      { key: "Content-Type", value: "application/json" },
      { key: "Accept", value: "application/json" },
    ],
    requestBody: `{
  "name": "user_sample enterprise_1",
  "type": "ENTERPRISE",
  "status": "ACTIVE",
  "relationship": "DIRECT",
  "parent_account": [
    "x0vo1z7q11"
  ],
  "billing": {
    "id": "TEwilldefine",
    "model": "OTHER",
    "frequency": "MONTHLY"
  },
  "service": [
    {
      "type": "SDPR"
    },
    {
      "type": "WB"
    }
  ],
  "child_account_enabled": false,
  "start_date": "Fri, 4 Apr 2025 18:18:49 GMT",
  "end_date": "Sat, 4 Apr 2026 18:18:49 GMT",
  "application": [
    "CCID",
    "TCS"
  ]
}`,
    responseBody: `{
  "id": "xi0vhua3b4",
  "name": "user_sample enterprise1",
  "type": "ENTERPRISE",
  "status": "ACTIVE",
  "relationship": "DIRECT",
  "parent_account": [
    "x0vo1z7q11"
  ],
  "billing": {
    "id": "TEwilldefine",
    "model": "OTHER",
    "frequency": "MONTHLY"
  },
  "service": [
    {
      "type": "SDPR",
      "id": "xi0vhua3b4"
    },
    {
      "type": "WB",
      "id": "xi0vhua3b4"
    }
  ],
  "child_account_enabled": false,
  "start_date": "Fri, 4 Apr 2025 18:18:49 GMT",
  "end_date": "Sat, 4 Apr 2026 18:18:49 GMT",
  "application": [
    "CCID",
    "TCS"
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Mon, 23 Mar 2026 16:42:42 GMT",
  "updated_by": "user_v4_api_prod",
  "updated_date": "Mon, 23 Mar 2026 16:42:42 GMT"
}`,
    responseStatus: 201,
  },
  {
    id: "wb-create-user",
    category: "Account Setup",
    name: "Create Webhook Admin User",
    method: "POST",
    path: "/ccid/aam/v2/admin/user",
    description: "Create a user in AAM and assign the WB_COMPANY_ADMIN role so they can register, update, test, and manage webhooks for the account. Webhook management APIs are protected by service-specific authorization — even existing company administrators must be explicitly granted the Webhook role. The company must already be subscribed to the Webhook service before this role can be assigned.",
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    requestBody: `{
  "user_id": "enterprise_company_admin_01",
  "user_name": "enterprise_company_admin_01",
  "company_id": "x0369a4otu",
  "email": "user.lastname@transunion.com",
  "first_name": "Lucky",
  "last_name": "Seven",
  "phone": "+1.7201234567",
  "roles": {
    "SDPR": [
      "SDPR_ENTERPRISE_ADMIN"
    ],
    "AAM": [
      "AAM_COMPANY_ADMIN"
    ],
    "WB": [
      "WB_COMPANY_ADMIN"
    ]
  },
  "comment": "Authorized enterprise admin access.",
  "status": "ACTIVE",
  "user_type": "API",
  "application": [
    "TCS"
  ]
}`,
    responseBody: `{
  "user_id": "enterprise_company_admin_01",
  "user_name": "enterprise_company_admin_01",
  "company_id": "x0369a4otu",
  "email": "user.lastname@transunion.com",
  "first_name": "Lucky",
  "last_name": "Seven",
  "phone": "+1.7201234567",
  "roles": {
    "SDPR": [
      "SDPR_ENTERPRISE_ADMIN"
    ],
    "WB": [
      "WB_COMPANY_ADMIN"
    ],
    "AAM": [
      "AAM_COMPANY_ADMIN"
    ]
  },
  "comment": "Authorized enterprise admin access.",
  "status": "ACTIVE",
  "user_type": "API",
  "application": [
    "TCS"
  ],
  "created_by": "neustaradminapi",
  "created_date": "Thu, 9 Apr 2026 08:28:59 GMT",
  "updated_by": "neustaradminapi",
  "updated_date": "Thu, 9 Apr 2026 08:28:59 GMT"
}`,
    responseStatus: 200,
  },

  // ── Webhook Management ──
  {
    id: "wb-register",
    category: "Webhook Management",
    name: "Register Webhook",
    method: "POST",
    path: "/ccid/webhook/v1/account/{{accountId}}/webhook",
    description: "Register a new webhook endpoint for the specified account. The webhook configuration defines the callback URL, authentication credentials, retry behavior, notification email contacts, and the services and event scopes to subscribe to. Passwords and API keys must be encrypted (see the Encryption Utility in the Setup Guide) before being included in the payload.",
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    requestBody: `{
  "webhook_name": "Webhook Notifications for Enterpise 01",
  "description": "This space is for webhook description",
  "state": "ACTIVE",
  "max_retry": 5,
  "email": ["user@example.com"],
  "auth_type": "apiKey",
  "credentials": {
    "api_key": "apiKey",
    "api_value": "X9aP7KqM2R8vZtYcH1fL",
    "location": "Header"
  },
  "services": [
    {
      "name": "sdpr",
      "entities": [
        {
          "type": "account",
          "data": {
            "webhook_url": "https://demo.myapp.com/account",
            "event_types": [
              {
                "event_type": "vetting_status",
                "trigger_on": ["VETTING_SUCCESSFUL"]
              },
              {
                "event_type": "partner_status",
                "trigger_on": ["*"]
              }
            ],
            "features": ["AUTH-BCD"]
          }
        },
        {
          "type": "tcsasset",
          "data": {
            "webhook_url": "https://demo.myapp.com/asset",
            "event_types": [
              {
                "event_type": "vetting_status",
                "trigger_on": ["VETTING_SUCCESSFUL"]
              },
              {
                "event_type": "tagging_status",
                "trigger_on": ["TG", "AG"]
              }
            ],
            "features": ["CNO"]
          }
        },
        {
          "type": "callerprofile",
          "data": {
            "webhook_url": "https://demo.myapp.com/cp",
            "event_types": [
              {
                "event_type": "partner_status",
                "trigger_on": ["Enable-Completed"]
              }
            ],
            "features": ["AUTH-BCD"]
          }
        }
      ]
    }
  ]
}`,
    responseBody: `{
  "id": "69c239466c81b511de9cb409",
  "webhook_name": "Webhook Notifications for Enterpise 01",
  "description": "This space is for webhook description",
  "state": "ACTIVE",
  "max_retry": 5,
  "auth_type": "apiKey",
  "services": [ ... ]
}`,
    responseStatus: 200,
  },
  {
    id: "wb-get",
    category: "Webhook Management",
    name: "Get Webhook",
    method: "GET",
    path: "/ccid/webhook/v1/account/{{accountId}}/webhook",
    description: "Retrieve the full configuration of the webhook for this account. The response mirrors the payload submitted at registration — including all registered scopes, event filters, authentication settings, retry policy, and current state. Encrypted credential values are returned in their encrypted form and are never re-disclosed in plain text.",
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    responseBody: `{
  "id": "69c239466c81b511de9cb409",
  "webhook_name": "Webhook Notifications for Enterpise 01",
  "description": "This space is for webhook description",
  "state": "ACTIVE",
  "max_retry": 5,
  "email": ["user@example.com"],
  "auth_type": "apiKey",
  "credentials": {
    "api_key": "apiKey",
    "api_value": "X9aP7KqM2R8vZtYcH1fL",
    "location": "Header"
  },
  "services": [
    {
      "name": "sdpr",
      "entities": [
        {
          "type": "account",
          "data": {
            "webhook_url": "https://demo.myapp.com/account",
            "event_types": [
              {
                "event_type": "vetting_status",
                "trigger_on": ["VETTING_SUCCESSFUL"]
              },
              {
                "event_type": "partner_status",
                "trigger_on": ["*"]
              }
            ],
            "features": ["AUTH-BCD"]
          }
        },
        {
          "type": "tcsasset",
          "data": {
            "webhook_url": "https://demo.myapp.com/asset",
            "event_types": [
              {
                "event_type": "vetting_status",
                "trigger_on": ["VETTING_SUCCESSFUL"]
              },
              {
                "event_type": "tagging_status",
                "trigger_on": ["TG", "AG"]
              }
            ],
            "features": ["CNO"]
          }
        },
        {
          "type": "callerprofile",
          "data": {
            "webhook_url": "https://demo.myapp.com/cp",
            "event_types": [
              {
                "event_type": "partner_status",
                "trigger_on": ["Enable-Completed"]
              }
            ],
            "features": ["AUTH-BCD"]
          }
        }
      ]
    }
  ]
}`,
    responseStatus: 200,
  },
  {
    id: "wb-update",
    category: "Webhook Management",
    name: "Update Webhook",
    method: "POST",
    path: "/ccid/webhook/v1/account/{{accountId}}/webhook",
    description: "Update the webhook configuration for this account. Submit the full updated payload including any new scopes, event types, URLs, or authentication changes. To pause or resume the webhook, update the state field to PAUSED or ACTIVE respectively. Changes take effect immediately on the delivery engine.",
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    requestBody: `{
  "webhook_name": "Webhook Notifications for Enterpise 01",
  "description": "Updated webhook with callerprofile scope",
  "state": "ACTIVE",
  "max_retry": 5,
  "email": ["user@example.com"],
  "auth_type": "apiKey",
  "credentials": {
    "api_key": "apiKey",
    "api_value": "X9aP7KqM2R8vZtYcH1fL",
    "location": "Header"
  },
  "services": [
    {
      "name": "sdpr",
      "entities": [
        {
          "type": "tcsasset",
          "data": {
            "webhook_url": "https://demo.myapp.com/asset",
            "event_types": [
              {
                "event_type": "vetting_status",
                "trigger_on": ["VETTING_SUCCESSFUL"]
              },
              {
                "event_type": "tagging_status",
                "trigger_on": ["TG", "AG"]
              }
            ],
            "features": ["CNO"]
          }
        },
        {
          "type": "callerprofile",
          "data": {
            "webhook_url": "https://demo.myapp.com/cp",
            "event_types": [
              {
                "event_type": "partner_status",
                "trigger_on": ["Enable-Completed"]
              }
            ],
            "features": ["AUTH-BCD"]
          }
        }
      ]
    }
  ]
}`,
    responseBody: `{
  "id": "69c239466c81b511de9cb409",
  "message": "Updated"
}`,
    responseStatus: 200,
  },
  {
    id: "wb-delete",
    category: "Webhook Management",
    name: "Delete Webhook",
    method: "DELETE",
    path: "/ccid/webhook/v1/account/{{accountId}}/webhook",
    description: "Permanently delete the webhook configuration for the specified account. This removes the entire webhook object including all registered scopes and event filters. This action cannot be undone.",
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    responseBody: `{
  "message": "Deleted",
  "status": 200
}`,
    responseStatus: 200,
  },

  // ── Delivery Logs ──
  {
    id: "wb-logs",
    category: "Test and Delivery Logs",
    name: "Get Delivery Logs",
    method: "GET",
    path: "/ccid/webhook/v1/account/{{accountId}}/webhook/logs",
    description: "Retrieve the delivery log history for the webhook. Logs include timestamps, payloads sent, HTTP response codes from your endpoint, retry attempt counts, and delivery status. Use these logs for debugging integration issues and monitoring delivery health.",
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    responseBody: `{
  "logs": [
    {
      "timestamp": "2026-03-02T14:45:10Z",
      "event_type": "partner_status",
      "entity_type": "account",
      "payload": { "current_status": "Enable-Completed" },
      "response_code": 200,
      "retry_count": 0,
      "status": "delivered"
    },
    {
      "timestamp": "2026-03-02T14:55:12Z",
      "event_type": "vetting_status",
      "entity_type": "TN",
      "payload": { "current_status": "VETTING_SUCCESSFUL" },
      "response_code": 500,
      "retry_count": 3,
      "status": "failed"
    }
  ]
}`,
    responseStatus: 200,
  },
  {
    id: "wb-test",
    category: "Test and Delivery Logs",
    name: "Test Webhook Connectivity",
    method: "POST",
    path: "/ccid/webhook/v1/account/{{accountId}}/webhook/test",
    description: "Test the connectivity of your configured callback endpoint(s) before registering the webhook. This validation confirms that each configured endpoint is reachable and operational, reducing the risk of delivery issues after activation. The response returns the HTTP status code returned by each endpoint.",
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    requestBody: `{
  "webhook_name": "Webhook Notifications for Enterpise 01",
  "description": "This space is for webhook description",
  "state": "ACTIVE",
  "max_retry": 5,
  "email": ["user@example.com"],
  "auth_type": "auth",
  "credentials": {
    "username": "admin",
    "password": "password",
    "login_url": "https://demo.myapp.com/login"
  },
  "services": [
    {
      "name": "sdpr",
      "entities": [
        {
          "type": "account",
          "data": {
            "webhook_url": "https://demo.myapp.com/account",
            "event_types": [
              { "event_type": "vetting_status", "trigger_on": ["VETTING_SUCCESSFUL"] },
              { "event_type": "partner_status", "trigger_on": ["*"] }
            ],
            "features": ["AUTH-BCD"]
          }
        },
        {
          "type": "tcsasset",
          "data": {
            "webhook_url": "https://demo.myapp.com/asset",
            "event_types": [
              { "event_type": "vetting_status", "trigger_on": ["VETTING_SUCCESSFUL"] },
              { "event_type": "tagging_status", "trigger_on": ["TG", "AG"] }
            ],
            "features": ["CNO"]
          }
        },
        {
          "type": "callerprofile",
          "data": {
            "webhook_url": "https://demo.myapp.com/cp",
            "event_types": [
              { "event_type": "partner_status", "trigger_on": ["Enable-Completed"] }
            ],
            "features": ["AUTH-BCD"]
          }
        }
      ]
    }
  ]
}`,
    responseBody: `{
  "urls": {
    "account": {
      "url": "https://demo.myapp.com/account",
      "status_code": 200
    },
    "tcsasset": {
      "url": "https://demo.myapp.com/asset",
      "status_code": 200
    },
    "callerprofile": {
      "url": "https://demo.myapp.com/cp",
      "status_code": 200
    }
  }
}`,
    responseStatus: 200,
  },

  // ── Encryption Utility ──
  {
    id: "wb-encrypt",
    category: "Authentication",
    name: "Encrypt Secret",
    method: "POST",
    path: "/ccid/webhook/v1/admin/webhook/encrypt",
    description: "Convert a plain-text secret (password or API key) into an encrypted value accepted by the webhook registration APIs. Plain-text passwords or API keys are never accepted by webhook APIs — the platform cannot reliably determine whether an incoming value is encrypted unless it conforms to the approved encryption format. This API can be used repeatedly and supports encrypting any single plain-text input.",
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    requestBody: `{
  "value": "myPlainTextPasswordOrApiKey"
}`,
    responseBody: `{
  "encrypted_value": "X9aP7KqM2R8vZtYcH1fL"
}`,
    responseStatus: 200,
  },
];

export const webhookFieldDocs: Record<string, WebhookEndpointFieldDocs> = {
  "wb-enable-account": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "The unique account identifier from AAM", constraints: "Must be a valid, existing AAM account ID" },
    ],
    requestFields: [
      { path: "name", type: "String", required: true, description: "Account name" },
      { path: "type", type: "String", required: true, description: "Account type", constraints: "ENTERPRISE" },
      { path: "status", type: "String", required: true, description: "Account status", constraints: "ACTIVE | INACTIVE" },
      { path: "relationship", type: "String", required: true, description: "Account relationship", constraints: "DIRECT" },
      { path: "parent_account", type: "Array<String>", required: false, description: "Parent account IDs" },
      { path: "billing", type: "Object", required: true, description: "Billing configuration (id, model, frequency)" },
      { path: "service[].type", type: "String", required: true, description: "Service type to enable. Include `WB` to enable Webhook service.", constraints: "WB | SDPR | other supported services" },
      { path: "child_account_enabled", type: "Boolean", required: false, description: "Whether child accounts are allowed" },
      { path: "start_date", type: "DateTime", required: true, description: "Account start date (RFC 1123)" },
      { path: "end_date", type: "DateTime", required: true, description: "Account end date (RFC 1123)" },
      { path: "application", type: "Array<String>", required: true, description: "Applications enabled on the account", constraints: "CCID, TCS" },
    ],
    responseFields: [
      { path: "accountId", type: "String", required: true, description: "The account ID that was updated" },
      { path: "message", type: "String", required: true, description: "Confirmation message" },
    ],
  },
  "wb-create-user": {
    requestFields: [
      { path: "user_id", type: "String", required: true, description: "Unique user identifier" },
      { path: "user_name", type: "String", required: true, description: "User display name" },
      { path: "company_id", type: "String", required: true, description: "AAM company / account ID this user belongs to" },
      { path: "email", type: "String", required: true, description: "User email address" },
      { path: "first_name", type: "String", required: true, description: "First name" },
      { path: "last_name", type: "String", required: true, description: "Last name" },
      { path: "phone", type: "String", required: false, description: "Phone number" },
      { path: "roles.WB", type: "Array<String>", required: true, description: "Webhook roles to assign", constraints: "WB_COMPANY_ADMIN" },
      { path: "roles.SDPR", type: "Array<String>", required: false, description: "SDPR roles" },
      { path: "roles.AAM", type: "Array<String>", required: false, description: "AAM roles" },
      { path: "comment", type: "String", required: false, description: "Free-text comment" },
      { path: "status", type: "String", required: true, description: "User status", constraints: "ACTIVE | INACTIVE" },
      { path: "user_type", type: "String", required: true, description: "User type", constraints: "API | UI" },
      { path: "application", type: "Array<String>", required: true, description: "Applications the user can access", constraints: "TCS" },
    ],
    responseFields: [
      { path: "user_id", type: "String", required: true, description: "The user ID that was created" },
      { path: "message", type: "String", required: true, description: "Confirmation message" },
    ],
  },
  "wb-register": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "The account ID (from AAM) to register the webhook under", constraints: "Account must have WB service enabled" },
    ],
    requestFields: [
      { path: "webhook_name", type: "String", required: true, description: "A human-readable name for this webhook configuration" },
      { path: "description", type: "String", required: false, description: "Optional description of the webhook purpose" },
      { path: "state", type: "String", required: true, description: "Initial state of the webhook", constraints: "ACTIVE | PAUSED" },
      { path: "max_retry", type: "Integer", required: true, description: "Maximum number of retry attempts for failed deliveries", constraints: "Recommended: 3-5" },
      { path: "email", type: "Array", required: true, description: "Email addresses or PDLs to notify after max retries are exhausted and for cool-off events" },
      { path: "auth_type", type: "String", required: true, description: "Authentication method for your callback endpoint", constraints: "oAuth | apiKey | none" },
      { path: "credentials.username", type: "String", required: false, description: "Username for oAuth (required if auth_type is 'oAuth')" },
      { path: "credentials.password", type: "String", required: false, description: "Encrypted password for oAuth (required if auth_type is 'oAuth'). Must be encrypted using the Encryption Utility." },
      { path: "credentials.login_url", type: "String", required: false, description: "Login URL for oAuth token retrieval" },
      { path: "credentials.api_key", type: "String", required: false, description: "API key name (required if auth_type is 'apiKey')" },
      { path: "credentials.api_value", type: "String", required: false, description: "Encrypted API key value (required if auth_type is 'apiKey'). Must be encrypted using the Encryption Utility." },
      { path: "credentials.location", type: "String", required: false, description: "Where to place the API key", constraints: "Header | Query Param" },
      { path: "services[].name", type: "String", required: true, description: "Service name to subscribe to", constraints: "e.g., sdpr" },
      { path: "services[].entities[].type", type: "String", required: true, description: "The entity scope level", constraints: "account | tcsasset | callerprofile" },
      { path: "services[].entities[].data.webhook_url", type: "String", required: true, description: "Your HTTPS callback URL for this scope", constraints: "Must be a valid HTTPS URL" },
      { path: "services[].entities[].data.event_types[].event_type", type: "String", required: true, description: "The event category to subscribe to", constraints: "vetting_status | partner_status | tagging_status" },
      { path: "services[].entities[].data.event_types[].trigger_on", type: "Array", required: true, description: "Specific status values to trigger on, or ['*'] for all", constraints: "See Event Reference for valid values" },
      { path: "services[].entities[].data.features", type: "Array", required: true, description: "Feature filter for notifications. At least one feature must be configured. Use CNO for tagging_status events.", constraints: "CNO | AUTH-BCD | RICH-BCD | SPOOF-CALL-PROTECTION" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique webhook identifier assigned by the system" },
      { path: "webhook_name", type: "String", required: true, description: "The registered webhook name" },
      { path: "state", type: "String", required: true, description: "Current state of the webhook", constraints: "ACTIVE | PAUSED" },
    ],
  },
  "wb-get": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "The account ID for the webhook to retrieve" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique webhook identifier" },
      { path: "webhook_name", type: "String", required: true, description: "The registered webhook name" },
      { path: "description", type: "String", required: false, description: "Description of the webhook purpose" },
      { path: "state", type: "String", required: true, description: "Current state of the webhook", constraints: "ACTIVE | PAUSED" },
      { path: "max_retry", type: "Integer", required: true, description: "Maximum retry attempts for failed deliveries" },
      { path: "email", type: "Array", required: true, description: "Notification email addresses" },
      { path: "auth_type", type: "String", required: true, description: "Authentication method configured", constraints: "oAuth | apiKey | none" },
      { path: "credentials", type: "Object", required: false, description: "Auth credentials as registered. Encrypted secrets are returned in encrypted form; never re-disclosed in plain text." },
      { path: "services", type: "Array", required: true, description: "Registered service scopes, entity bindings, event filters, and feature flags — mirrors the registration payload" },
    ],
  },
  "wb-update": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "The account ID for the webhook to update" },
    ],
    requestFields: [
      { path: "(same as Register)", type: "—", required: false, description: "Submit the full updated payload with modified values. All fields from the Register endpoint apply. Set state to PAUSED or ACTIVE to pause or resume deliveries.", constraints: "Changes take effect immediately" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "The webhook ID that was updated" },
      { path: "message", type: "String", required: true, description: "Confirmation message" },
    ],
  },
  "wb-delete": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "The account ID whose webhook should be deleted" },
    ],
    responseFields: [
      { path: "message", type: "String", required: true, description: "Confirmation message" },
      { path: "status", type: "Integer", required: true, description: "HTTP status code", constraints: "200" },
    ],
  },
  "wb-test": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "The account ID under which the webhook will be configured" },
    ],
    requestFields: [
      { path: "(same as Register)", type: "—", required: false, description: "Submit the full webhook payload to test. The endpoint(s) are invoked synchronously to verify reachability and authentication." },
    ],
    responseFields: [
      { path: "urls.<scope>.url", type: "String", required: true, description: "The webhook URL that was tested" },
      { path: "urls.<scope>.status_code", type: "Integer", required: true, description: "HTTP status code returned by the endpoint", constraints: "2xx indicates success" },
    ],
  },
  "wb-encrypt": {
    requestFields: [
      { path: "value", type: "String", required: true, description: "The plain-text secret (password or API key) to encrypt" },
    ],
    responseFields: [
      { path: "encrypted_value", type: "String", required: true, description: "The encrypted value to use as `credentials.password` (oAuth) or `credentials.api_value` (apiKey) when registering a webhook" },
    ],
  },
  "wb-logs": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "The account ID whose webhook delivery logs are being retrieved" },
    ],
    responseFields: [
      { path: "logs", type: "Array", required: true, description: "List of webhook delivery log entries" },
      { path: "logs[].timestamp", type: "String (ISO 8601)", required: true, description: "When the delivery attempt occurred (UTC)" },
      { path: "logs[].event_type", type: "String", required: true, description: "Event type that triggered the delivery", constraints: "vetting_status | tagging_status | partner_status" },
      { path: "logs[].entity_type", type: "String", required: true, description: "Scope level of the event", constraints: "account | callerprofile | TN" },
      { path: "logs[].payload", type: "Object", required: true, description: "The event payload that was sent to your endpoint" },
      { path: "logs[].response_code", type: "Integer", required: true, description: "HTTP status code returned by your endpoint" },
      { path: "logs[].retry_count", type: "Integer", required: true, description: "Number of retry attempts made for this delivery" },
      { path: "logs[].status", type: "String", required: true, description: "Final delivery outcome", constraints: "delivered | failed | pending" },
    ],
  },
};

export const webhookCategories = ["Authentication", "Account Setup", "Webhook Management", "Test and Delivery Logs"];

export const getWebhookEndpoint = (id: string) => webhookEndpoints.find(e => e.id === id);

export const getWebhookEndpointsByCategory = (category: string) =>
  webhookEndpoints.filter(e => e.category === category);

// ── Sample Event Payloads ──
export const sampleEventPayloads = {
  account: `{
  "id": "f1h6i7j9-3e2g-4f46-gh8i-6k7j8f9g0h1i",
  "event_create_date": "2026-04-20T14:45:10Z",
  "entity": {
    "type": "account",
    "account_id": "acc_12345"
  },
  "data": [
    {
      "type": "vetting_status",
      "current_status": "VETTING_SUCCESSFUL",
      "previous_status": "VETTING_EXCEPTION"
    }
  ],
  "retryPolicy": {
    "attempt": 1,
    "waittime_in_seconds": 30
  }
}`,
  callerProfile: `{
  "id": "e0g5h6i8-2d1f-4e35-fg7h-5j6i7e8f9g0h",
  "event_create_date": "2026-04-20T14:55:12Z",
  "entity": {
    "type": "callerprofile",
    "id": "6762897023d6164ac81f92e8",
    "name": "caller profile name1",
    "account_id": "neustar"
  },
  "data": [
    {
      "type": "partner_status",
      "current_status": "Enable-Completed",
      "previous_status": "Enable-Failed"
    }
  ],
  "retryPolicy": {
    "attempt": 1,
    "waittime_in_seconds": 30
  }
}`,
  tn: `{
  "id": "a3f1c2d4-8e7b-4a91-bc3d-1f2e3a4b5c6d",
  "event_create_date": "2026-04-20T14:30:22.452Z",
  "entity": {
    "type": "tcsasset",
    "account_id": "acc_12345",
    "tn": "+1.97774581001",
    "callerProfileId": "Priya_CNO_20251022-130308"
  },
  "data": [
    {
      "type": "vetting_status",
      "current_status": "VETTING_SUCCESSFUL",
      "previous_status": "VETTING_EXCEPTION"
    },
    {
      "type": "tagging_status",
      "current_status": "TG",
      "previous_status": "AG"
    }
  ],
  "retryPolicy": {
    "attempt": 1,
    "waittime_in_seconds": 30
  }
}`,
};

// ── Cool-Off Notification Email Sample ──
export const coolOffEmailSample = {
  subject: "CCID Webhook Notification - Account {{accountId}}",
  body: `Dear Customer,

We are writing to inform you that webhook delivery for your account has been temporarily paused (cool-off) due to repeated delivery failures to your registered endpoint.

Account ID: {{accountId}}
Failure Reason: Endpoint returned non-2xx HTTP status after maximum retry attempts
Cool-Off Duration: 60 minutes
Delivery Will Resume At: {{resumeTimestamp}}
Notification Timestamp: {{notificationTimestamp}}

To resume normal delivery, please ensure your webhook endpoint is reachable and returns an HTTP 2xx response within the configured timeout window. Once the cool-off period expires, the platform will automatically retry delivery.

If your endpoint continues to fail after the cool-off period, delivery may be paused again and your webhook may be moved to an inactive state requiring manual reactivation.

For assistance, please contact TransUnion Support.

— TransUnion TruContact Trusted Call Solutions`,
};
