// Code generated by wunderctl. DO NOT EDIT.



export interface AdminPortalResponse {
	data?: AdminPortalResponseData;
	errors?: ReadonlyArray<GraphQLError>;
}

export interface AdminPortalResponseData {
	searchAccount?: {
		companyId: string;
		products: {
			id: string;
			name: string;
			subscriptionIds?: string[];
			roles: {
				name: string;
				description: string;
				userCap: number;
			}[];
		}[];
		subscriptions: {
			id: string;
			application: string;
			status: string;
			cancelAt: string;
			cancelAtPeriodEnd: boolean;
			canceledAt: string;
			collectionMethod: string;
			created: string;
			createdByUserId: string;
			currentPeriodEnd: string;
			currentPeriodStart: string;
			daysUntilDueue: number;
			description: string;
			discount: string;
			endedAt: string;
			currency: string;
			type: string;
			items: {
				id: string;
				created: number;
				metadata: {
					name?: string;
					type?: string;
					value?: string;
				}[];
				price: JSONValue;
				quantity: number;
				subscription: string;
			}[];
		}[];
		users: {
			id: string;
			firstName: string;
			lastName: string;
			email: string;
			status: string;
			roles: {
				productId: string;
				roles: string[];
			}[];
		}[];
		requests: {
			id: string;
			type: string;
			title: string;
			imageUrl: string;
			timestamp: string;
			cost: string;
			recurring: string;
			note: string;
			userId: string;
			statusId: string;
			statusTitle: string;
			typeId: string;
			typeTitle: string;
			productId: string;
			actions: {
				key: string;
				description: string;
				reasonNeeded: boolean;
			}[];
		}[];
		actionRequests: {
			requestId?: string;
			action: string;
			reason?: string;
		}[];
		userInvitations: {
			email: string;
			phone: string;
			access: {
				productId: string;
				roles: string[];
			}[];
		}[];
		payments: {
			id: string;
			amount: number;
			timestamp: string;
		}[];
	}[];
}

export type JSONValue = string | number | boolean | JSONObject | Array<JSONValue>;

export type JSONObject = { [key: string]: JSONValue };

export interface GraphQLError {
	message: string;
	path?: ReadonlyArray<string | number>;
}
