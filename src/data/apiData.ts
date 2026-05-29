type ApiProduct = "scp" | "bcd" | "cno" | "common";

export interface ApiEndpoint {
  id: string;
  category: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  requestBody?: string;
  responseBody?: string;
  responseStatus?: number;
  headers?: { key: string; value: string; description?: string }[];
  queryParams?: { name: string; type: string; required: boolean; description: string }[];
  errorBody?: string;
  product?: ApiProduct[];
  imageRequirements?: string[];
}

const TN_ASSET_ENDPOINT_IDS = new Set([
  "create-tn-asset",
  "create-tn-asset-byoc",
  "update-tn-asset",
  "get-tn-asset",
  "list-tn-assets",
]);

const TN_ASSET_PRODUCT_EXAMPLES: Record<Exclude<ApiProduct, "common">, { callerProfileName: string; serviceName: string }> = {
  bcd: {
    callerProfileName: "Your Company Name_BCD_Rich_20260225-212320",
    serviceName: "RICH-BCD",
  },
  cno: {
    callerProfileName: "Your Company Name_CNO_20260225-212320",
    serviceName: "CNO",
  },
  scp: {
    callerProfileName: "Your Company Name_SCP_20260225-212320",
    serviceName: "SPOOF-CALL-PROTECTION",
  },
};

const applyProductEndpointExample = (endpoint: ApiEndpoint, product?: Exclude<ApiProduct, "common">) => {
  if (!product || !TN_ASSET_ENDPOINT_IDS.has(endpoint.id) || !endpoint.responseBody) {
    return endpoint;
  }

  const example = TN_ASSET_PRODUCT_EXAMPLES[product];
  const replaceToken = (value: string, search: string, replacement: string) => value.split(search).join(replacement);

  return {
    ...endpoint,
    responseBody: replaceToken(
      replaceToken(endpoint.responseBody, TN_ASSET_PRODUCT_EXAMPLES.bcd.callerProfileName, example.callerProfileName),
      '"name": "RICH-BCD"',
      `"name": "${example.serviceName}"`,
    ),
  };
};

