import {
  Application,
  authProviders,
  configureWunderGraphApplication,
  cors,
  introspect,
  templates,
} from '@wundergraph/sdk';
import server from './wundergraph.server';
import operations from './wundergraph.operations';
// import linkBuilder from "./generated/linkbuilder";

// const spaceX = introspect.graphql({
//   apiNamespace: 'spacex',
//   url: 'https://api.spacex.land/graphql/',
// });

// const weather = introspect.graphql({
//   apiNamespace: 'weather',
//   url: 'https://graphql-weather-api.herokuapp.com/',
// });






/*const jsonPlaceholder = introspect.openApi({
    source: {
        kind: "file",
        filePath: "jsonplaceholder.v1.yaml"
    },
});

const jspTypesRenamed = transformApi.renameTypes(jsonPlaceholder,{
    from: "User",
    to: "JSP_User"
})

const jspFieldsRenamed = transformApi.renameFields(jspTypesRenamed,{
    typeName: "Query",
    fromFieldName: "users",
    toFieldName: "jsp_users",
})*/

/*
uncomment this section to create an API from multiple federated GraphQL upstreams

const federatedApi = introspect.federation({
    upstreams: [
        {
            url: "http://localhost:4001/graphql"
        },
        {
            url: "http://localhost:4002/graphql"
        },
        {
            url: "http://localhost:4003/graphql"
        },
        {
            url: "http://localhost:4004/graphql",
            // You can use headers to securely communicate with GraphQL upstreams
            headers: builder => builder
                // add a static Header to all upstream Requests
                .addStaticHeader("AuthToken","staticToken")
                // forward the client Request header Authorization to the upstream request using the same Header name
                .addClientRequestHeader("Authorization","Authorization")
                },
    ]
});*/


//create an API from an OpenAPI Specification


// const portal = introspect.openApi({
//   apiNamespace: 'portal',
//   source: {
//     kind: "file",
//     filePath: "/.wundergraph/openapi.1.0.0.yaml",
//   }
// });

const portal = introspect.openApi({
    apiNamespace: "portal",
    source: {
        kind: "file",
        filePath: "openapi.1.0.0.yaml"
    },
    headers: builder => builder
        // add a static Header to all upstream Requests
        .addStaticHeader("AuthToken","staticToken")
        // forward the client Request header Authorization to the upstream request using the same Header name
        .addClientRequestHeader("Authorization","Authorization")
});

/*
uncomment this section to create an API from a GraphQL upstream

const graphQLAPI = introspect.graphql({
    url: "http://localhost:4000",
    headers: builder => builder
        // add a static Header to all upstream Requests
        .addStaticHeader("AuthToken","staticToken")
        // forward the client Request header Authorization to the upstream request using the same Header name
        .addClientRequestHeader("Authorization","Authorization")
});*/

const myApplication = new Application({
  name: 'api',
  apis: [
    portal,
    // weather,
    // spaceX,
    //jspFieldsRenamed,
    /*federatedApi,
            openAPI,
            graphQLAPI*/
  ],
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
  application: myApplication,
  server,
  operations,
  // S3 Server
  // 1. Move to`../minio` and run (chmod +x && ./setup.sh) to create a S3 server.
  // 2. Comment out the section below and save!

  // Enable file upload functionality in your generated client
  // Minio credentials: minio / minio123
  // s3UploadProvider: [
  //     {
  //         name: "minio",
  //         endpoint: "127.0.0.1:9000",
  //         accessKeyID: "test",
  //         secretAccessKey: "12345678",
  //         bucketLocation: "eu-central-1",
  //         bucketName: "uploads",
  //         useSSL: false
  //     },
  // ],
  codeGenerators: [
    {
      templates: [
        ...templates.typescript.all,
        templates.typescript.operations,
        templates.typescript.linkBuilder,
      ],
    },
    {
      templates: [
         ...templates.typescript.react
        ],
      path: '../src/components/generated',
    },
  ],
  cors: {
    ...cors.allowAll,
    allowedOrigins:
      process.env.NODE_ENV === 'production'
        ? ['http://localhost:3000']
        : ['http://localhost:3000'],
  },
  authentication: {
    cookieBased: {
      providers: [
        authProviders.demo(),

        // NOTE: THIS IS FOR DEV TESTING ONLY!!!
        //       WE ARE USING KEYCLOAK FOR PROD
        authProviders.google({
          id: "googleDev",
          clientId: "689393364183-9h374uh63batklf328nbma23gre4aq3q.apps.googleusercontent.com",
          clientSecret: "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",
      }),
      // authProviders.openIdConnect({
      //   id: "keycloak",
      //   clientId: "test-client-app",
      //   clientSecret: "xxxx-xxxx-xxxx-xxxx",
      //   issuer: "xxxx-xxxx-xxxx-xxxx"
      // }),
    ],
      authorizedRedirectUris: ['http://localhost:3000'],
    },
  },
  /*links: [
          linkBuilder
              .source("userPosts")
              .target("JSP_User","posts")
              .argument("userID", "objectField", "id")
              .build(),
          linkBuilder
              .source("postComments")
              .target("Post","comments")
              .argument("postID", "objectField", "id")
              .build(),
      ],*/
  security: {
    enableGraphQLEndpoint: process.env.NODE_ENV !== 'production',
  },
});
