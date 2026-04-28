export interface FieldDoc {
  path: string;
  type: string;
  required: boolean;
  description: string;
  constraints?: string;
  use?: string;
  restrictedValues?: string;
}

export interface EndpointFieldDocs {
  requestFields?: FieldDoc[];
  responseFields?: FieldDoc[];
  pathParams?: FieldDoc[];
}

export const endpointFieldDocs: Record<string, EndpointFieldDocs> = {
  "auth-token": {
    requestFields: [
      { path: "userId", type: "String", required: true, description: "The admin user ID provided during onboarding", constraints: "Must be a valid provisioned user" },
      { path: "password", type: "String", required: true, description: "The password associated with the admin user", constraints: "Must match the provisioned credentials" },
    ],
    responseFields: [
      { path: "status", type: "String", required: true, description: "Result of the login attempt", constraints: "\"success\" or \"failure\"" },
      { path: "message", type: "String", required: true, description: "Human-readable result message" },
      { path: "accessToken", type: "String", required: true, description: "JWT access token for authenticating subsequent API calls", constraints: "Bearer token, include in Authorization header" },
      { path: "refreshToken", type: "String", required: true, description: "JWT refresh token for obtaining new access tokens without re-authenticating" },
    ],
  },

  "create-account": {
    requestFields: [
      { path: "name", type: "String", required: true, description: "The display name for the enterprise account", use: "Length between 1 and 128" },
      { path: "type", type: "String", required: true, description: "The type of account", use: "ENTERPRISE", restrictedValues: "COMPANY, SUBSCRIBER" },
      { path: "status", type: "String", required: true, description: "The initial status of the account", use: "ACTIVE", restrictedValues: "INACTIVE" },
      { path: "relationship", type: "String", required: true, description: "The relationship type to TransUnion", use: "DIRECT", restrictedValues: "INDIRECT" },
      { path: "parent_account[]", type: "Array", required: true, description: "List of parent account IDs this account belongs to", use: "Must reference valid existing account IDs" },
      { path: "billing", type: "Object", required: true, description: "Billing configuration object with id, model, frequency", use: "model: OTHER; frequency: MONTHLY", restrictedValues: "model: TRANSACTION, SUBSCRIPTION; frequency: QUARTERLY, ANNUALLY" },
      { path: "service[]", type: "Array", required: true, description: "Services to provision for this account", use: "SDPR" },
      { path: "child_account_enabled", type: "Boolean", required: false, description: "Whether child accounts can be created under this account", use: "FALSE", restrictedValues: "TRUE" },
      { path: "domain", type: "String", required: false, description: "Domain associated with the account", use: "Valid domain (e.g., example.com)" },
      { path: "comment", type: "String", required: false, description: "Free-text comment", use: "Free text up to 256 characters" },
      { path: "contact[]", type: "Array", required: false, description: "Contact list with first_name, last_name, email, phone, type", use: "type: PRIMARY, SECONDARY" },
      { path: "address", type: "Object", required: false, description: "Physical address object", use: "street, city, postal_code, state_or_province, country_code (ISO 3166-1 alpha-2)" },
      { path: "start_date", type: "DateTime", required: true, description: "The contract start date", use: "RFC 1123 format" },
      { path: "end_date", type: "DateTime", required: true, description: "The contract end date", use: "RFC 1123 format, must be after start_date" },
      { path: "application[]", type: "Array", required: true, description: "Applications this account is provisioned for", use: "CCID, TCS" },
      { path: "ein", type: "String", required: false, description: "Employer Identification Number", use: "9 digits" },
      { path: "duns", type: "String", required: false, description: "DUNS number", use: "9 digits" },
      { path: "name_alias[]", type: "Array", required: false, description: "Alternative names for the account", use: "Up to 5 aliases, each 1-128 characters" },
      { path: "vetting.status", type: "String", required: false, description: "Vetting status", use: "PREVETTED", restrictedValues: "VETTING_SUBMITTED, VETTING_DEFERRED" },
      { path: "vetting.status_timestamp", type: "DateTime", required: false, description: "Vetting status timestamp", use: "RFC 1123 format" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique identifier assigned to the account", constraints: "Length between 4 and 10" },
      { path: "name", type: "String", required: true, description: "The display name for the enterprise account" },
      { path: "type", type: "String", required: true, description: "The type of account" },
      { path: "status", type: "String", required: true, description: "Current status of the account" },
      { path: "relationship", type: "String", required: true, description: "The relationship type to TransUnion" },
      { path: "parent_account[]", type: "Array", required: true, description: "Parent account IDs" },
      { path: "billing", type: "Object", required: true, description: "Billing configuration object" },
      { path: "service[]", type: "Array", required: true, description: "List of provisioned services, each with type and assigned id" },
      { path: "service[].id", type: "String", required: true, description: "Service ID assigned by the system" },
      { path: "child_account_enabled", type: "Boolean", required: true, description: "Whether child accounts are enabled" },
      { path: "domain", type: "String", required: false, description: "Domain associated with the account" },
      { path: "comment", type: "String", required: false, description: "Free-text comment about the account" },
      { path: "contact[]", type: "Array", required: false, description: "List of contacts with first_name, last_name, email, phone, type" },
      { path: "contact[].type", type: "String", required: true, description: "Contact type", constraints: "PRIMARY or SECONDARY" },
      { path: "address", type: "Object", required: false, description: "Physical address with street, city, postal_code, state_or_province, country_code" },
      { path: "start_date", type: "DateTime", required: true, description: "Contract start date" },
      { path: "end_date", type: "DateTime", required: true, description: "Contract end date" },
      { path: "application[]", type: "Array", required: true, description: "Provisioned applications" },
      { path: "ein", type: "String", required: false, description: "Employer Identification Number", constraints: "9 digits" },
      { path: "duns", type: "String", required: false, description: "Dun & Bradstreet DUNS number", constraints: "9 digits" },
      { path: "name_alias[]", type: "Array", required: false, description: "Alternative names or DBAs for the account" },
      { path: "vetting.status", type: "String", required: false, description: "Account vetting status", constraints: "PREVETTED, VETTING_SUBMITTED, or VETTING_DEFERRED" },
      { path: "vetting.status_timestamp", type: "DateTime", required: false, description: "When the vetting status was last updated", constraints: "RFC 1123 format" },
      { path: "created_by", type: "String", required: true, description: "User ID that created the object", constraints: "Length between 1 and 64" },
      { path: "created_date", type: "DateTime", required: true, description: "Timestamp when the object was created", constraints: "RFC 1123 format" },
      { path: "updated_by", type: "String", required: true, description: "User ID that last updated the object" },
      { path: "updated_date", type: "DateTime", required: true, description: "Timestamp of the last update" },
    ],
  },

  "get-account": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account to retrieve", constraints: "Length between 4 and 10" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique account identifier", constraints: "Length between 4 and 10" },
      { path: "name", type: "String", required: true, description: "Account display name" },
      { path: "type", type: "String", required: true, description: "Account type", constraints: "ENTERPRISE, COMPANY, or SUBSCRIBER" },
      { path: "status", type: "String", required: true, description: "Current account status", constraints: "ACTIVE or INACTIVE" },
      { path: "relationship", type: "String", required: true, description: "Relationship type to TransUnion" },
      { path: "parent_account[]", type: "Array", required: true, description: "Parent account IDs" },
      { path: "billing", type: "Object", required: true, description: "Billing configuration with id, model, and frequency" },
      { path: "service[]", type: "Array", required: true, description: "List of provisioned services (STIAS, SDPR, etc.)" },
      { path: "service[].type", type: "String", required: true, description: "Service type (e.g., SDPR, STIAS)" },
      { path: "service[].id", type: "String", required: true, description: "Service identifier" },
      { path: "child_account_enabled", type: "Boolean", required: true, description: "Whether child accounts are enabled" },
      { path: "start_date", type: "DateTime", required: true, description: "Contract start date", constraints: "RFC 1123 format" },
      { path: "end_date", type: "DateTime", required: true, description: "Contract end date", constraints: "RFC 1123 format" },
      { path: "application[]", type: "Array", required: true, description: "Provisioned applications", constraints: "CCID, TCS" },
      { path: "domain", type: "String", required: false, description: "Domain associated with the account" },
      { path: "comment", type: "String", required: false, description: "Free-text comment about the account" },
      { path: "contact[]", type: "Array", required: false, description: "List of contacts with first_name, last_name, email, phone, type" },
      { path: "contact[].type", type: "String", required: true, description: "Contact type", constraints: "PRIMARY or SECONDARY" },
      { path: "address", type: "Object", required: false, description: "Physical address with street, city, postal_code, state_or_province, country_code" },
      { path: "ein", type: "String", required: false, description: "Employer Identification Number", constraints: "9 digits" },
      { path: "duns", type: "String", required: false, description: "Dun & Bradstreet DUNS number", constraints: "9 digits" },
      { path: "name_alias[]", type: "Array", required: false, description: "Alternative names or DBAs for the account" },
      { path: "vetting.status", type: "String", required: false, description: "Account vetting status", constraints: "PREVETTED, VETTING_SUBMITTED, or VETTING_DEFERRED" },
      { path: "vetting.status_timestamp", type: "DateTime", required: false, description: "When the vetting status was last updated", constraints: "RFC 1123 format" },
      { path: "created_by", type: "String", required: true, description: "User ID that created the account" },
      { path: "created_date", type: "DateTime", required: true, description: "Account creation timestamp" },
      { path: "updated_by", type: "String", required: true, description: "User ID that last updated the account" },
      { path: "updated_date", type: "DateTime", required: true, description: "Last update timestamp" },
    ],
  },

  "update-account": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account to update", constraints: "Length between 4 and 10" },
    ],
    requestFields: [
      { path: "id", type: "String", required: true, description: "The account ID (must match the path parameter)", use: "Length between 4 and 10" },
      { path: "name", type: "String", required: true, description: "Updated account display name", use: "Length between 1 and 128" },
      { path: "type", type: "String", required: true, description: "Account type", use: "ENTERPRISE", restrictedValues: "COMPANY, SUBSCRIBER" },
      { path: "status", type: "String", required: true, description: "Account status", use: "ACTIVE", restrictedValues: "INACTIVE" },
      { path: "relationship", type: "String", required: true, description: "Relationship type", use: "DIRECT", restrictedValues: "INDIRECT" },
      { path: "parent_account[]", type: "Array", required: true, description: "Parent account IDs", use: "Must reference valid existing account IDs" },
      { path: "billing", type: "Object", required: true, description: "Billing configuration object with id, model, frequency", use: "model: OTHER; frequency: MONTHLY", restrictedValues: "model: TRANSACTION, SUBSCRIPTION; frequency: QUARTERLY, ANNUALLY" },
      { path: "service[]", type: "Array", required: true, description: "Services provisioned for this account", use: "SDPR" },
      { path: "child_account_enabled", type: "Boolean", required: false, description: "Enable or disable child accounts", use: "FALSE", restrictedValues: "TRUE" },
      { path: "domain", type: "String", required: false, description: "Domain associated with the account", use: "Valid domain (e.g., example.com)" },
      { path: "comment", type: "String", required: false, description: "Free-text comment", use: "Free text up to 256 characters" },
      { path: "contact[]", type: "Array", required: false, description: "Contact list with first_name, last_name, email, phone, type", use: "type: PRIMARY, SECONDARY" },
      { path: "address", type: "Object", required: false, description: "Physical address object", use: "street, city, postal_code, state_or_province, country_code (ISO 3166-1 alpha-2)" },
      { path: "start_date", type: "DateTime", required: true, description: "The contract start date", use: "RFC 1123 format" },
      { path: "end_date", type: "DateTime", required: true, description: "The contract end date", use: "RFC 1123 format, must be after start_date" },
      { path: "application[]", type: "Array", required: true, description: "Applications this account is provisioned for", use: "CCID, TCS" },
      { path: "ein", type: "String", required: false, description: "Employer Identification Number", use: "9 digits" },
      { path: "duns", type: "String", required: false, description: "DUNS number", use: "9 digits" },
      { path: "name_alias[]", type: "Array", required: false, description: "Alternative names for the account", use: "Up to 5 aliases, each 1-128 characters" },
      { path: "vetting.status", type: "String", required: false, description: "Vetting status", use: "PREVETTED", restrictedValues: "VETTING_SUBMITTED, VETTING_DEFERRED" },
      { path: "vetting.status_timestamp", type: "DateTime", required: false, description: "Vetting status timestamp", use: "RFC 1123 format" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Account identifier", constraints: "Length between 4 and 10" },
      { path: "name", type: "String", required: true, description: "Updated account name" },
      { path: "type", type: "String", required: true, description: "Account type", constraints: "ENTERPRISE, COMPANY, or SUBSCRIBER" },
      { path: "status", type: "String", required: true, description: "Current account status", constraints: "ACTIVE or INACTIVE" },
      { path: "relationship", type: "String", required: true, description: "Relationship type to TransUnion" },
      { path: "parent_account[]", type: "Array", required: true, description: "Parent account IDs" },
      { path: "billing", type: "Object", required: true, description: "Billing configuration with id, model, and frequency" },
      { path: "service[]", type: "Array", required: true, description: "List of provisioned services (STIAS, SDPR, etc.)" },
      { path: "service[].type", type: "String", required: true, description: "Service type (e.g., SDPR, STIAS)" },
      { path: "service[].id", type: "String", required: true, description: "Service identifier" },
      { path: "child_account_enabled", type: "Boolean", required: true, description: "Whether child accounts are enabled" },
      { path: "domain", type: "String", required: false, description: "Domain associated with the account" },
      { path: "comment", type: "String", required: false, description: "Free-text comment about the account" },
      { path: "contact[]", type: "Array", required: false, description: "List of contacts with first_name, last_name, email, phone, type" },
      { path: "contact[].type", type: "String", required: true, description: "Contact type", constraints: "PRIMARY or SECONDARY" },
      { path: "address", type: "Object", required: false, description: "Physical address with street, city, postal_code, state_or_province, country_code" },
      { path: "start_date", type: "DateTime", required: true, description: "Contract start date", constraints: "RFC 1123 format" },
      { path: "end_date", type: "DateTime", required: true, description: "Contract end date", constraints: "RFC 1123 format" },
      { path: "application[]", type: "Array", required: true, description: "Provisioned applications", constraints: "CCID, TCS" },
      { path: "ein", type: "String", required: false, description: "Employer Identification Number", constraints: "9 digits" },
      { path: "duns", type: "String", required: false, description: "Dun & Bradstreet DUNS number", constraints: "9 digits" },
      { path: "name_alias[]", type: "Array", required: false, description: "Alternative names or DBAs for the account" },
      { path: "vetting.status", type: "String", required: false, description: "Account vetting status", constraints: "PREVETTED, VETTING_SUBMITTED, or VETTING_DEFERRED" },
      { path: "vetting.status_timestamp", type: "DateTime", required: false, description: "When the vetting status was last updated", constraints: "RFC 1123 format" },
      { path: "created_by", type: "String", required: true, description: "Original creator user ID" },
      { path: "created_date", type: "DateTime", required: true, description: "Original creation date" },
      { path: "updated_by", type: "String", required: true, description: "User who performed the update" },
      { path: "updated_date", type: "DateTime", required: true, description: "Timestamp of this update" },
    ],
  },

  "delete-account": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account to delete", constraints: "All features, caller profiles, and TN assets must be removed first" },
    ],
  },

  "attach-account-tcs": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account", constraints: "Length between 4 and 10" },
    ],
    requestFields: [
      { path: "lead_generation", type: "String", required: true, description: "Entity that sold the service to the end customer", use: "TransUnion", restrictedValues: "US: AT&T, TNS, First Orion. CA: Bell Canada" },
      { path: "distributor[]", type: "Array", required: false, description: "List of distributors predefined per country", use: "US: [AT&T]", restrictedValues: "CA: [Bell Canada]" },
    ],
    responseFields: [
      { path: "account_id", type: "String", required: true, description: "The unique identifier assigned by AAM", constraints: "Length between 4 and 10" },
      { path: "lead_generation", type: "String", required: true, description: "Lead generation entity" },
      { path: "distributor[]", type: "Array", required: false, description: "Active distributors for this account" },
    ],
  },

  "get-account-tcs": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account", constraints: "Length between 4 and 10" },
    ],
    responseFields: [
      { path: "account_id", type: "String", required: true, description: "The unique identifier assigned by AAM", constraints: "Length between 4 and 10" },
      { path: "lead_generation", type: "String", required: true, description: "Lead generation entity", constraints: "Valid: AT&T, TransUnion, TNS, First Orion" },
      { path: "distributor[]", type: "Array", required: false, description: "List of active distributors", constraints: "Valid for US: [AT&T]" },
    ],
  },

  "attach-feature": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account", constraints: "Length between 4 and 10" },
    ],
    requestFields: [
      { path: "feature[]", type: "Array", required: true, description: "List of feature types to enable on the account", use: "AUTH-ONLY, RICH-BCD, AUTH-BCD, NAME-BCD, SPOOF-CALL-PROTECTION, CNO", restrictedValues: "DNO" },
      { path: "service[]", type: "Array", required: false, description: "List of service objects defining carrier partner configurations for each feature", use: "Provide one service entry per feature being attached" },
      { path: "service[].name", type: "String", required: true, description: "The service/feature name to configure partners for", use: "SPOOF-CALL-PROTECTION, AUTH-BCD, RICH-BCD, NAME-BCD, AUTH-ONLY, CNO" },
      { path: "service[].partner[]", type: "Array", required: true, description: "List of carrier partner configuration objects", use: "Include one entry per carrier partner being enabled" },
      { path: "service[].partner[].name", type: "String", required: true, description: "Carrier partner name", use: "att, verizon, tmobile" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Requested enablement status for the partner", use: "Enable-Requested", restrictedValues: "Disable-Requested, Suspend-Requested, Resume-Requested" },
    ],
    responseFields: [
      { path: "account_id", type: "String", required: true, description: "The account identifier" },
      { path: "feature[]", type: "Array", required: true, description: "List of attached features" },
      { path: "service[]", type: "Array", required: true, description: "Service configuration with partner statuses" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Current partner status after processing", constraints: "Transitions through: Enable-Requested → Enable-Processing → Enable-Completed (or Enable-Failed)" },
      { path: "workflow_status", type: "String", required: false, description: "Overall workflow status for suspend/resume operations", constraints: "Values: Suspend-Completed, Suspend-Initiated, Suspend-Eligible, Resume-Completed, Resume-Initiated, Resume-Eligible" },
      { path: "created_by", type: "String", required: true, description: "User who created the feature attachment" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp", constraints: "RFC 1123 format" },
    ],
  },

  "get-feature": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
    ],
    responseFields: [
      { path: "account_id", type: "String", required: true, description: "The account identifier" },
      { path: "feature[]", type: "Array", required: true, description: "List of attached feature types" },
      { path: "service[]", type: "Array", required: true, description: "Service configuration with partner statuses" },
      { path: "service[].name", type: "String", required: true, description: "Feature/service name" },
      { path: "service[].partner[]", type: "Array", required: true, description: "Carrier partner status list" },
      { path: "service[].partner[].name", type: "String", required: true, description: "Partner name", constraints: "att, verizon, or tmobile" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Current partner enablement status", constraints: "Full lifecycle: Enable-Requested → Enable-Processing → Enable-Completed/Failed → Disable-Requested → ..." },
      { path: "workflow_status", type: "String", required: false, description: "Suspend/resume workflow status" },
      { path: "created_by", type: "String", required: true, description: "Creator user ID" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp" },
      { path: "updated_by", type: "String", required: false, description: "Last updater user ID" },
      { path: "updated_date", type: "DateTime", required: false, description: "Last update timestamp" },
    ],
  },

  "get-partner-feature": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
      { path: "serviceName", type: "String", required: true, description: "Feature/service name to query", constraints: "e.g., SPOOF-CALL-PROTECTION, RICH-BCD" },
      { path: "partnerName", type: "String", required: true, description: "Carrier partner name", constraints: "att, verizon, or tmobile" },
    ],
    responseFields: [
      { path: "name", type: "String", required: true, description: "The carrier partner name" },
      { path: "status", type: "String", required: true, description: "Current enablement status for this partner/service combination", constraints: "Enable-Completed, Enable-Processing, Enable-Requested, Disable-Completed, etc." },
    ],
  },

  "delete-feature": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account", constraints: "All caller profiles and TN assets must be removed first. Partner statuses must not be in *-Requested or *-Processing states." },
    ],
  },

  "create-image": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account", constraints: "Length between 4 and 10" },
    ],
    requestFields: [
      { path: "url", type: "String", required: true, description: "Publicly accessible URL of the image to upload", use: "Valid HTTPS URL; image 256×256 px, JPEG/PNG/BMP, < 270 KB" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique image ID assigned by the system" },
      { path: "image_url", type: "String", required: true, description: "CDN-accessible URL of the processed image — use as image_url when creating an image profile" },
    ],
  },

  "get-image": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
      { path: "imageId", type: "String", required: true, description: "Unique image ID" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Image ID" },
      { path: "image_url", type: "String", required: true, description: "CDN-accessible URL of the image" },
    ],
  },

  "delete-image": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
      { path: "imageId", type: "String", required: true, description: "Unique image ID to delete", constraints: "Must not be referenced by any active image profiles" },
    ],
  },

  "create-image-profile": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account", constraints: "Length between 4 and 10" },
    ],
    requestFields: [
      { path: "name", type: "String", required: true, description: "Name for the image profile", use: "Length between 1 and 64 characters" },
      { path: "image_id", type: "String", required: true, description: "ID of the previously uploaded image (from Create Image response)", use: "Must reference an image_id returned by Create Image" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique image profile ID assigned by the system", constraints: "24-character hex string" },
      { path: "name", type: "String", required: true, description: "Name of the image profile" },
      { path: "image_id", type: "String", required: true, description: "ID of the linked image" },
      { path: "image_url", type: "String", required: true, description: "CDN URL of the linked image" },
      { path: "partner", type: "Array<Object>", required: true, description: "Carrier partner vetting statuses", constraints: "Each entry: { name, status }. Names: att, tmobile, verizon" },
      { path: "partner[].name", type: "String", required: true, description: "Carrier partner name", constraints: "att | tmobile | verizon" },
      { path: "partner[].status", type: "String", required: true, description: "Vetting/enablement status for the partner", constraints: "e.g. Enable-Requested, Enable-Completed" },
      { path: "vetting", type: "Object", required: true, description: "Overall vetting status and timestamp" },
      { path: "vetting.status", type: "String", required: true, description: "Vetting status", constraints: "e.g. VETTING_SUBMITTED, VETTING_SUCCESSFUL" },
      { path: "vetting.status_timestamp", type: "DateTime", required: true, description: "Timestamp of the vetting status", constraints: "RFC 1123 format" },
      { path: "created_by", type: "String", required: true, description: "User who created the image profile" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp", constraints: "RFC 1123 format" },
    ],
  },

  "get-image-profile": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
      { path: "imageProfileId", type: "String", required: true, description: "Unique image profile ID", constraints: "24-character hex string" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Image profile ID" },
      { path: "name", type: "String", required: true, description: "Image profile name" },
      { path: "account_id", type: "String", required: true, description: "The account this image profile belongs to" },
      { path: "image_id", type: "String", required: true, description: "ID of the linked image" },
      { path: "image_url", type: "String", required: true, description: "CDN URL of the linked image" },
      { path: "partner", type: "Array<Object>", required: true, description: "Carrier partner statuses populated after vetting approval", constraints: "Each entry: { name, status }. Names: att, tmobile, verizon" },
      { path: "partner[].name", type: "String", required: true, description: "Carrier partner name", constraints: "att | tmobile | verizon" },
      { path: "partner[].status", type: "String", required: true, description: "Enablement status for the partner", constraints: "e.g. Enable-Requested, Enable-Completed" },
      { path: "vetting", type: "Object", required: true, description: "Vetting status and timestamp" },
      { path: "vetting.status", type: "String", required: true, description: "Vetting status", constraints: "e.g. VETTING_SUBMITTED, VETTING_SUCCESSFUL" },
      { path: "vetting.status_timestamp", type: "DateTime", required: true, description: "Timestamp of the vetting status" },
      { path: "created_by", type: "String", required: true, description: "Creator user ID" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp" },
      { path: "updated_by", type: "String", required: true, description: "User who last updated the profile" },
      { path: "updated_date", type: "DateTime", required: true, description: "Last update timestamp" },
    ],
  },

  "delete-image-profile": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
      { path: "imageProfileId", type: "String", required: true, description: "Unique image profile ID to delete", constraints: "Must not be referenced by any active caller profiles" },
    ],
  },

  "attach-scp-caller-profile": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
    ],
    requestFields: [
      { path: "service[]", type: "Array", required: true, description: "List of service objects for the caller profile", use: "Two entries: CCID-ORIG and SPOOF-CALL-PROTECTION" },
      { path: "service[].name", type: "String", required: true, description: "Service name", use: "CCID-ORIG, SPOOF-CALL-PROTECTION" },
      { path: "service[].partner[]", type: "Array", required: true, description: "Carrier partner configurations", use: "Include one entry per carrier partner" },
      { path: "service[].partner[].name", type: "String", required: true, description: "Carrier partner name", use: "att, verizon, tmobile" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Initial review status", use: "TU-Review-Requested" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique caller profile ID assigned by the system", constraints: "24-character hex string" },
      { path: "name", type: "String", required: true, description: "System-generated profile name (e.g., Your Company Name_SCP_20260225-212320)" },
      { path: "account_id", type: "String", required: true, description: "The account this profile belongs to" },
      { path: "service[]", type: "Array", required: true, description: "Service configuration echoed back with partner statuses" },
      { path: "service[].name", type: "String", required: true, description: "Service name (CCID-ORIG, SPOOF-CALL-PROTECTION)" },
      { path: "service[].partner[]", type: "Array", required: true, description: "Carrier partner status entries" },
      { path: "service[].partner[].name", type: "String", required: true, description: "Carrier partner name", constraints: "att | tmobile | verizon" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Current partner status", constraints: "TU-Review-Requested → Enable-Requested → Enable-Processing → Enable-Completed" },
      { path: "created_by", type: "String", required: true, description: "User who created the profile" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp", constraints: "RFC 1123 format" },
    ],
  },

  "attach-bcd-caller-profile": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
    ],
    requestFields: [
      { path: "branded_caller_name", type: "String", required: true, description: "The business name to display on recipient devices", use: "Length between 1 and 32 characters" },
      { path: "call_reason", type: "String", required: true, description: "The reason/category for the call shown on display", use: "Length between 1 and 60 characters" },
      { path: "image_profile_id", type: "String", required: false, description: "ID of a previously uploaded image profile for logo display", use: "Must reference a valid image profile on the account" },
      { path: "service[]", type: "Array", required: true, description: "Service objects for BCD configuration", use: "Two entries: CCID-ORIG and RICH-BCD" },
      { path: "service[].name", type: "String", required: true, description: "Service name", use: "CCID-ORIG, RICH-BCD", restrictedValues: "AUTH-BCD, NAME-BCD, AUTH-ONLY" },
      { path: "service[].partner[]", type: "Array", required: true, description: "Carrier partner configurations", use: "Include one entry per carrier partner" },
      { path: "service[].partner[].name", type: "String", required: true, description: "Carrier partner name", use: "att, verizon, tmobile" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Initial review status", use: "TU-Review-Requested" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique caller profile ID", constraints: "24-character hex string" },
      { path: "name", type: "String", required: true, description: "System-generated profile name combining branded name, type, and timestamp" },
      { path: "account_id", type: "String", required: true, description: "The account this profile belongs to" },
      { path: "branded_caller_name", type: "String", required: true, description: "The branded business name" },
      { path: "call_reason", type: "String", required: true, description: "Call reason/category" },
      { path: "image_profile_id", type: "String", required: false, description: "Associated image profile ID" },
      { path: "service[]", type: "Array", required: true, description: "Service configuration with partner statuses" },
      { path: "service[].name", type: "String", required: true, description: "Service name (CCID-ORIG, RICH-BCD)" },
      { path: "service[].partner[]", type: "Array", required: true, description: "Carrier partner status entries" },
      { path: "service[].partner[].name", type: "String", required: true, description: "Carrier partner name", constraints: "att | tmobile | verizon" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Current partner status", constraints: "TU-Review-Requested → Enable-Requested → Enable-Processing → Enable-Completed" },
      { path: "created_by", type: "String", required: true, description: "User who created the profile" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp" },
    ],
  },

  "attach-auth-bcd-caller-profile": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
    ],
    requestFields: [
      { path: "branded_caller_name", type: "String", required: true, description: "The business name to display on recipient devices", use: "Length between 1 and 32 characters" },
      { path: "service[]", type: "Array", required: true, description: "Service objects for AUTH-BCD configuration", use: "Two entries: CCID-ORIG and AUTH-BCD" },
      { path: "service[].name", type: "String", required: true, description: "Service name", use: "CCID-ORIG, AUTH-BCD" },
      { path: "service[].partner[]", type: "Array", required: true, description: "Carrier partner configurations", use: "Include one entry per carrier partner" },
      { path: "service[].partner[].name", type: "String", required: true, description: "Carrier partner name", use: "att, verizon, tmobile" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Initial review status", use: "TU-Review-Requested" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique caller profile ID", constraints: "24-character hex string" },
      { path: "name", type: "String", required: true, description: "System-generated profile name (e.g., Your Company Name_BCD_Auth_20260225-212320)" },
      { path: "account_id", type: "String", required: true, description: "The account this profile belongs to" },
      { path: "branded_caller_name", type: "String", required: true, description: "The branded business name" },
      { path: "service[]", type: "Array", required: true, description: "Service configuration with partner statuses" },
      { path: "service[].name", type: "String", required: true, description: "Service name (CCID-ORIG, AUTH-BCD)" },
      { path: "service[].partner[]", type: "Array", required: true, description: "Carrier partner status entries" },
      { path: "service[].partner[].name", type: "String", required: true, description: "Carrier partner name", constraints: "att | tmobile | verizon" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Current partner status", constraints: "TU-Review-Requested → Enable-Requested → Enable-Processing → Enable-Completed" },
      { path: "created_by", type: "String", required: true, description: "User who created the profile" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp", constraints: "RFC 1123 format" },
    ],
  },

  "attach-cno-caller-profile": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
    ],
    requestFields: [
      { path: "service[]", type: "Array", required: true, description: "List of service objects for the caller profile", use: "Two entries: CCID-ORIG and CNO" },
      { path: "service[].name", type: "String", required: true, description: "Service name", use: "CCID-ORIG, CNO" },
      { path: "service[].partner[]", type: "Array", required: true, description: "Carrier partner configurations", use: "Include one entry per carrier partner" },
      { path: "service[].partner[].name", type: "String", required: true, description: "Carrier partner name", use: "att, verizon, tmobile" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Initial review status", use: "TU-Review-Requested" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique caller profile ID assigned by the system", constraints: "24-character hex string" },
      { path: "name", type: "String", required: true, description: "System-generated profile name (e.g., Your Company Name_CNO_20260225-212320)" },
      { path: "account_id", type: "String", required: true, description: "The account this profile belongs to" },
      { path: "service[]", type: "Array", required: true, description: "Service configuration echoed back with partner statuses" },
      { path: "service[].name", type: "String", required: true, description: "Service name (CCID-ORIG, CNO)" },
      { path: "service[].partner[]", type: "Array", required: true, description: "Carrier partner status entries" },
      { path: "service[].partner[].name", type: "String", required: true, description: "Carrier partner name", constraints: "att | tmobile | verizon" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Current partner status", constraints: "TU-Review-Requested → Enable-Requested → Enable-Processing → Enable-Completed" },
      { path: "created_by", type: "String", required: true, description: "User who created the profile" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp", constraints: "RFC 1123 format" },
    ],
  },

  "get-caller-profile": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
      { path: "profileId", type: "String", required: true, description: "Unique caller profile ID", constraints: "24-character hex string" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Caller profile ID" },
      { path: "name", type: "String", required: true, description: "System-generated profile name" },
      { path: "account_id", type: "String", required: true, description: "Account the profile belongs to" },
      { path: "branded_caller_name", type: "String", required: false, description: "Branded name (BCD profiles only)" },
      { path: "call_reason", type: "String", required: false, description: "Call reason (BCD profiles only)" },
      { path: "image_profile_id", type: "String", required: false, description: "Image profile ID (Rich BCD only)" },
      { path: "service[]", type: "Array", required: true, description: "Service configuration with current partner statuses" },
      { path: "service[].name", type: "String", required: true, description: "Service name (e.g., CCID-ORIG, RICH-BCD, AUTH-BCD, SPOOF-CALL-PROTECTION, CNO)" },
      { path: "service[].partner[]", type: "Array", required: true, description: "Carrier partner status entries" },
      { path: "service[].partner[].name", type: "String", required: true, description: "Carrier partner name", constraints: "att | tmobile | verizon" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Partner enablement status", constraints: "Enable-Completed indicates fully activated" },
      { path: "created_by", type: "String", required: true, description: "Creator user ID" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp" },
    ],
  },

  "list-caller-profiles": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
    ],
    responseFields: [
      { path: "[]", type: "Array", required: true, description: "Array of caller profile objects" },
      { path: "[].id", type: "String", required: true, description: "Caller profile ID", constraints: "24-character hex string" },
      { path: "[].name", type: "String", required: true, description: "System-generated profile name" },
      { path: "[].account_id", type: "String", required: true, description: "Account the profile belongs to" },
      { path: "[].branded_caller_name", type: "String", required: false, description: "Branded business name (BCD profiles only)" },
      { path: "[].call_reason", type: "String", required: false, description: "Call reason (Rich BCD only)" },
      { path: "[].image_profile_id", type: "String", required: false, description: "Linked image profile ID (Rich BCD only)" },
      { path: "[].service[]", type: "Array", required: true, description: "Service configuration with partner statuses" },
      { path: "[].service[].name", type: "String", required: true, description: "Service name" },
      { path: "[].service[].partner[]", type: "Array", required: true, description: "Carrier partner status entries" },
      { path: "[].service[].partner[].name", type: "String", required: true, description: "Carrier partner name", constraints: "att | tmobile | verizon" },
      { path: "[].service[].partner[].status", type: "String", required: true, description: "Current partner enablement status" },
      { path: "[].created_by", type: "String", required: true, description: "Creator user ID" },
      { path: "[].created_date", type: "DateTime", required: true, description: "Creation timestamp" },
    ],
  },

  "create-tn-asset": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account", constraints: "Length between 4 and 10" },
    ],
    requestFields: [
      { path: "full_ownership", type: "Boolean", required: true, description: "Whether the TN is fully owned by the customer (carrier-vetted)", use: "TRUE", restrictedValues: "FALSE (use Create TN Asset BYOC instead)" },
      { path: "tn.orig.start", type: "String", required: true, description: "Telephone number in E.164 format", use: "Format: +[0-9]{1,3}.[0-9]{1,14}" },
      { path: "caller_profile_id", type: "String", required: true, description: "ID of the caller profile to associate with this TN", use: "Must reference a valid caller profile on the account" },
      { path: "label[]", type: "Array", required: false, description: "User-defined labels to categorize/track telephone numbers", use: "Up to 5 labels, each 1-60 characters. Use $ as separator for structured labels" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique TN asset identifier", constraints: "24-character hex string" },
      { path: "state", type: "String", required: true, description: "Current state of the asset", constraints: "ACTIVE, INACTIVE, VETTING, VETTING_DEFERRED, HOLD, DELETE, NONE, UNKNOWN" },
      { path: "account_id", type: "String", required: true, description: "Account this TN belongs to" },
      { path: "vetter", type: "String", required: true, description: "Entity performing vetting", constraints: "CARRIER (for full_ownership=true) or NEUSTAR (for BYOC)" },
      { path: "priority", type: "Integer", required: true, description: "Priority value for asset selection", constraints: "Lower number = higher priority. Default: 0" },
      { path: "full_ownership", type: "Boolean", required: true, description: "Ownership flag as submitted" },
      { path: "owner_type", type: "String", required: true, description: "Type of TN owner", constraints: "carrier, enterprise, or subscriber" },
      { path: "parent_account_id", type: "String", required: true, description: "Parent account ID" },
      { path: "super_account_id", type: "String", required: true, description: "Top-level account ID in the hierarchy" },
      { path: "tn.orig.start", type: "String", required: true, description: "The telephone number" },
      { path: "tn.orig.count", type: "Integer", required: true, description: "Number of TNs in range", constraints: "Always 1 (ranges not supported)" },
      { path: "vetting.request_timestamp", type: "DateTime", required: true, description: "When the vetting request was submitted", constraints: "RFC 1123 format" },
      { path: "vetting.status", type: "String", required: true, description: "Vetting status", constraints: "PREVETTED, VETTING_SUBMITTED, or VETTING_DEFERRED" },
      { path: "vetting.status_timestamp", type: "DateTime", required: true, description: "When vetting status last changed" },
      { path: "caller_profile", type: "String", required: true, description: "Name of the associated caller profile" },
      { path: "caller_profile_id", type: "String", required: true, description: "ID of the associated caller profile" },
      { path: "tagging_status", type: "Object", required: false, description: "Tagging status per partner", constraints: "Partner names (att, verizon, tmobile) mapped to status: TG (Tagged), AP (Appeal Pending), AG (Appeal Granted), AD (Appeal Declined), CIP (Customer Input Pending)" },
      { path: "partner_data[]", type: "Array", required: true, description: "Per-feature partner enablement data" },
      { path: "partner_data[].name", type: "String", required: true, description: "Feature name", constraints: "e.g., RICH-BCD, SPOOF-CALL-PROTECTION" },
      { path: "partner_data[].partner[]", type: "Array", required: true, description: "Partner statuses for this feature" },
      { path: "partner_data[].partner[].name", type: "String", required: true, description: "Carrier partner name", constraints: "att, verizon, or tmobile" },
      { path: "partner_data[].partner[].status", type: "String", required: true, description: "Partner activation status", constraints: "Enable-Requested → Enable-Processing → Enable-Completed" },
      { path: "partner_data[].partner[].caller_profile", type: "String", required: true, description: "Caller profile name used by this partner" },
      { path: "created_by", type: "String", required: true, description: "User who created the asset" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp" },
    ],
  },

  "create-tn-asset-byoc": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
    ],
    requestFields: [
      { path: "full_ownership", type: "Boolean", required: true, description: "Must be false for BYOC assets", use: "FALSE", restrictedValues: "TRUE (use Create TN Asset instead)" },
      { path: "tn.orig.start", type: "String", required: true, description: "Telephone number in E.164 format", use: "Format: +[0-9]{1,3}.[0-9]{1,14}" },
      { path: "caller_profile_id", type: "String", required: true, description: "ID of the caller profile to associate", use: "Must reference a valid caller profile on the account" },
      { path: "label[]", type: "Array", required: false, description: "User-defined labels", use: "Up to 5 labels, each 1-60 characters" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique TN asset identifier" },
      { path: "state", type: "String", required: true, description: "Asset state — typically VETTING for BYOC numbers", constraints: "BYOC numbers enter VETTING state (vs ACTIVE for full ownership)" },
      { path: "vetter", type: "String", required: true, description: "Vetting entity — NEUSTAR for BYOC assets", constraints: "NEUSTAR (third-party vetting required for BYOC)" },
      { path: "full_ownership", type: "Boolean", required: true, description: "false for BYOC" },
      { path: "vetting.status", type: "String", required: true, description: "BYOC vetting status", constraints: "VETTING_DEFERRED → VETTING_SUBMITTED → PREVETTED" },
      { path: "partner_data[]", type: "Array", required: true, description: "Per-feature partner data (same structure as full ownership)" },
      { path: "created_by", type: "String", required: true, description: "Creator user ID" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp" },
    ],
  },

  "update-tn-asset": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
      { path: "tnAssetId", type: "String", required: true, description: "Unique TN asset ID to update", constraints: "24-character hex string" },
    ],
    requestFields: [
      { path: "full_ownership", type: "Boolean", required: false, description: "Update ownership flag", use: "Match the original asset's ownership type" },
      { path: "tn.orig.start", type: "String", required: false, description: "Telephone number (cannot be changed for existing assets)", use: "Format: +[0-9]{1,3}.[0-9]{1,14}" },
      { path: "caller_profile_id", type: "String", required: false, description: "New caller profile ID to reassign the TN", use: "Must reference a valid caller profile on the account" },
      { path: "label[]", type: "Array", required: false, description: "Updated labels", use: "Up to 5 labels, each 1-60 characters" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "TN asset ID" },
      { path: "state", type: "String", required: true, description: "Current asset state" },
      { path: "label[]", type: "Array", required: false, description: "Updated label values" },
      { path: "caller_profile_id", type: "String", required: true, description: "Updated caller profile association" },
      { path: "updated_by", type: "String", required: true, description: "User who performed the update" },
      { path: "updated_date", type: "DateTime", required: true, description: "Update timestamp" },
    ],
  },

  "get-tn-asset": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
      { path: "assetId", type: "String", required: true, description: "Unique TN asset ID", constraints: "24-character hex string" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "TN asset identifier" },
      { path: "state", type: "String", required: true, description: "Current asset state", constraints: "ACTIVE, VETTING, INACTIVE, etc." },
      { path: "account_id", type: "String", required: true, description: "Owning account" },
      { path: "vetter", type: "String", required: true, description: "Vetting entity" },
      { path: "full_ownership", type: "Boolean", required: true, description: "Ownership flag" },
      { path: "tn", type: "Object", required: true, description: "Telephone number container" },
      { path: "tn.orig", type: "Object", required: true, description: "Originating TN range definition" },
      { path: "tn.orig.start", type: "String", required: true, description: "Telephone number in E.164 format" },
      { path: "tn.orig.count", type: "Integer", required: true, description: "Number of TNs in range — always 1" },
      { path: "vetting", type: "Object", required: true, description: "Vetting status object" },
      { path: "vetting.request_timestamp", type: "DateTime", required: true, description: "When the vetting request was submitted", constraints: "RFC 1123 format" },
      { path: "vetting.status", type: "String", required: true, description: "Current vetting status", constraints: "PREVETTED, VETTING_SUBMITTED, VETTING_DEFERRED" },
      { path: "vetting.status_timestamp", type: "DateTime", required: true, description: "When vetting status last changed", constraints: "RFC 1123 format" },
      { path: "caller_profile", type: "String", required: true, description: "Associated caller profile name" },
      { path: "caller_profile_id", type: "String", required: true, description: "Associated caller profile ID" },
      { path: "tagging_status", type: "Map", required: false, description: "Per-partner tagging status — keys are partner names (att, verizon, tmobile)", constraints: "Values: TG (Tagged), AP (Appeal Pending), AG (Appeal Granted), AD (Appeal Declined), CIP (Customer Input Pending)" },
      { path: "partner_data[]", type: "Array", required: true, description: "Per-feature partner enablement data with statuses" },
      { path: "partner_data[].name", type: "String", required: true, description: "Feature name", constraints: "e.g., RICH-BCD, AUTH-BCD, SPOOF-CALL-PROTECTION, CNO" },
      { path: "partner_data[].partner[]", type: "Array", required: true, description: "Partner status entries for this feature" },
      { path: "partner_data[].partner[].name", type: "String", required: true, description: "Carrier partner name", constraints: "att | tmobile | verizon" },
      { path: "partner_data[].partner[].status", type: "String", required: true, description: "Partner activation status", constraints: "Enable-Requested → Enable-Processing → Enable-Completed" },
      { path: "partner_data[].partner[].caller_profile", type: "String", required: true, description: "Caller profile name used by this partner" },
      { path: "created_by", type: "String", required: true, description: "Creator" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp" },
      { path: "updated_by", type: "String", required: false, description: "Last updater" },
      { path: "updated_date", type: "DateTime", required: false, description: "Last update timestamp" },
    ],
  },

  "list-tn-assets": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
    ],
    responseFields: [
      { path: "[]", type: "Array", required: true, description: "Array of TN asset objects" },
      { path: "[].id", type: "String", required: true, description: "TN asset identifier", constraints: "24-character hex string" },
      { path: "[].state", type: "String", required: true, description: "Current asset state", constraints: "ACTIVE, VETTING, INACTIVE, HOLD, DELETE, NONE, UNKNOWN" },
      { path: "[].type", type: "String", required: true, description: "Asset type identifier", constraints: "tcstn" },
      { path: "[].version", type: "String", required: true, description: "API version of the asset", constraints: "v4" },
      { path: "[].account_id", type: "String", required: true, description: "Account this TN belongs to" },
      { path: "[].account_name", type: "String", required: true, description: "Name of the account that owns the TN" },
      { path: "[].vetter", type: "String", required: true, description: "Entity performing vetting", constraints: "CARRIER or NEUSTAR" },
      { path: "[].priority", type: "Integer", required: true, description: "Priority value (lower = higher priority)" },
      { path: "[].full_ownership", type: "Boolean", required: true, description: "Whether the TN is fully owned by the customer" },
      { path: "[].owner_type", type: "String", required: true, description: "Type of TN owner", constraints: "carrier, enterprise, or subscriber" },
      { path: "[].parent_account_id", type: "String", required: true, description: "Parent account ID" },
      { path: "[].super_account_id", type: "String", required: true, description: "Top-level account ID in the hierarchy" },
      { path: "[].tn", type: "Object", required: true, description: "Telephone number container with orig.start and orig.count" },
      { path: "[].tn.orig.start", type: "String", required: true, description: "Telephone number in E.164 format" },
      { path: "[].tn.orig.count", type: "Integer", required: true, description: "Always 1" },
      { path: "[].vetting", type: "Object", required: true, description: "Vetting status object" },
      { path: "[].vetting.request_timestamp", type: "DateTime", required: true, description: "When the vetting request was submitted" },
      { path: "[].vetting.status", type: "String", required: true, description: "Current vetting status" },
      { path: "[].vetting.status_timestamp", type: "DateTime", required: true, description: "When vetting status last changed" },
      { path: "[].caller_profile", type: "String", required: true, description: "Associated caller profile name" },
      { path: "[].caller_profile_id", type: "String", required: true, description: "Associated caller profile ID" },
      { path: "[].tagging_status", type: "Map", required: false, description: "Per-partner tagging status (partner name → tag code)" },
      { path: "[].partner_data[]", type: "Array", required: true, description: "Per-feature partner enablement data" },
      { path: "[].partner_data[].name", type: "String", required: true, description: "Feature name (e.g., RICH-BCD, SPOOF-CALL-PROTECTION)" },
      { path: "[].partner_data[].partner[]", type: "Array", required: true, description: "Partner status entries" },
      { path: "[].partner_data[].partner[].name", type: "String", required: true, description: "Carrier partner name", constraints: "att | tmobile | verizon" },
      { path: "[].partner_data[].partner[].status", type: "String", required: true, description: "Partner activation status" },
      { path: "[].partner_data[].partner[].caller_profile", type: "String", required: true, description: "Caller profile name used by this partner" },
      { path: "[].created_by", type: "String", required: true, description: "Creator user ID" },
      { path: "[].created_date", type: "DateTime", required: true, description: "Creation timestamp" },
      { path: "[].updated_by", type: "String", required: false, description: "Last updater user ID" },
      { path: "[].updated_date", type: "DateTime", required: false, description: "Last update timestamp" },
    ],
  },

  "delete-tn-asset": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
      { path: "tnAssetId", type: "String", required: true, description: "Unique TN asset ID to delete", constraints: "The TN will be deactivated and removed from all partner networks" },
    ],
  },
};