export const apiEndpoints: ApiEndpoint[] = [
  // ── Authentication ──
  {
    id: "auth-token",
    category: "Authentication",
    name: "Create Auth Token",
    method: "POST",
    path: "/ccid/aam/v1/login",
    description: "Authenticate with the TCS platform to obtain an access token. This token is required in the Authorization header of all subsequent API calls.",
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
    product: ["common"]
  },

  // ── Account Management ──
  {
    id: "create-account",
    category: "Account Management",
    name: "Create Account",
    method: "POST",
    path: "/ccid/aam/v2/admin/account",
    description: "Create a new enterprise account. This is the first step after authentication to set up your organization on the TCS platform.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
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
    }
  ],
  "child_account_enabled": false,
  "domain": "user.com",
  "comment": "example for tech enabler setup",
  "contact": [
    {
      "first_name": "james",
      "last_name": "bond",
      "email": "james.bond@example.com",
      "phone": "+1.7201234567",
      "type": "PRIMARY"
    },
    {
      "first_name": "charlie",
      "last_name": "bond",
      "email": "charlie.bond@example.com",
      "phone": "+1.1134567890",
      "type": "SECONDARY"
    }
  ],
  "address": {
    "street": "123 Main st",
    "city": "Sterling",
    "postal_code": "20123",
    "state_or_province": "VA",
    "country_code": "US"
  },
  "start_date": "Fri, 4 Apr 2025 18:18:49 GMT",
  "end_date": "Sat, 4 Apr 2026 18:18:49 GMT",
  "application": [
    "CCID",
    "TCS"
  ],
  "ein": "123456789",
  "duns": "923456789",
  "name_alias": [
    "name alias2",
    "name alias1"
  ],
  "vetting": {
    "status": "PREVETTED",
    "status_timestamp": "Fri, 4 Apr 2025 18:18:49 GMT"
  }
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
    }
  ],
  "child_account_enabled": false,
  "domain": "user.com",
  "comment": "example for tech enabler setup",
  "contact": [
    {
      "first_name": "james",
      "last_name": "bond",
      "email": "james.bond@example.com",
      "phone": "+1.7201234567",
      "type": "PRIMARY"
    },
    {
      "first_name": "charlie",
      "last_name": "bond",
      "email": "charlie.bond@example.com",
      "phone": "+1.1134567890",
      "type": "SECONDARY"
    }
  ],
  "address": {
    "street": "123 Main st",
    "city": "Sterling",
    "postal_code": "20123",
    "state_or_province": "VA",
    "country_code": "US"
  },
  "start_date": "Fri, 4 Apr 2025 18:18:49 GMT",
  "end_date": "Sat, 4 Apr 2026 18:18:49 GMT",
  "application": [
    "CCID",
    "TCS"
  ],
  "ein": "123456789",
  "duns": "923456789",
  "name_alias": [
    "name alias2",
    "name alias1"
  ],
  "vetting": {
    "status": "PREVETTED",
    "status_timestamp": "Fri, 4 Apr 2025 18:18:49 GMT"
  },
  "created_by": "user_v4_api_prod",
  "created_date": "Mon, 23 Mar 2026 16:42:42 GMT",
  "updated_by": "user_v4_api_prod",
  "updated_date": "Mon, 23 Mar 2026 16:42:42 GMT"
}`,
    responseStatus: 201,
    product: ["common"]
  },
  {
    id: "get-account",
    category: "Account Management",
    name: "Get Account",
    method: "GET",
    path: "/ccid/aam/v2/admin/account/{accountId}",
    description: "Retrieve details of a specific account by its ID, including contacts, address, vetting status, and service configuration.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{
  "id": "xeb9ekoawz",
  "name": "user_sample enterprise",
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
      "type": "STIAS",
      "id": "571578"
    },
    {
      "type": "SDPR",
      "id": "xeb9ekoawz"
    }
  ],
  "child_account_enabled": false,
  "domain": "user.com",
  "comment": "example for tech enabler setup",
  "contact": [
    {
      "first_name": "charlie",
      "last_name": "bond",
      "email": "charlie.bond@example.com",
      "phone": "+1.1134567890",
      "type": "SECONDARY"
    },
    {
      "first_name": "james",
      "last_name": "bond",
      "email": "james.bond@example.com",
      "phone": "+1.7201234567",
      "type": "PRIMARY"
    }
  ],
  "address": {
    "street": "123 Main st",
    "city": "Sterling",
    "postal_code": "20123",
    "state_or_province": "VA",
    "country_code": "US"
  },
  "start_date": "Fri, 4 Apr 2025 18:18:49 GMT",
  "end_date": "Sat, 4 Apr 2026 18:18:49 GMT",
  "application": [
    "CCID",
    "TCS"
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Wed, 18 Feb 2026 21:06:14 GMT",
  "updated_by": "user_v4_api_prod",
  "updated_date": "Wed, 18 Feb 2026 21:06:14 GMT",
  "ein": "123456789",
  "duns": "923456789",
  "name_alias": [
    "name alias2",
    "name alias1"
  ],
  "vetting": {
    "status": "PREVETTED",
    "status_timestamp": "Fri, 4 Apr 2025 18:18:49 GMT"
  }
}`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "list-account",
    category: "Account Management",
    name: "List Accounts",
    method: "GET",
    path: "/ccid/aam/v2/admin/account",
    description: "List accounts visible to the authenticated admin. Each entry mirrors the full account object returned by Get Account. Results are returned in pages — pass the value returned in the response's `Pagination-Token` header back on the next request as the `Pagination-Token` request header. When the response omits the header, you have reached the last page.",
    headers: [
      { key: "Accept", value: "application/json" },
      {
        key: "Pagination-Token",
        value: "{{paginationToken}}",
        description: "Opaque cursor used to fetch the next page of results. Omit on the first request. Use the value returned in the Pagination-Token response header of the previous call. When the response does not include this header, there are no more pages.",
      },
    ],
    responseBody: `[
  {
    "id": "xeb9ekoawz",
    "name": "user_sample enterprise",
    "type": "ENTERPRISE",
    "status": "ACTIVE",
    "relationship": "DIRECT",
    "parent_account": [
      "x0vo1z7q11"
    ],
    "billing": {
      "id": "TUwilldefine",
      "model": "TRANSACTION",
      "frequency": "MONTHLY"
    },
    "service": [
      {
        "type": "STIAS",
        "id": "571578"
      },
      {
        "type": "SDPR",
        "id": "xeb9ekoawz"
      }
    ],
    "child_account_enabled": false,
    "domain": "user.com",
    "comment": "example for tech enabler setup",
    "contact": [
      {
        "first_name": "charlie",
        "last_name": "bond",
        "email": "charlie.bond@example.com",
        "phone": "+1.1134567890",
        "type": "SECONDARY"
      },
      {
        "first_name": "james",
        "last_name": "bond",
        "email": "james.bond@example.com",
        "phone": "+1.7201234567",
        "type": "PRIMARY"
      }
    ],
    "address": {
      "street": "123 Main st",
      "city": "Sterling",
      "postal_code": "20123",
      "state_or_province": "VA",
      "country_code": "US"
    },
    "start_date": "Fri, 4 Apr 2025 18:18:49 GMT",
    "end_date": "Sat, 4 Apr 2026 18:18:49 GMT",
    "application": [
      "CCID",
      "TCS"
    ],
    "created_by": "user_v4_api_prod",
    "created_date": "Wed, 18 Feb 2026 21:06:14 GMT",
    "updated_by": "user_v4_api_prod",
    "updated_date": "Wed, 18 Feb 2026 21:06:14 GMT",
    "ein": "123456789",
    "duns": "923456789",
    "name_alias": [
      "name alias2",
      "name alias1"
    ],
    "vetting": {
      "status": "PREVETTED",
      "status_timestamp": "Fri, 4 Apr 2025 18:18:49 GMT"
    }
  },
  {
    "id": "xvm465a2g8",
    "name": "user_enterprise_7",
    "type": "ENTERPRISE",
    "status": "ACTIVE",
    "relationship": "DIRECT",
    "parent_account": [
      "xgvaf00cx3"
    ],
    "billing": {
      "id": "user_enterprise_7",
      "model": "TRANSACTION",
      "frequency": "MONTHLY"
    },
    "service": [
      {
        "type": "SDPR",
        "id": "xvm465a2g8"
      }
    ],
    "child_account_enabled": true,
    "domain": "user_enterprise_7",
    "comment": "example for tech enabler setup for 7th account",
    "contact": [
      {
        "first_name": "james",
        "last_name": "bond",
        "email": "james.bond@example.com",
        "phone": "+1.7201234567",
        "type": "PRIMARY"
      },
      {
        "first_name": "charlie",
        "last_name": "bond",
        "email": "charlie.bond@example.com",
        "phone": "+1.1134567890",
        "type": "SECONDARY"
      }
    ],
    "address": {
      "street": "456 Oak ave",
      "city": "Reston",
      "postal_code": "20190",
      "state_or_province": "VA",
      "country_code": "US"
    },
    "start_date": "Fri, 4 Apr 2025 18:18:49 GMT",
    "end_date": "Sat, 4 Apr 2026 18:18:49 GMT",
    "application": [
      "CCID",
      "TCS"
    ],
    "created_by": "user_v4_api_prod",
    "created_date": "Thu, 19 Feb 2026 14:22:08 GMT",
    "updated_by": "user_v4_api_prod",
    "updated_date": "Thu, 19 Feb 2026 14:22:08 GMT",
    "ein": "987654321",
    "duns": "987654321",
    "name_alias": [
      "alt name 1",
      "alt name 2"
    ],
    "vetting": {
      "status": "PREVETTED",
      "status_timestamp": "Fri, 4 Apr 2025 18:18:49 GMT"
    }
  }
]`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "update-account",
    category: "Account Management",
    name: "Update Account",
    method: "POST",
    path: "/ccid/aam/v2/admin/account/{accountId}",
    description: "Update an existing account's details including contacts, address, billing configuration, vetting information, and more.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "id": "xvm465a2g8",
  "name": "user_enterprise_7",
  "type": "ENTERPRISE",
  "status": "ACTIVE",
  "relationship": "DIRECT",
  "parent_account": [
    "xgvaf00cx3"
  ],
  "billing": {
    "id": "user_enterprise_7",
    "model": "TRANSACTION",
    "frequency": "MONTHLY"
  },
  "service": [
    {
      "type": "SDPR",
      "id": "xvm465a2g8"
    }
  ],
  "child_account_enabled": true,
  "domain": "user_enterprise_7",
  "comment": "example for tech enabler setup for 7th account",
  "contact": [
    {
      "first_name": "james",
      "last_name": "bond",
      "email": "james.bond@example.com",
      "phone": "+1.7201234567",
      "type": "PRIMARY"
    },
    {
      "first_name": "charlie",
      "last_name": "bond",
      "email": "charlie.bond@example.com",
      "phone": "+1.1134567890",
      "type": "SECONDARY"
    }
  ],
  "address": {
    "street": "123 Main st",
    "city": "Sterling",
    "postal_code": "20123",
    "state_or_province": "VA",
    "country_code": "US"
  },
  "start_date": "Fri, 4 Apr 2025 18:18:49 GMT",
  "end_date": "Sat, 4 Apr 2026 18:18:49 GMT",
  "application": [
    "CCID",
    "TCS"
  ],
  "ein": "123456789",
  "duns": "923456789",
  "name_alias": [
    "name alias2",
    "name alias1"
  ],
  "vetting": {
    "status": "PREVETTED",
    "status_timestamp": "Fri, 4 Apr 2025 18:18:49 GMT"
  }
}`,
    responseBody: `{
  "id": "xeb9ekoawz",
  "name": "user_sample enterprise",
  "type": "ENTERPRISE",
  "status": "ACTIVE",
  "relationship": "DIRECT",
  "parent_account": [
    "x0vo1z7q11"
  ],
  "billing": {
    "id": "TUwilldefine",
    "model": "TRANSACTION",
    "frequency": "MONTHLY"
  },
  "service": [
    {
      "type": "STIAS",
      "id": "571578"
    },
    {
      "type": "SDPR",
      "id": "xeb9ekoawz"
    }
  ],
  "child_account_enabled": false,
  "domain": "user.com",
  "comment": "example for tech enabler setup",
  "contact": [
    {
      "first_name": "charlie",
      "last_name": "bond",
      "email": "charlie.bond@example.com",
      "phone": "+1.1134567890",
      "type": "SECONDARY"
    },
    {
      "first_name": "james",
      "last_name": "bond",
      "email": "james.bond@example.com",
      "phone": "+1.7201234567",
      "type": "PRIMARY"
    }
  ],
  "address": {
    "street": "123 Main st",
    "city": "Sterling",
    "postal_code": "20123",
    "state_or_province": "VA",
    "country_code": "US"
  },
  "start_date": "Fri, 4 Apr 2025 18:18:49 GMT",
  "end_date": "Sat, 4 Apr 2026 18:18:49 GMT",
  "application": [
    "CCID",
    "TCS"
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Wed, 18 Feb 2026 21:06:14 GMT",
  "updated_by": "user_v4_api_prod",
  "updated_date": "Wed, 18 Feb 2026 21:43:12 GMT",
  "ein": "123456789",
  "duns": "923456789",
  "name_alias": [
    "name alias2",
    "name alias1"
  ],
  "vetting": {
    "status": "PREVETTED",
    "status_timestamp": "Fri, 4 Apr 2025 18:18:49 GMT"
  }
}`,
    responseStatus: 206,
    product: ["common"]
  },
  {
    id: "delete-account",
    category: "Account Management",
    name: "Delete Account",
    method: "DELETE",
    path: "/ccid/aam/v2/admin/account/{accountId}",
    description: "Delete an account. All associated features, caller profiles, and TN assets must be removed before an account can be deleted.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseStatus: 200,
    product: ["common"]
  },


  // ── Account TCS ──
  {
    id: "attach-account-tcs",
    category: "Account TCS",
    name: "Attach Account TCS",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/tcs",
    description: "Attach TCS (Trusted Call Solutions) configuration to an account. This enables the account for call branding and protection services by specifying the lead generation source and carrier distributors.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "lead_generation": "TransUnion",
  "distributor": [
    "AT&T"
  ]
}`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "get-account-tcs",
    category: "Account TCS",
    name: "Get Account TCS",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/tcs",
    description: "Retrieve the TCS configuration for an account, including lead generation source and active distributors.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{
  "lead_generation": "AT&T",
  "distributor": [
    "AT&T"
  ],
  "account_id": "x59tj8rtv1"
}`,
    responseStatus: 200,
    product: ["common"]
  },

  // ── Features ──
  {
    id: "attach-feature",
    category: "Features",
    name: "Attach Features",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/feature",
    description: "Attach features to an account. Multiple feature types (AUTH-ONLY, RICH-BCD, AUTH-BCD, NAME-BCD, SPOOF-CALL-PROTECTION, CNO, MFA-TN, MFA-ORIGID, ORIG-POLICY) and their carrier partner configurations can be set in a single request.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "feature": [
    "AUTH-ONLY",
    "RICH-BCD",
    "AUTH-BCD",
    "NAME-BCD",
    "SPOOF-CALL-PROTECTION",
    "CNO",
    "MFA-TN",
    "MFA-ORIGID",
    "ORIG-POLICY"
  ],
  "service": [
    {
      "name": "AUTH-ONLY",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested"
        }
      ]
    },
    {
      "name": "SPOOF-CALL-PROTECTION",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested"
        },
        {
          "name": "tmobile",
          "status": "Enable-Requested"
        },
        {
          "name": "verizon",
          "status": "Enable-Requested"
        }
      ]
    },
    {
      "name": "AUTH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested"
        },
        {
          "name": "tmobile",
          "status": "Enable-Requested"
        },
        {
          "name": "verizon",
          "status": "Enable-Requested"
        }
      ]
    },
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested"
        },
        {
          "name": "tmobile",
          "status": "Enable-Requested"
        },
        {
          "name": "verizon",
          "status": "Enable-Requested"
        }
      ]
    },
    {
      "name": "CNO",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested"
        },
        {
          "name": "tmobile",
          "status": "Enable-Requested"
        },
        {
          "name": "verizon",
          "status": "Enable-Requested"
        }
      ]
    }
  ]
}`,
    responseBody: `{
  "account_id": "x59tj8rtv1",
  "feature": [
    "AUTH-ONLY",
    "RICH-BCD",
    "AUTH-BCD",
    "NAME-BCD",
    "SPOOF-CALL-PROTECTION",
    "CNO",
    "MFA-TN",
    "MFA-ORIGID",
    "ORIG-POLICY"
  ],
  "service": [
    {
      "name": "AUTH-ONLY",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested"
        }
      ]
    },
    {
      "name": "SPOOF-CALL-PROTECTION",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested"
        },
        {
          "name": "tmobile",
          "status": "Enable-Requested"
        },
        {
          "name": "verizon",
          "status": "Enable-Requested"
        }
      ]
    },
    {
      "name": "AUTH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested"
        },
        {
          "name": "tmobile",
          "status": "Enable-Requested"
        },
        {
          "name": "verizon",
          "status": "Enable-Requested"
        }
      ]
    },
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested"
        },
        {
          "name": "tmobile",
          "status": "Enable-Requested"
        },
        {
          "name": "verizon",
          "status": "Enable-Requested"
        }
      ]
    },
    {
      "name": "CNO",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested"
        },
        {
          "name": "tmobile",
          "status": "Enable-Requested"
        },
        {
          "name": "verizon",
          "status": "Enable-Requested"
        }
      ]
    }
  ],
  "created_by": "user",
  "created_date": "Fri, 20 Feb 2026 20:31:49 GMT"
}`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "get-feature",
    category: "Features",
    name: "Get Features",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/feature",
    description: "Retrieve all features attached to an account, including per-carrier partner enablement statuses.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{
  "account_id": "x59tj8rtv1",
  "feature": [
    "AUTH-ONLY",
    "RICH-BCD",
    "AUTH-BCD",
    "NAME-BCD",
    "SPOOF-CALL-PROTECTION",
    "CNO",
    "MFA-TN",
    "MFA-ORIGID",
    "ORIG-POLICY"
  ],
  "service": [
    {
      "name": "AUTH-ONLY",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        }
      ]
    },
    {
      "name": "SPOOF-CALL-PROTECTION",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        },
        {
          "name": "tmobile",
          "status": "Enable-Completed"
        },
        {
          "name": "verizon",
          "status": "Enable-Completed"
        }
      ]
    },
    {
      "name": "AUTH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        },
        {
          "name": "tmobile",
          "status": "Enable-Completed"
        },
        {
          "name": "verizon",
          "status": "Enable-Completed"
        }
      ]
    },
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        },
        {
          "name": "tmobile",
          "status": "Enable-Completed"
        },
        {
          "name": "verizon",
          "status": "Enable-Completed"
        }
      ]
    },
    {
      "name": "CNO",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        },
        {
          "name": "tmobile",
          "status": "Enable-Completed"
        },
        {
          "name": "verizon",
          "status": "Enable-Completed"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Fri, 20 Feb 2026 20:31:49 GMT",
  "updated_by": "user",
  "updated_date": "Wed, 25 Feb 2026 21:47:19 GMT"
}`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "update-feature",
    category: "Features",
    name: "Update Features",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/feature",
    description: "Update features on an account. Uses the same POST endpoint and full body shape as Attach Features (PUT-style — supply the complete desired feature and service set). Use this to add features, modify carrier partner enablement (Enable/Disable/Suspend/Resume), or change configuration. Valid features: AUTH-ONLY, RICH-BCD, AUTH-BCD, NAME-BCD, SPOOF-CALL-PROTECTION, CNO, MFA-TN, MFA-ORIGID, ORIG-POLICY. Partner status transitions: Enable-Requested, Disable-Requested, Suspend-Requested, Resume-Requested. MFA-TN, MFA-ORIGID, and ORIG-POLICY do not require partner distribution.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "feature": [
    "AUTH-ONLY",
    "RICH-BCD",
    "AUTH-BCD",
    "NAME-BCD",
    "SPOOF-CALL-PROTECTION",
    "CNO",
    "MFA-TN",
    "MFA-ORIGID",
    "ORIG-POLICY"
  ],
  "service": [
    {
      "name": "AUTH-ONLY",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        }
      ]
    },
    {
      "name": "SPOOF-CALL-PROTECTION",
      "partner": [
        {
          "name": "att",
          "status": "Suspend-Requested"
        },
        {
          "name": "tmobile",
          "status": "Suspend-Requested"
        },
        {
          "name": "verizon",
          "status": "Suspend-Requested"
        }
      ]
    },
    {
      "name": "AUTH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        },
        {
          "name": "tmobile",
          "status": "Enable-Completed"
        },
        {
          "name": "verizon",
          "status": "Enable-Completed"
        }
      ]
    },
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        },
        {
          "name": "tmobile",
          "status": "Enable-Completed"
        },
        {
          "name": "verizon",
          "status": "Enable-Completed"
        }
      ]
    },
    {
      "name": "CNO",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        },
        {
          "name": "tmobile",
          "status": "Enable-Completed"
        },
        {
          "name": "verizon",
          "status": "Enable-Completed"
        }
      ]
    }
  ]
}`,
    responseBody: `{
  "account_id": "x59tj8rtv1",
  "feature": [
    "AUTH-ONLY",
    "RICH-BCD",
    "AUTH-BCD",
    "NAME-BCD",
    "SPOOF-CALL-PROTECTION",
    "CNO",
    "MFA-TN",
    "MFA-ORIGID",
    "ORIG-POLICY"
  ],
  "service": [
    {
      "name": "AUTH-ONLY",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        }
      ]
    },
    {
      "name": "SPOOF-CALL-PROTECTION",
      "partner": [
        {
          "name": "att",
          "status": "Suspend-Requested"
        },
        {
          "name": "tmobile",
          "status": "Suspend-Requested"
        },
        {
          "name": "verizon",
          "status": "Suspend-Requested"
        }
      ]
    },
    {
      "name": "AUTH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        },
        {
          "name": "tmobile",
          "status": "Enable-Completed"
        },
        {
          "name": "verizon",
          "status": "Enable-Completed"
        }
      ]
    },
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        },
        {
          "name": "tmobile",
          "status": "Enable-Completed"
        },
        {
          "name": "verizon",
          "status": "Enable-Completed"
        }
      ]
    },
    {
      "name": "CNO",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        },
        {
          "name": "tmobile",
          "status": "Enable-Completed"
        },
        {
          "name": "verizon",
          "status": "Enable-Completed"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Fri, 20 Feb 2026 20:31:49 GMT",
  "updated_by": "user",
  "updated_date": "Wed, 25 Feb 2026 21:47:19 GMT"
}`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "delete-feature",
    category: "Features",
    name: "Delete Features",
    method: "DELETE",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/feature",
    description: "Delete all features from an account. All caller profiles and TN assets must be removed first.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{}`,
    responseStatus: 200,
    product: ["common"]
  },

  // ── Image ──
  {
    id: "create-image",
    category: "Image",
    name: "Create Image with URL",
    method: "POST",
    path: "/ccid/media/v1/admin/account/{accountId}/image",
    description: "Upload an image by providing a publicly accessible URL. The image is downloaded, processed, and stored internally. Save the returned image id — it will be used when creating an image profile.",
    imageRequirements: ["Image must be exactly 256×256 pixels", "Image must be in BMP, JPG, or PNG format", "Image file size must be less than 270 KB"],
    errorBody: `{
  "error": "IMAGE_VALIDATION_FAILED",
  "message": "Image does not meet requirements",
  "details": [
    "Image must be exactly 256x256 pixels",
    "Image must be in BMP, JPG, or PNG format",
    "Image must be less than 270KB in size"
  ]
}`,
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "name": "Smiley-Face-256x256",
  "note": "Smiley icon with 32-bits per pixel",
  "url": "https://www.example.biz/logo/smiley.bmp"
}`,
    responseBody: `{
  "id": "90860ccc-9b34-4229-9d9c-29bf9074b674",
  "name": "Smiley-Face-256x256",
  "type": "bmp",
  "width": 256,
  "height": 256,
  "size": 265000,
  "note": "Smiley icon with 32-bits per pixel",
  "url": "https://www.example.biz/logo/smiley.bmp",
  "image_url": "https://api-rst.ccid.neustar.biz/ccid/media/v1/admin/account/x59tj8rtv1/image/90860ccc-9b34-4229-9d9c-29bf9074b674.bmp",
  "account_id": "x59tj8rtv1",
  "parent_account_id": "x0vo1z7q11",
  "super_account_id": "x0vo1z7q11",
  "billing_id": "TEwilldefine",
  "created_by": "UserID",
  "created_date": "Sun, 3 May 2026 23:53:01 GMT",
  "updated_by": "UserID",
  "updated_date": "Sun, 3 May 2026 23:53:01 GMT"
}`,
    responseStatus: 201,
    product: ["bcd"]
  },
  {
    id: "create-image-data",
    category: "Image",
    name: "Create Image with Data",
    method: "POST",
    path: "/ccid/media/v1/admin/account/{accountId}/image",
    description: "Upload an image by providing the raw image bytes Base64-encoded in the request body. The image is processed and stored internally. Save the returned image id — it will be used when creating an image profile.",
    imageRequirements: ["Image must be exactly 256×256 pixels", "Image must be in BMP, JPG, or PNG format", "Image file size must be less than 270 KB"],
    errorBody: `{
  "error_id": "ImageTypeNotSupported",
  "http_status_code": 400,
  "sip_code": 400,
  "reason": "Image type not supported",
  "timestamp": "Sun, 3 May 2026 23:53:00 GMT",
  "developer_message": "Currently, BMP, PNG and JPEG images are supported",
  "attributes": {
    "object_type": "Image",
    "object_field": "data",
    "data": "227bda96274899a81e0d..."
  }
}`,
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "name": "Smiley-Face-256x256",
  "note": "Smiley icon with 32-bits per pixel",
  "data": "Qk04AwAAAAAAADYAAAAoAAAAEAAAABAAAAABABgAAAAAAAIDAAAAAAAAAAAAAAAAAAAAAAAA..."
}`,
    responseBody: `{
  "id": "90860ccc-9b34-4229-9d9c-29bf9074b674",
  "name": "Smiley-Face-256x256",
  "type": "bmp",
  "width": 256,
  "height": 256,
  "size": 265000,
  "note": "Smiley icon with 32-bits per pixel",
  "image_url": "https://api-rst.ccid.neustar.biz/ccid/media/v1/admin/account/x59tj8rtv1/image/90860ccc-9b34-4229-9d9c-29bf9074b674.bmp",
  "account_id": "x59tj8rtv1",
  "parent_account_id": "x0vo1z7q11",
  "super_account_id": "x0vo1z7q11",
  "billing_id": "TEwilldefine",
  "created_by": "UserID",
  "created_date": "Sun, 3 May 2026 23:53:01 GMT",
  "updated_by": "UserID",
  "updated_date": "Sun, 3 May 2026 23:53:01 GMT"
}`,
    responseStatus: 201,
    product: ["bcd"]
  },
  {
    id: "update-image",
    category: "Image",
    name: "Update Image",
    method: "PUT",
    path: "/ccid/media/v1/admin/account/{accountId}/image/{imageId}",
    description: "Update an existing image's metadata. Only the `name` and `note` fields can be modified — image binary data, dimensions, type, and other attributes cannot be changed. To change the image bytes, delete the image and create a new one.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "name": "Smiley-Face-Updated",
  "note": "Updated note for smiley icon"
}`,
    responseBody: `{
  "id": "90860ccc-9b34-4229-9d9c-29bf9074b674",
  "name": "Smiley-Face-Updated",
  "type": "bmp",
  "width": 256,
  "height": 256,
  "size": 265000,
  "note": "Updated note for smiley icon",
  "url": "https://www.example.biz/logo/smiley.bmp",
  "image_url": "https://api-rst.ccid.neustar.biz/ccid/media/v1/admin/account/x59tj8rtv1/image/90860ccc-9b34-4229-9d9c-29bf9074b674.bmp",
  "account_id": "x59tj8rtv1",
  "parent_account_id": "x0vo1z7q11",
  "super_account_id": "x0vo1z7q11",
  "billing_id": "TEwilldefine",
  "created_by": "UserID",
  "created_date": "Sun, 3 May 2026 23:53:01 GMT",
  "updated_by": "UserID",
  "updated_date": "Tue, 5 May 2026 14:22:10 GMT"
}`,
    responseStatus: 200,
    product: ["bcd"]
  },
  {
    id: "get-image",
    category: "Image",
    name: "Get Image",
    method: "GET",
    path: "/ccid/media/v1/admin/account/{accountId}/image/{imageId}",
    description: "Retrieve an image by ID, including its CDN URL.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{
  "id": "90860ccc-9b34-4229-9d9c-29bf9074b674",
  "name": "Smiley-Face-256x256",
  "type": "bmp",
  "width": 256,
  "height": 256,
  "size": 265000,
  "note": "Smiley icon with 32-bits per pixel",
  "url": "https://www.example.biz/logo/smiley.bmp",
  "image_url": "https://api-rst.ccid.neustar.biz/ccid/media/v1/admin/account/x59tj8rtv1/image/90860ccc-9b34-4229-9d9c-29bf9074b674.bmp",
  "account_id": "x59tj8rtv1",
  "parent_account_id": "x0vo1z7q11",
  "super_account_id": "x0vo1z7q11",
  "billing_id": "TEwilldefine",
  "created_by": "UserID",
  "created_date": "Sun, 3 May 2026 23:53:01 GMT",
  "updated_by": "UserID",
  "updated_date": "Sun, 3 May 2026 23:53:01 GMT"
}`,
     responseStatus: 200,
    product: ["bcd"]
  },
  {
    id: "view-image",
    category: "Image",
    name: "View Image",
    method: "GET",
    path: "/ccid/media/v1/admin/account/{accountId}/image/{imageId}.{ext}",
    description: "Retrieve the raw binary image bytes from the URL returned in the `image_url` field of the Get Image / Create Image response. The endpoint requires the same Bearer Token authentication as all other TCS API calls. The response Content-Type matches the image format (image/bmp, image/jpeg, or image/png).",
    headers: [{ key: "Accept", value: "image/bmp, image/jpeg, image/png" }],
    responseStatus: 200,
    product: ["bcd"]
  },
  {
    id: "list-image",
    category: "Image",
    name: "List Images",
    method: "GET",
    path: "/ccid/media/v1/admin/account/{accountId}/image",
    description: "Retrieve a list of all images that exist under the specified account.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `[
  {
    "id": "90860ccc-9b34-4229-9d9c-29bf9074b674",
    "name": "Smiley-Face-256x256",
    "type": "bmp",
    "width": 256,
    "height": 256,
    "size": 265000,
    "note": "Smiley icon with 32-bits per pixel",
    "url": "https://www.example.biz/logo/smiley.bmp",
    "image_url": "https://api-rst.ccid.neustar.biz/ccid/media/v1/admin/account/x59tj8rtv1/image/90860ccc-9b34-4229-9d9c-29bf9074b674.bmp",
    "account_id": "x59tj8rtv1",
    "parent_account_id": "x0vo1z7q11",
    "super_account_id": "x0vo1z7q11",
    "billing_id": "TEwilldefine",
    "created_by": "UserID",
    "created_date": "Sun, 3 May 2026 23:53:01 GMT",
    "updated_by": "UserID",
    "updated_date": "Sun, 3 May 2026 23:53:01 GMT"
  },
  {
    "id": "a1b2c3d4-e5f6-4789-9abc-1234567890ab",
    "name": "Company-Logo-256x256",
    "type": "jpg",
    "width": 256,
    "height": 256,
    "size": 48200,
    "note": "Company logo in JPEG format",
    "url": "https://www.example.biz/logo/company-logo.jpg",
    "image_url": "https://api-rst.ccid.neustar.biz/ccid/media/v1/admin/account/x59tj8rtv1/image/a1b2c3d4-e5f6-4789-9abc-1234567890ab.jpg",
    "account_id": "x59tj8rtv1",
    "parent_account_id": "x0vo1z7q11",
    "super_account_id": "x0vo1z7q11",
    "billing_id": "TEwilldefine",
    "created_by": "UserID",
    "created_date": "Mon, 4 May 2026 10:15:22 GMT",
    "updated_by": "UserID",
    "updated_date": "Mon, 4 May 2026 10:15:22 GMT"
  }
]`,
    responseStatus: 200,
    product: ["bcd"]
  },
  {
    id: "delete-image",
    category: "Image",
    name: "Delete Image",
    method: "DELETE",
    path: "/ccid/media/v1/admin/account/{accountId}/image/{imageId}",
    description: "Delete an image from the account. The image must not be referenced by any active image profiles.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseStatus: 204,
    product: ["bcd"]
  },

  // ── Image Profile ──
  {
    id: "create-image-profile",
    category: "Image Profile",
    name: "Create Image Profile",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/image-profile",
    description: "Create an image profile linked to a previously uploaded image. The image profile is submitted for vetting across all carrier partners. Poll the Get Image Profile endpoint until vetting is complete.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "name": "imageProfileTest",
  "image_id": "autogeneratedimageid"
}`,
    responseBody: `{
  "id": "69d4a87d7b3c6e58d402225e",
  "name": "imageProfileTest",
  "image_id": "autogeneratedimageid",
  "image_url": "https://api-rst.ccid.neustar.biz/ccid/media/v1/admin/account/x59tj8rtv1/image/autogeneratedimageid.bmp",
  "partner": [
    { "name": "att", "status": "Vetting-Requested" },
    { "name": "tmobile", "status": "Vetting-Requested" },
    { "name": "verizon", "status": "Vetting-Requested" }
  ],
  "vetting": {
    "status": "VETTING_REQUESTED",
    "status_timestamp": "Mon, 17 Oct 2022 00:00:00 GMT"
  },
  "created_by": "user_v4_api_prod",
  "created_date": "Tue, 7 Apr 2026 06:47:25 GMT"
}`,
    responseStatus: 201,
    product: ["bcd"]
  },
  {
    id: "get-image-profile",
    category: "Image Profile",
    name: "Get Image Profile",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/image-profile/{imageProfileId}",
    description: "Retrieve an image profile by ID. After vetting is approved, partner_status will reflect Enable-Completed for each carrier.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{
  "id": "69d4a87d7b3c6e58d402225e",
  "name": "imageProfileTest",
  "account_id": "x59tj8rtv1",
  "image_id": "autogeneratedimageid",
  "image_url": "https://api-rst.ccid.neustar.biz/ccid/media/v1/admin/account/x59tj8rtv1/image/autogeneratedimageid.bmp",
  "partner": [
    { "name": "att", "status": "Enable-Completed" },
    { "name": "tmobile", "status": "Enable-Completed" },
    { "name": "verizon", "status": "Enable-Completed" }
  ],
  "vetting": {
    "status": "VETTING_SUCCESSFUL",
    "status_timestamp": "Mon, 17 Oct 2022 00:00:00 GMT"
  },
  "created_by": "user_v4_api_prod",
  "created_date": "Tue, 7 Apr 2026 06:47:25 GMT",
  "updated_by": "user_v4_api_prod",
  "updated_date": "Tue, 8 Apr 2026 06:47:26 GMT"
}`,
    responseStatus: 200,
    product: ["bcd"]
  },
  {
    id: "list-image-profile",
    category: "Image Profile",
    name: "List Image Profiles",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/image-profile",
    description: "Retrieve a list of all image profiles that exist under an account, including their vetting and per-carrier partner statuses. Use the `limit` and `offset` query parameters to page through large result sets.",
    headers: [{ key: "Accept", value: "application/json" }],
    queryParams: [
      { name: "limit", type: "integer", required: false, description: "Maximum number of image profiles to return in the response. Used to control page size when paginating. Defaults to the system maximum if omitted." },
      { name: "offset", type: "integer", required: false, description: "Zero-based index of the first image profile to return. Combined with `limit`, this skips the specified number of records to fetch the next page (e.g. offset=100 with limit=50 returns records 101–150)." },
    ],
    responseBody: `[
  {
    "id": "69d4a87d7b3c6e58d402225e",
    "name": "imageProfileTest",
    "account_id": "x59tj8rtv1",
    "image_id": "autogeneratedimageid",
    "image_url": "https://api-rst.ccid.neustar.biz/ccid/media/v1/admin/account/x59tj8rtv1/image/autogeneratedimageid.bmp",
    "partner": [
      { "name": "att", "status": "Enable-Completed" },
      { "name": "tmobile", "status": "Enable-Completed" },
      { "name": "verizon", "status": "Enable-Completed" }
    ],
    "vetting": {
      "status": "VETTING_SUCCESSFUL",
      "status_timestamp": "Mon, 17 Oct 2022 00:00:00 GMT"
    },
    "created_by": "user_v4_api_prod",
    "created_date": "Tue, 7 Apr 2026 06:47:25 GMT",
    "updated_by": "user_v4_api_prod",
    "updated_date": "Tue, 8 Apr 2026 06:47:26 GMT"
  },
  {
    "id": "7af5c91e8d2b4f17a309336f",
    "name": "smileyProfileJpg",
    "account_id": "x59tj8rtv1",
    "image_id": "smileyjpgimageid",
    "image_url": "https://api-rst.ccid.neustar.biz/ccid/media/v1/admin/account/x59tj8rtv1/image/smileyjpgimageid.jpg",
    "partner": [
      { "name": "att", "status": "Enable-Requested" },
      { "name": "tmobile", "status": "Enable-Completed" },
      { "name": "verizon", "status": "Enable-Completed" }
    ],
    "vetting": {
      "status": "VETTING_SUBMITTED",
      "status_timestamp": "Wed, 22 Apr 2026 14:12:08 GMT"
    },
    "created_by": "user_v4_api_prod",
    "created_date": "Wed, 22 Apr 2026 14:11:50 GMT",
    "updated_by": "user_v4_api_prod",
    "updated_date": "Wed, 22 Apr 2026 14:12:08 GMT"
  }
]`,
    responseStatus: 200,
    product: ["bcd"]
  },
  {
    id: "delete-image-profile",
    category: "Image Profile",
    name: "Delete Image Profile",
    method: "DELETE",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/image-profile/{imageProfileId}",
    description: "Delete an image profile from an account. The image profile must not be referenced by any active caller profiles.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseStatus: 204,
    product: ["bcd"]
  },

  // ── Caller Profile ──
  {
    id: "attach-scp-caller-profile",
    category: "Caller Profile",
    name: "Attach SCP Caller Profile",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/caller-profile",
    description: "Create a caller profile for Spoofed Call Protection. The profile defines the CCID-ORIG and SPOOF-CALL-PROTECTION service configuration with per-carrier partner statuses.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "service": [
    {
      "name": "CCID-ORIG",
      "partner": []
    },
    {
      "name": "SPOOF-CALL-PROTECTION",
      "partner": [
        {
          "name": "att",
          "status": "TU-Review-Requested"
        },
        {
          "name": "tmobile",
          "status": "TU-Review-Requested"
        },
        {
          "name": "verizon",
          "status": "TU-Review-Requested"
        }
      ]
    }
  ]
}`,
    responseBody: `{
  "id": "699f684820a7a57a0a67c03a",
  "name": "Your Company Name_SCP_20260225-212320",
  "account_id": "x59tj8rtv1",
  "service": [
    {
      "name": "CCID-ORIG",
      "partner": []
    },
    {
      "name": "SPOOF-CALL-PROTECTION",
      "partner": [
        {
          "name": "att",
          "status": "TU-Review-Requested"
        },
        {
          "name": "tmobile",
          "status": "TU-Review-Requested"
        },
        {
          "name": "verizon",
          "status": "TU-Review-Requested"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Wed, 25 Feb 2026 21:23:20 GMT"
}`,
    responseStatus: 201,
    product: ["scp"]
  },
  {
    id: "attach-bcd-caller-profile",
    category: "Caller Profile",
    name: "Attach Rich BCD Caller Profile",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/caller-profile",
    description: "Create a caller profile for Rich Branded Call Display. Includes branded caller name, call reason, and image profile for logo display on the recipient's device.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "branded_caller_name": "Your Company Name",
  "call_reason": "Account Update",
  "image_profile_id": "{{imageId}}",
  "service": [
    {
      "name": "CCID-ORIG",
      "partner": []
    },
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "TU-Review-Requested"
        },
        {
          "name": "tmobile",
          "status": "TU-Review-Requested"
        },
        {
          "name": "verizon",
          "status": "TU-Review-Requested"
        }
      ]
    }
  ]
}`,
    responseBody: `{
  "id": "699f684820a7a57a0a67c03a",
  "name": "Your Company Name_BCD_Rich_20260225-212320",
  "account_id": "x59tj8rtv1",
  "branded_caller_name": "Your Company Name",
  "call_reason": "Account Update",
  "image_profile_id": "699f620c6ccc0121aeb7eef4",
  "service": [
    {
      "name": "CCID-ORIG",
      "partner": []
    },
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "TU-Review-Requested"
        },
        {
          "name": "tmobile",
          "status": "TU-Review-Requested"
        },
        {
          "name": "verizon",
          "status": "TU-Review-Requested"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Wed, 25 Feb 2026 21:23:20 GMT"
}`,
    responseStatus: 201,
    product: ["bcd"]
  },
  {
    id: "attach-auth-bcd-caller-profile",
    category: "Caller Profile",
    name: "Attach AUTH-BCD Caller Profile",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/caller-profile",
    description: "Create a caller profile for AUTH-BCD (authenticated branded call display without rich content). Includes branded caller name and per-carrier partner statuses, but no call reason or image profile.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "branded_caller_name": "Your Company Name",
  "service": [
    {
      "name": "CCID-ORIG",
      "partner": []
    },
    {
      "name": "AUTH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "TU-Review-Requested"
        },
        {
          "name": "tmobile",
          "status": "TU-Review-Requested"
        },
        {
          "name": "verizon",
          "status": "TU-Review-Requested"
        }
      ]
    }
  ]
}`,
    responseBody: `{
  "id": "699f684820a7a57a0a67c03a",
  "name": "Your Company Name_BCD_Auth_20260225-212320",
  "account_id": "x59tj8rtv1",
  "branded_caller_name": "Your Company Name",
  "service": [
    {
      "name": "CCID-ORIG",
      "partner": []
    },
    {
      "name": "AUTH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "TU-Review-Requested"
        },
        {
          "name": "tmobile",
          "status": "TU-Review-Requested"
        },
        {
          "name": "verizon",
          "status": "TU-Review-Requested"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Wed, 25 Feb 2026 21:23:20 GMT"
}`,
    responseStatus: 201,
    product: ["bcd"]
  },
  {
    id: "attach-cno-caller-profile",
    category: "Caller Profile",
    name: "Attach CNO Caller Profile",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/caller-profile",
    description: "Create a caller profile for Caller Name Optimization (CNO). The profile defines the CCID-ORIG and CNO service configuration with per-carrier partner statuses.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "service": [
    {
      "name": "CCID-ORIG",
      "partner": []
    },
    {
      "name": "CNO",
      "partner": [
        {
          "name": "att",
          "status": "TU-Review-Requested"
        },
        {
          "name": "tmobile",
          "status": "TU-Review-Requested"
        },
        {
          "name": "verizon",
          "status": "TU-Review-Requested"
        }
      ]
    }
  ]
}`,
    responseBody: `{
  "id": "699f684820a7a57a0a67c03a",
  "name": "Your Company Name_CNO_20260225-212320",
  "account_id": "x59tj8rtv1",
  "service": [
    {
      "name": "CCID-ORIG",
      "partner": []
    },
    {
      "name": "CNO",
      "partner": [
        {
          "name": "att",
          "status": "TU-Review-Requested"
        },
        {
          "name": "tmobile",
          "status": "TU-Review-Requested"
        },
        {
          "name": "verizon",
          "status": "TU-Review-Requested"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Wed, 25 Feb 2026 21:23:20 GMT"
}`,
    responseStatus: 201,
    product: ["cno"]
  },
  {
    id: "get-caller-profile",
    category: "Caller Profile",
    name: "Get Caller Profile",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/caller-profile/{profileId}",
    description: "Retrieve a specific caller profile by ID, including its service configuration and partner statuses.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{
  "id": "699f684820a7a57a0a67c03a",
  "name": "Your Company Name_CNO_20260225-212320",
  "account_id": "x59tj8rtv1",
  "service": [
    {
      "name": "CCID-ORIG",
      "partner": []
    },
    {
      "name": "CNO",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        },
        {
          "name": "tmobile",
          "status": "Enable-Completed"
        },
        {
          "name": "verizon",
          "status": "Enable-Completed"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Wed, 25 Feb 2026 21:23:20 GMT"
}`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "list-caller-profiles",
    category: "Caller Profile",
    name: "List Caller Profiles",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/caller-profile",
    description: "List all caller profiles for an account. Use the `limit` and `offset` query parameters to page through large result sets.",
    headers: [{ key: "Accept", value: "application/json" }],
    queryParams: [
      { name: "limit", type: "integer", required: false, description: "Maximum number of caller profiles to return in the response. Used to control page size when paginating. Defaults to the system maximum if omitted." },
      { name: "offset", type: "integer", required: false, description: "Zero-based index of the first caller profile to return. Combined with `limit`, this skips the specified number of records to fetch the next page (e.g. offset=100 with limit=50 returns records 101–150)." },
    ],
    responseBody: `[
  {
    "id": "699f684820a7a57a0a67c03a",
    "name": "Your Company Name_BCD_Rich_20260225-212320",
    "account_id": "x59tj8rtv1",
    "branded_caller_name": "Your Company Name",
    "call_reason": "Account Update",
    "image_profile_id": "699f620c6ccc0121aeb7eef4",
    "service": [
      {
        "name": "CCID-ORIG",
        "partner": []
      },
      {
        "name": "RICH-BCD",
        "partner": [
          {
            "name": "att",
            "status": "Enable-Completed"
          },
          {
            "name": "tmobile",
            "status": "Enable-Completed"
          },
          {
            "name": "verizon",
            "status": "Enable-Completed"
          }
        ]
      }
    ],
    "created_by": "user_v4_api_prod",
    "created_date": "Wed, 25 Feb 2026 21:23:20 GMT"
  },
  {
    "id": "699f684820a7a57a0a67c03b",
    "name": "Your Company Name_BCD_Auth_20260225-212320",
    "account_id": "x59tj8rtv1",
    "branded_caller_name": "Your Company Name",
    "service": [
      {
        "name": "CCID-ORIG",
        "partner": []
      },
      {
        "name": "AUTH-BCD",
        "partner": [
          {
            "name": "att",
            "status": "Enable-Completed"
          },
          {
            "name": "tmobile",
            "status": "Enable-Completed"
          },
          {
            "name": "verizon",
            "status": "Enable-Completed"
          }
        ]
      }
    ],
    "created_by": "user_v4_api_prod",
    "created_date": "Wed, 25 Feb 2026 21:23:20 GMT"
  }
]`,
    responseStatus: 200,
    product: ["common"]
  },

  // ── TN Assets ──
  {
    id: "create-tn-asset",
    category: "TN Assets",
    name: "Create TN Account Asset",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/orig/tcs/asset",
    description: "Register a telephone number (TN) as an asset on the account and associate it with a caller profile created in the previous step.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "full_ownership": true,
  "tn": {
    "orig": {
      "start": "+1.5715550123"
    }
  },
  "caller_profile_id": "{{profileId}}",
  "label": [
    "test$label1",
    "test$label8"
  ]
}`,
    responseBody: `{
  "id": "69aa0525232c112395eb458e",
  "state": "ACTIVE",
  "account_id": "x59tj8rtv1",
  "vetter": "CARRIER",
  "priority": 0,
  "full_ownership": true,
  "owner_type": "enterprise",
  "parent_account_id": "x0vo1z7q11",
  "super_account_id": "x0vo1z7q11",
  "tn": {
    "orig": {
      "start": "+1.5555855555",
      "count": 1
    }
  },
  "vetting": {
    "request_timestamp": "Thu, 5 Mar 2026 22:35:17 GMT",
    "status": "VETTING_DEFERRED",
    "status_timestamp": "Thu, 5 Mar 2026 22:35:17 GMT"
  },
  "caller_profile": "Your Company Name_BCD_Rich_20260225-212320",
  "caller_profile_id": "699f684820a7a57a0a67c03a",
  "tagging_status": {},
  "partner_data": [
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        },
        {
          "name": "verizon",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        },
        {
          "name": "tmobile",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Thu, 5 Mar 2026 22:35:17 GMT"
}`,
    responseStatus: 201,
    product: ["common"]
  },
  {
    id: "create-tn-asset-byoc",
    category: "TN Assets",
    name: "Create TN Account Asset (BYOC)",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/orig/tcs/asset",
    description: "Register a telephone number as a Bring Your Own Carrier (BYOC) asset. Use full_ownership: false when the number is managed through a third-party carrier or CPaaS platform (e.g., Twilio, Genesys). BYOC numbers go through an additional vetting process.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "full_ownership": false,
  "tn": {
    "orig": {
      "start": "+1.5555855555"
    }
  },
  "caller_profile_id": "{{profileId}}",
  "label": [
    "test$label1",
    "test$label8"
  ]
}`,
    responseBody: `{
  "id": "69aa0462232c112395eb455a",
  "state": "VETTING",
  "account_id": "x59tj8rtv1",
  "vetter": "NEUSTAR",
  "priority": 0,
  "full_ownership": false,
  "owner_type": "enterprise",
  "parent_account_id": "x0vo1z7q11",
  "super_account_id": "x0vo1z7q11",
  "tn": {
    "orig": {
      "start": "+1.5555655555",
      "count": 1
    }
  },
  "vetting": {
    "request_timestamp": "Thu, 5 Mar 2026 22:32:02 GMT",
    "status": "VETTING_DEFERRED",
    "status_timestamp": "Thu, 5 Mar 2026 22:32:02 GMT"
  },
  "caller_profile": "Your Company Name_BCD_Rich_20260225-212320",
  "caller_profile_id": "699f684820a7a57a0a67c03a",
  "tagging_status": {},
  "partner_data": [
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        },
        {
          "name": "verizon",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        },
        {
          "name": "tmobile",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Thu, 5 Mar 2026 22:32:02 GMT"
}`,
    responseStatus: 201,
    product: ["common"]
  },
  {
    id: "update-tn-asset",
    category: "TN Assets",
    name: "Update TN Account Asset",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/orig/tcs/asset/{tnAssetId}",
    description: "Update an existing TN asset, for example to change ownership type, labels, or reassign to a different caller profile.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "full_ownership": false,
  "tn": {
    "orig": {
      "start": "+1.5555855555"
    }
  },
  "caller_profile_id": "{{profileId}}",
  "label": [
    "test$label1",
    "test$label8"
  ]
}`,
    responseBody: `{
  "id": "69aa0525232c112395eb458e",
  "state": "ACTIVE",
  "account_id": "x59tj8rtv1",
  "vetter": "NEUSTAR",
  "priority": 0,
  "full_ownership": true,
  "owner_type": "enterprise",
  "parent_account_id": "x0vo1z7q11",
  "super_account_id": "x0vo1z7q11",
  "tn": {
    "orig": {
      "start": "+1.5555855555",
      "count": 1
    }
  },
  "label": [
    "reallyimportantnumber",
    "customercare"
  ],
  "vetting": {
    "request_timestamp": "Thu, 5 Mar 2026 22:35:17 GMT",
    "status": "VETTING_DEFERRED",
    "status_timestamp": "Thu, 5 Mar 2026 22:35:17 GMT"
  },
  "caller_profile": "Your Company Name_BCD_Rich_20260225-212320",
  "caller_profile_id": "699f684820a7a57a0a67c03a",
  "tagging_status": {},
  "partner_data": [
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        },
        {
          "name": "verizon",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        },
        {
          "name": "tmobile",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Thu, 5 Mar 2026 22:35:17 GMT",
  "updated_by": "user_v4_api_prod",
  "updated_date": "Thu, 5 Mar 2026 22:39:25 GMT"
}`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "get-tn-asset",
    category: "TN Assets",
    name: "Get TN Account Asset",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/orig/tcs/asset/{assetId}",
    description: "Retrieve a specific TN asset by its ID, including vetting status, partner enablement data, and caller profile association.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{
  "id": "69a088f66ccc0121aeb816d2",
  "state": "ACTIVE",
  "account_id": "x59tj8rtv1",
  "vetter": "CARRIER",
  "priority": 0,
  "full_ownership": false,
  "owner_type": "enterprise",
  "parent_account_id": "x0vo1z7q11",
  "super_account_id": "x0vo1z7q11",
  "tn": {
    "orig": {
      "start": "+1.5555555555",
      "count": 1
    }
  },
  "vetting": {
    "request_timestamp": "Thu, 26 Feb 2026 17:55:02 GMT",
    "status": "VETTING_DEFERRED",
    "status_timestamp": "Thu, 26 Feb 2026 17:55:02 GMT"
  },
  "caller_profile": "Your Company Name_BCD_Rich_20260225-212320",
  "caller_profile_id": "699f684820a7a57a0a67c03a",
  "tagging_status": {
    "att": "TG"
  },
  "partner_data": [
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        },
        {
          "name": "verizon",
          "status": "Enable-Processing",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        },
        {
          "name": "tmobile",
          "status": "Enable-Completed",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Thu, 26 Feb 2026 17:55:02 GMT",
  "updated_by": "PartnerAdmin",
  "updated_date": "Thu, 26 Feb 2026 17:55:05 GMT"
}`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "list-tn-assets",
    category: "TN Assets",
    name: "List TN Account Assets",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/orig/tcs/asset",
    description: "List all TN assets for an account, including their states, vetting statuses, and partner data. Use the `limit` and `offset` query parameters to page through large result sets.",
    headers: [{ key: "Accept", value: "application/json" }],
    queryParams: [
      { name: "limit", type: "integer", required: false, description: "Maximum number of TN assets to return in the response. Used to control page size when paginating. Defaults to the system maximum if omitted." },
      { name: "offset", type: "integer", required: false, description: "Zero-based index of the first TN asset to return. Combined with `limit`, this skips the specified number of records to fetch the next page (e.g. offset=100 with limit=50 returns records 101–150)." },
    ],
    responseBody: `[
  {
    "id": "69a088f66ccc0121aeb816d2",
    "state": "VETTING",
    "type": "tcstn",
    "version": "v4",
    "account_id": "x59tj8rtv1",
    "account_name": "user_sample enterprise1",
    "vetter": "NEUSTAR",
    "priority": 0,
    "full_ownership": false,
    "owner_type": "enterprise",
    "parent_account_id": "x0vo1z7q11",
    "super_account_id": "x0vo1z7q11",
    "tn": {
      "orig": {
        "start": "+1.5555555555",
        "count": 1
      }
    },
    "vetting": {
      "request_timestamp": "Thu, 26 Feb 2026 17:55:02 GMT",
      "status": "VETTING_DEFERRED",
      "status_timestamp": "Thu, 26 Feb 2026 17:55:02 GMT"
    },
    "caller_profile": "Your Company Name_BCD_Rich_20260225-212320",
    "caller_profile_id": "699f684820a7a57a0a67c03a",
    "tagging_status": {
      "att": "TG"
    },
    "partner_data": [
      {
        "name": "RICH-BCD",
        "partner": [
          {
            "name": "att",
            "status": "Enable-Completed",
            "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
          },
          {
            "name": "verizon",
            "status": "Enable-Processing",
            "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
          },
          {
            "name": "tmobile",
            "status": "Enable-Completed",
            "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
          }
        ]
      }
    ],
    "created_by": "user_v4_api_prod",
    "created_date": "Thu, 26 Feb 2026 17:55:02 GMT",
    "updated_by": "PartnerAdmin",
    "updated_date": "Thu, 26 Feb 2026 17:55:05 GMT"
  }
]`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "delete-tn-asset",
    category: "TN Assets",
    name: "Delete TN Account Asset",
    method: "DELETE",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/orig/tcs/asset/{tnAssetId}",
    description: "Remove a TN asset from an account. The TN will no longer be associated with any caller profile or service.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{}`,
    responseStatus: 200,
    product: ["common"]
  }
];

export const getEndpointsForProduct = (product: "scp" | "bcd" | "cno") => {
  return apiEndpoints.filter(ep => ep.product?.includes(product as "scp" | "bcd" | "cno") || ep.product?.includes("common"));
};

export const getEndpointById = (id: string, product?: Exclude<ApiProduct, "common">) => {
  const endpoint = apiEndpoints.find(ep => ep.id === id && (product ? ep.product?.includes(product) : true))
    ?? apiEndpoints.find(ep => ep.id === id && ep.product?.includes("common"))
    ?? apiEndpoints.find(ep => ep.id === id);

  return endpoint ? applyProductEndpointExample(endpoint, product) : undefined;
};

export const getCategories = (product?: "scp" | "bcd" | "cno") => {
  const eps = product ? getEndpointsForProduct(product) : apiEndpoints;
  const cats: string[] = [];
  eps.forEach(ep => {
    if (!cats.includes(ep.category)) cats.push(ep.category);
  });
  return cats;
};
