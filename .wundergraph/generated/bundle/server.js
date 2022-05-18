var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// wundergraph.server.ts
var wundergraph_server_exports = {};
__export(wundergraph_server_exports, {
  default: () => wundergraph_server_default
});
module.exports = __toCommonJS(wundergraph_server_exports);
var import_graphql = require("graphql");
var import_sdk = require("@wundergraph/sdk");

// ../src/utils/generated/ViewModel.ts
var Convert = class {
  static toPortal(json) {
    return cast(JSON.parse(json), r("Portal"));
  }
  static portalToJson(value) {
    return JSON.stringify(uncast(value, r("Portal")), null, 2);
  }
};
function invalidValue(typ, val, key = "") {
  if (key) {
    throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
  }
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}
function jsonToJSProps(typ) {
  if (typ.jsonToJS === void 0) {
    const map = {};
    typ.props.forEach((p) => map[p.json] = { key: p.js, typ: p.typ });
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}
function jsToJSONProps(typ) {
  if (typ.jsToJSON === void 0) {
    const map = {};
    typ.props.forEach((p) => map[p.js] = { key: p.json, typ: p.typ });
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}
function transform(val, typ, getProps, key = "") {
  function transformPrimitive(typ2, val2) {
    if (typeof typ2 === typeof val2)
      return val2;
    return invalidValue(typ2, val2, key);
  }
  function transformUnion(typs, val2) {
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ2 = typs[i];
      try {
        return transform(val2, typ2, getProps);
      } catch (_) {
      }
    }
    return invalidValue(typs, val2);
  }
  function transformEnum(cases, val2) {
    if (cases.indexOf(val2) !== -1)
      return val2;
    return invalidValue(cases, val2);
  }
  function transformArray(typ2, val2) {
    if (!Array.isArray(val2))
      return invalidValue("array", val2);
    return val2.map((el) => transform(el, typ2, getProps));
  }
  function transformDate(val2) {
    if (val2 === null) {
      return null;
    }
    const d = new Date(val2);
    if (isNaN(d.valueOf())) {
      return invalidValue("Date", val2);
    }
    return d;
  }
  function transformObject(props, additional, val2) {
    if (val2 === null || typeof val2 !== "object" || Array.isArray(val2)) {
      return invalidValue("object", val2);
    }
    const result = {};
    Object.getOwnPropertyNames(props).forEach((key2) => {
      const prop = props[key2];
      const v = Object.prototype.hasOwnProperty.call(val2, key2) ? val2[key2] : void 0;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val2).forEach((key2) => {
      if (!Object.prototype.hasOwnProperty.call(props, key2)) {
        result[key2] = transform(val2[key2], additional, getProps, key2);
      }
    });
    return result;
  }
  if (typ === "any")
    return val;
  if (typ === null) {
    if (val === null)
      return val;
    return invalidValue(typ, val);
  }
  if (typ === false)
    return invalidValue(typ, val);
  while (typeof typ === "object" && typ.ref !== void 0) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ))
    return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val) : typ.hasOwnProperty("arrayItems") ? transformArray(typ.arrayItems, val) : typ.hasOwnProperty("props") ? transformObject(getProps(typ), typ.additional, val) : invalidValue(typ, val);
  }
  if (typ === Date && typeof val !== "number")
    return transformDate(val);
  return transformPrimitive(typ, val);
}
function cast(val, typ) {
  return transform(val, typ, jsonToJSProps);
}
function uncast(val, typ) {
  return transform(val, typ, jsToJSONProps);
}
function a(typ) {
  return { arrayItems: typ };
}
function u(...typs) {
  return { unionMembers: typs };
}
function o(props, additional) {
  return { props, additional };
}
function r(name) {
  return { ref: name };
}
var typeMap = {
  Portal: o([
    { json: "companyId", js: "companyID", typ: u(void 0, "") },
    { json: "payments", js: "payments", typ: u(void 0, a("any")) },
    { json: "products", js: "products", typ: u(void 0, a(r("Product"))) },
    {
      json: "requestActions",
      js: "requestActions",
      typ: u(void 0, a(r("RequestAction")))
    },
    { json: "requests", js: "requests", typ: u(void 0, a(r("Request"))) },
    {
      json: "subscriptions",
      js: "subscriptions",
      typ: u(void 0, a(r("Subscription")))
    },
    {
      json: "userInvitations",
      js: "userInvitations",
      typ: u(void 0, a(r("UserInvitation")))
    },
    { json: "users", js: "users", typ: u(void 0, a(r("User"))) }
  ], false),
  Product: o([
    { json: "id:", js: "productID", typ: u(void 0, "") },
    { json: "name", js: "name", typ: u(void 0, "") },
    { json: "subscriptionId", js: "subscriptionID", typ: u(void 0, "") },
    { json: "id", js: "id", typ: u(void 0, "") },
    { json: "roles", js: "roles", typ: u(void 0, a(r("ProductRole"))) }
  ], false),
  ProductRole: o([
    { json: "description", js: "description", typ: u(void 0, "") },
    { json: "name", js: "name", typ: u(void 0, "") },
    { json: "userCap", js: "userCap", typ: u(void 0, 3.14) }
  ], false),
  RequestAction: o([
    { json: "action", js: "action", typ: u(void 0, "") },
    { json: "reason", js: "reason", typ: u(void 0, "") },
    { json: "requestId", js: "requestID", typ: u(void 0, "") }
  ], false),
  Request: o([
    { json: "actions", js: "actions", typ: u(void 0, a(r("Action"))) },
    { json: "cost", js: "cost", typ: u(void 0, "") },
    { json: "id", js: "id", typ: u(void 0, "") },
    { json: "imageUrl", js: "imageURL", typ: u(void 0, "") },
    { json: "note", js: "note", typ: u(void 0, "") },
    { json: "productId", js: "productID", typ: u(void 0, "") },
    { json: "recurring", js: "recurring", typ: u(void 0, "") },
    { json: "statusId", js: "statusID", typ: u(void 0, "") },
    { json: "statusTitle", js: "statusTitle", typ: u(void 0, "") },
    { json: "timestamp", js: "timestamp", typ: u(void 0, Date) },
    { json: "title", js: "title", typ: u(void 0, "") },
    { json: "type", js: "type", typ: u(void 0, "") },
    { json: "typeId", js: "typeID", typ: u(void 0, "") },
    { json: "typeTitle", js: "typeTitle", typ: u(void 0, "") },
    { json: "userId", js: "userID", typ: u(void 0, "") }
  ], false),
  Action: o([
    { json: "description", js: "description", typ: u(void 0, "") },
    { json: "key", js: "key", typ: u(void 0, "") },
    { json: "reasonNeeded", js: "reasonNeeded", typ: u(void 0, true) }
  ], false),
  Subscription: o([
    { json: "application", js: "application", typ: u(void 0, null) },
    { json: "cancelAt", js: "cancelAt", typ: u(void 0, Date) },
    {
      json: "cancelAtPeriodEnd",
      js: "cancelAtPeriodEnd",
      typ: u(void 0, true)
    },
    { json: "canceledAt", js: "canceledAt", typ: u(void 0, Date) },
    {
      json: "collectionMethod",
      js: "collectionMethod",
      typ: u(void 0, "")
    },
    { json: "created", js: "created", typ: u(void 0, Date) },
    { json: "createdByUserId", js: "createdByUserID", typ: u(void 0, "") },
    { json: "currency", js: "currency", typ: u(void 0, "") },
    {
      json: "currentPeriodEnd",
      js: "currentPeriodEnd",
      typ: u(void 0, Date)
    },
    {
      json: "currentPeriodStart",
      js: "currentPeriodStart",
      typ: u(void 0, Date)
    },
    { json: "daysUntilDueue", js: "daysUntilDueue", typ: u(void 0, 3.14) },
    { json: "description", js: "description", typ: u(void 0, null) },
    { json: "discount", js: "discount", typ: u(void 0, null) },
    { json: "endedAt", js: "endedAt", typ: u(void 0, null) },
    { json: "id", js: "id", typ: u(void 0, "") },
    {
      json: "items",
      js: "items",
      typ: u(void 0, a(r("SubscriptionItem")))
    },
    { json: "status", js: "status", typ: u(void 0, "") },
    { json: "type", js: "type", typ: u(void 0, "") }
  ], false),
  SubscriptionItem: o([
    { json: "created", js: "created", typ: u(void 0, 3.14) },
    { json: "id", js: "id", typ: u(void 0, "") },
    {
      json: "metadata",
      js: "metadata",
      typ: u(void 0, a(r("Metadatum")))
    },
    { json: "price", js: "price", typ: u(void 0, r("Price")) },
    { json: "quantity", js: "quantity", typ: u(void 0, 3.14) },
    { json: "subscription", js: "subscription", typ: u(void 0, "") }
  ], false),
  Metadatum: o([
    { json: "key", js: "key", typ: u(void 0, "") },
    { json: "value", js: "value", typ: u(void 0, "") }
  ], false),
  Price: o([
    { json: "active", js: "active", typ: u(void 0, true) },
    { json: "billing_scheme", js: "billingScheme", typ: u(void 0, "") },
    { json: "created", js: "created", typ: u(void 0, Date) },
    {
      json: "externalProductId",
      js: "externalProductID",
      typ: u(void 0, "")
    },
    { json: "id", js: "id", typ: u(void 0, "") },
    { json: "lookup_key", js: "lookupKey", typ: u(void 0, null) },
    { json: "metadata", js: "metadata", typ: u(void 0, r("Metadata")) },
    { json: "nickname", js: "nickname", typ: u(void 0, null) },
    { json: "productId", js: "productID", typ: u(void 0, "") },
    { json: "recurring", js: "recurring", typ: u(void 0, r("Recurring")) },
    { json: "tax_behavior", js: "taxBehavior", typ: u(void 0, "") },
    { json: "unit_amount", js: "unitAmount", typ: u(void 0, 3.14) }
  ], false),
  Metadata: o([], false),
  Recurring: o([
    {
      json: "aggregate_usage",
      js: "aggregateUsage",
      typ: u(void 0, null)
    },
    { json: "interval", js: "interval", typ: u(void 0, "") },
    { json: "interval_count", js: "intervalCount", typ: u(void 0, 3.14) },
    { json: "usage_type", js: "usageType", typ: u(void 0, "") }
  ], false),
  UserInvitation: o([
    {
      json: "access",
      js: "access",
      typ: u(void 0, a(r("AccessElement")))
    },
    { json: "email", js: "email", typ: u(void 0, "") },
    { json: "phone", js: "phone", typ: u(void 0, "") }
  ], false),
  AccessElement: o([
    { json: "productId", js: "productID", typ: u(void 0, "") },
    { json: "roles", js: "roles", typ: u(void 0, a("")) }
  ], false),
  User: o([
    { json: "email", js: "email", typ: u(void 0, "") },
    { json: "firstName", js: "firstName", typ: u(void 0, "") },
    { json: "id", js: "id", typ: u(void 0, "") },
    { json: "lastName", js: "lastName", typ: u(void 0, "") },
    { json: "roles", js: "roles", typ: u(void 0, a(r("AccessElement"))) },
    { json: "status", js: "status", typ: u(void 0, "") }
  ], false)
};

