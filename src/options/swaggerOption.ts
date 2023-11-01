export const swaggerOption = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "NodeJS API",
        version: "1.0.0",
        description: "NodeJS API example, for more information go to https://github.com/rocketon85/nodeAPI.",
      },
      components: {
        securitySchemes: {
          // ApiKeyAuth:{
          //   type: "apiKey",
          //   in: "header",
          //   name: "X-API-Key"
          // },
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            desription: "Enter Bearer token"
          }
        }
      },
      security: {
        bearerAuth: []    
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
    apis: ["./src/routes/*.ts"],
  };