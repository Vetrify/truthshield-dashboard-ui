// To parse this data:
//
//   import { Convert, Portal } from "./file";
//
//   const portal = Convert.toPortal(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Portal {
  companyID?: string;
  payments?: any[];
  products?: Product[];
  requestActions?: RequestAction[];
  requests?: Request[];
  subscriptions?: Subscription[];
  userInvitations?: UserInvitation[];
  users?: User[];
}

export interface Product {
  productID?: string;
  name?: string;
  subscriptionID?: string;
  id?: string;
  roles?: ProductRole[];
}

export interface ProductRole {
  description?: string;
  name?: string;
  userCap?: number;
}

export interface RequestAction {
  action?: string;
  reason?: string;
  requestID?: string;
}

export interface Request {
  actions?: Action[];
  cost?: string;
  id?: string;
  imageURL?: string;
  note?: string;
  productID?: string;
  recurring?: string;
  statusID?: string;
  statusTitle?: string;
  timestamp?: Date;
  title?: string;
  type?: string;
  typeID?: string;
  typeTitle?: string;
  userID?: string;
}

export interface Action {
  description?: string;
  key?: string;
  reasonNeeded?: boolean;
}

export interface Subscription {
  application?: null;
  cancelAt?: Date;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: Date;
  collectionMethod?: string;
  created?: Date;
  createdByUserID?: string;
  currency?: string;
  currentPeriodEnd?: Date;
  currentPeriodStart?: Date;
  daysUntilDueue?: number;
  description?: null;
  discount?: null;
  endedAt?: null;
  id?: string;
  items?: SubscriptionItem[];
  status?: string;
  type?: string;
}

export interface SubscriptionItem {
  created?: number;
  id?: string;
  metadata?: Metadatum[];
  price?: Price;
  quantity?: number;
  subscription?: string;
}

export interface Metadatum {
  key?: string;
  value?: string;
}

export interface Price {
  active?: boolean;
  billingScheme?: string;
  created?: Date;
  externalProductID?: string;
  id?: string;
  lookupKey?: null;
  metadata?: Metadata;
  nickname?: null;
  productID?: string;
  recurring?: Recurring;
  taxBehavior?: string;
  unitAmount?: number;
}

export interface Metadata {}

export interface Recurring {
  aggregateUsage?: null;
  interval?: string;
  intervalCount?: number;
  usageType?: string;
}

export interface UserInvitation {
  access?: AccessElement[];
  email?: string;
  phone?: string;
}

export interface AccessElement {
  productID?: string;
  roles?: string[];
}

export interface User {
  email?: string;
  firstName?: string;
  id?: string;
  lastName?: string;
  roles?: AccessElement[];
  status?: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toPortal(json: string): Portal {
    return cast(JSON.parse(json), r('Portal'));
  }