// wundergraph.server.ts
var mockData = Convert.toPortal(`{
	"companyId": "",
	"products": [
		{
			"id:": "asdf",
			"name": "Product Innovation Engine",
			"subscriptionId": "asdf"
		},
		{
			"id": "asdfdds",
			"name": "Truthshield Admin",
			"roles": [
				{
					"name": "asdf",
					"description": "asdfdsalkjlkdf",
					"userCap": 10
				}
			]
		}
	],
	"subscriptions": [
		{
			"id": "sdfg",
			"application": null,
			"status": "active",
			"cancelAt": "2014-01-01T23:28:56.782Z",
			"cancelAtPeriodEnd": false,
			"canceledAt": "2014-01-01T23:28:56.782Z",
			"collectionMethod": "chargeAutomatically",
			"created": "2014-01-01T23:28:56.782Z",
			"createdByUserId": "asdfsadlku",
			"currentPeriodEnd": "2014-01-01T23:28:56.782Z",
			"currentPeriodStart": "2014-01-01T23:28:56.782Z",
			"daysUntilDueue": 2124,
			"description": null,
			"discount": null,
			"endedAt": null,
			"currency": "usd",
			"type": "recurring",
			"items": [
				{
					"id": "si_LfnIrDsdP91mbm",
					"created": 1652322278,
					"metadata": [
						{
							"key": "l",
							"value": "asdfd"
						}
					],
					"price": {
						"id": "asdfsad",
						"active": true,
						"billing_scheme": "per_unit",
						"created": "2014-01-01T23:28:56.782Z",
						"lookup_key": null,
						"metadata": {
						},
						"nickname": null,
						"productId": "prod_LfZhOsTBU6Bamg",
						"externalProductId": "asdfsdaf",
						"recurring": {
							"aggregate_usage": null,
							"interval": "month",
							"interval_count": 1,
							"usage_type": "licensed"
						},
						"tax_behavior": "unspecified",
						"unit_amount": 1.00
					},
					"quantity": 10,
					"subscription": "sub_1KyRhh2eZvKYlo2CDxgezPBB"
				}
			]
		}
	],
	"users": [
		{
			"id": "",
			"firstName": "Matt",
			"lastName": "Cochran",
			"email": "matthew@cochranweb.com",
			"status": "active",
			"roles": [
				{
					"productId": "dfad",
					"roles": [
						"admin"
					]
				},
				{
					"productId": "asdf",
					"roles": [
						"viewer"
					]
				}
			]
		}
	],
	"requests": [
		{
			"id": "BP-qVEiwy0iPrzakyHwOuw",
			"type": "add subscription",
			"title": "add sub",
			"imageUrl": "",
			"timestamp": "2014-01-01T23:28:56.782Z",
			"cost": "3.99",
			"recurring": "monthly",
			"note": "I need more ....",
			"userId": "thUNfu6acUO76YkL53T3yQ",
			"statusId": "5",
			"statusTitle": "pending",
			"typeId": "",
			"typeTitle": "",
			"productId": "Nvdf2Mj_n0yeR1lMvUg_RQ",
			"actions": [
				{
					"key": "approve",
					"description": "approve new user",
					"reasonNeeded": false
				},
				{
					"key": "deny",
					"description": "deny new user",
					"reasonNeeded": true
				}
			]
		}
	],
	"requestActions": [
		{
			"requestId": "BP-qVEiwy0iPrzakyHwOuw",
			"action": "approve",
			"reason": ""
		}
	],
	"userInvitations": [
		{
			"email": "asdfda@asdfasd.com",
			"phone": "654-654-6547",
			"access": [
				{
					"productId": "asdf",
					"roles": [
						"a",
						"b",
						"c"
					]
				}
			]
		}
	],
	"payments": [
	]
}`);
var wundergraph_server_default = (0, import_sdk.configureWunderGraphServer)((serverContext) => ({
  hooks: {
    queries: {},
    mutations: {}
  },
  graphqlServers: [
    {
      apiNamespace: "gql",
      serverName: "gql",
      schema: new import_graphql.GraphQLSchema({
        query: new import_graphql.GraphQLObjectType({
          name: "RootQueryType",
          fields: {
            hello: {
              type: import_graphql.GraphQLString,
              resolve() {
                return "world";
              }
            }
          }
        })
      })
    }
  ]
}));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
