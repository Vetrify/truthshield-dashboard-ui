import {GraphQLObjectType, GraphQLSchema, GraphQLString,} from 'graphql';
import {configureWunderGraphServer} from "@wundergraph/sdk";
import type {HooksConfig} from "./generated/wundergraph.hooks";
import type {InternalClient} from "./generated/wundergraph.internal.client";
import { Convert } from '../src/utils/generated/ViewModel';

const mockData = Convert.toPortal(`{
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

export default configureWunderGraphServer<HooksConfig,
    InternalClient>((serverContext) => ({
    hooks: {
        queries: {
					// AdminPortal: {
					// 	mockResolve: async (hookContext) => {
					// 			return {
					// 					data: {
					// 							getAppState: { 
					// 								id:"1234",
					// 							}},
					// 					};
					// 			},
					// 	},
			
          //   FakeWeather: {
          //       mockResolve: async (hookContext) => {
          //           return {
          //               data: {
          //                   getCityByName: {
          //                       id: "1",
          //                       name: "Berlin",
          //                       weather: {
          //                           summary: {
          //                               title: "Weather for Berlin",
          //                               description: "0°, cloudy",
          //                           },
          //                       },
          //                   },
          //               },
          //           };
          //       },
          //   },
        },
        mutations: {},
    },
    graphqlServers: [
        {
            apiNamespace: "gql",
            serverName: "gql",
            schema: new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'RootQueryType',
                    fields: {
                        hello: {
                            type: GraphQLString,
                            resolve() {
                                return 'world';
                            },
                        },
                    },
                }),
            }),
        }
    ]
}));