  public static portalToJson(value: Portal): string {
    return JSON.stringify(uncast(value, r('Portal')), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
  if (key) {
    throw Error(
      `Invalid value for key "${key}". Expected type ${JSON.stringify(
        typ
      )} but got ${JSON.stringify(val)}`
    );
  }
  throw Error(
    `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`
  );
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue('array', val);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue('Date', val);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue('object', val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === 'object' && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty('props')
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  Portal: o(
    [
      { json: 'companyId', js: 'companyID', typ: u(undefined, '') },
      { json: 'payments', js: 'payments', typ: u(undefined, a('any')) },
      { json: 'products', js: 'products', typ: u(undefined, a(r('Product'))) },
      {
        json: 'requestActions',
        js: 'requestActions',
        typ: u(undefined, a(r('RequestAction'))),
      },
      { json: 'requests', js: 'requests', typ: u(undefined, a(r('Request'))) },
      {
        json: 'subscriptions',
        js: 'subscriptions',
        typ: u(undefined, a(r('Subscription'))),
      },
      {
        json: 'userInvitations',
        js: 'userInvitations',
        typ: u(undefined, a(r('UserInvitation'))),
      },
      { json: 'users', js: 'users', typ: u(undefined, a(r('User'))) },
    ],
    false
  ),
  Product: o(
    [
      { json: 'id:', js: 'productID', typ: u(undefined, '') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'subscriptionId', js: 'subscriptionID', typ: u(undefined, '') },
      { json: 'id', js: 'id', typ: u(undefined, '') },
      { json: 'roles', js: 'roles', typ: u(undefined, a(r('ProductRole'))) },
    ],
    false
  ),
  ProductRole: o(
    [
      { json: 'description', js: 'description', typ: u(undefined, '') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'userCap', js: 'userCap', typ: u(undefined, 3.14) },
    ],
    false
  ),
  RequestAction: o(
    [
      { json: 'action', js: 'action', typ: u(undefined, '') },
      { json: 'reason', js: 'reason', typ: u(undefined, '') },
      { json: 'requestId', js: 'requestID', typ: u(undefined, '') },
    ],
    false
  ),
  Request: o(
    [
      { json: 'actions', js: 'actions', typ: u(undefined, a(r('Action'))) },
      { json: 'cost', js: 'cost', typ: u(undefined, '') },
      { json: 'id', js: 'id', typ: u(undefined, '') },
      { json: 'imageUrl', js: 'imageURL', typ: u(undefined, '') },
      { json: 'note', js: 'note', typ: u(undefined, '') },
      { json: 'productId', js: 'productID', typ: u(undefined, '') },
      { json: 'recurring', js: 'recurring', typ: u(undefined, '') },
      { json: 'statusId', js: 'statusID', typ: u(undefined, '') },
      { json: 'statusTitle', js: 'statusTitle', typ: u(undefined, '') },
      { json: 'timestamp', js: 'timestamp', typ: u(undefined, Date) },
      { json: 'title', js: 'title', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: u(undefined, '') },
      { json: 'typeId', js: 'typeID', typ: u(undefined, '') },
      { json: 'typeTitle', js: 'typeTitle', typ: u(undefined, '') },
      { json: 'userId', js: 'userID', typ: u(undefined, '') },
    ],
    false
  ),
  Action: o(
    [
      { json: 'description', js: 'description', typ: u(undefined, '') },
      { json: 'key', js: 'key', typ: u(undefined, '') },
      { json: 'reasonNeeded', js: 'reasonNeeded', typ: u(undefined, true) },
    ],
    false
  ),
  Subscription: o(
    [
      { json: 'application', js: 'application', typ: u(undefined, null) },
      { json: 'cancelAt', js: 'cancelAt', typ: u(undefined, Date) },
      {
        json: 'cancelAtPeriodEnd',
        js: 'cancelAtPeriodEnd',
        typ: u(undefined, true),
      },
      { json: 'canceledAt', js: 'canceledAt', typ: u(undefined, Date) },
      {
        json: 'collectionMethod',
        js: 'collectionMethod',
        typ: u(undefined, ''),
      },
      { json: 'created', js: 'created', typ: u(undefined, Date) },
      { json: 'createdByUserId', js: 'createdByUserID', typ: u(undefined, '') },
      { json: 'currency', js: 'currency', typ: u(undefined, '') },
      {
        json: 'currentPeriodEnd',
        js: 'currentPeriodEnd',
        typ: u(undefined, Date),
      },
      {
        json: 'currentPeriodStart',
        js: 'currentPeriodStart',
        typ: u(undefined, Date),
      },
      { json: 'daysUntilDueue', js: 'daysUntilDueue', typ: u(undefined, 3.14) },
      { json: 'description', js: 'description', typ: u(undefined, null) },
      { json: 'discount', js: 'discount', typ: u(undefined, null) },
      { json: 'endedAt', js: 'endedAt', typ: u(undefined, null) },
      { json: 'id', js: 'id', typ: u(undefined, '') },
      {
        json: 'items',
        js: 'items',
        typ: u(undefined, a(r('SubscriptionItem'))),
      },
      { json: 'status', js: 'status', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: u(undefined, '') },
    ],
    false
  ),
  SubscriptionItem: o(
    [
      { json: 'created', js: 'created', typ: u(undefined, 3.14) },
      { json: 'id', js: 'id', typ: u(undefined, '') },
      {
        json: 'metadata',
        js: 'metadata',
        typ: u(undefined, a(r('Metadatum'))),
      },
      { json: 'price', js: 'price', typ: u(undefined, r('Price')) },
      { json: 'quantity', js: 'quantity', typ: u(undefined, 3.14) },
      { json: 'subscription', js: 'subscription', typ: u(undefined, '') },
    ],
    false
  ),
  Metadatum: o(
    [
      { json: 'key', js: 'key', typ: u(undefined, '') },
      { json: 'value', js: 'value', typ: u(undefined, '') },
    ],
    false
  ),
  Price: o(
    [
      { json: 'active', js: 'active', typ: u(undefined, true) },
      { json: 'billing_scheme', js: 'billingScheme', typ: u(undefined, '') },
      { json: 'created', js: 'created', typ: u(undefined, Date) },
      {
        json: 'externalProductId',
        js: 'externalProductID',
        typ: u(undefined, ''),
      },
      { json: 'id', js: 'id', typ: u(undefined, '') },
      { json: 'lookup_key', js: 'lookupKey', typ: u(undefined, null) },
      { json: 'metadata', js: 'metadata', typ: u(undefined, r('Metadata')) },
      { json: 'nickname', js: 'nickname', typ: u(undefined, null) },
      { json: 'productId', js: 'productID', typ: u(undefined, '') },
      { json: 'recurring', js: 'recurring', typ: u(undefined, r('Recurring')) },
      { json: 'tax_behavior', js: 'taxBehavior', typ: u(undefined, '') },
      { json: 'unit_amount', js: 'unitAmount', typ: u(undefined, 3.14) },
    ],
    false
  ),
  Metadata: o([], false),
  Recurring: o(
    [
      {
        json: 'aggregate_usage',
        js: 'aggregateUsage',
        typ: u(undefined, null),
      },
      { json: 'interval', js: 'interval', typ: u(undefined, '') },
      { json: 'interval_count', js: 'intervalCount', typ: u(undefined, 3.14) },
      { json: 'usage_type', js: 'usageType', typ: u(undefined, '') },
    ],
    false
  ),
  UserInvitation: o(
    [
      {
        json: 'access',
        js: 'access',
        typ: u(undefined, a(r('AccessElement'))),
      },
      { json: 'email', js: 'email', typ: u(undefined, '') },
      { json: 'phone', js: 'phone', typ: u(undefined, '') },
    ],
    false
  ),
  AccessElement: o(
    [
      { json: 'productId', js: 'productID', typ: u(undefined, '') },
      { json: 'roles', js: 'roles', typ: u(undefined, a('')) },
    ],
    false
  ),
  User: o(
    [
      { json: 'email', js: 'email', typ: u(undefined, '') },
      { json: 'firstName', js: 'firstName', typ: u(undefined, '') },
      { json: 'id', js: 'id', typ: u(undefined, '') },
      { json: 'lastName', js: 'lastName', typ: u(undefined, '') },
      { json: 'roles', js: 'roles', typ: u(undefined, a(r('AccessElement'))) },
      { json: 'status', js: 'status', typ: u(undefined, '') },
    ],
    false
  ),
};
