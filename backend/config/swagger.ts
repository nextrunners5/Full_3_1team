import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'v5의 API 문서',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: '로컬 개발 서버',
      },
    ],
  },
  apis: ['./routes/*.ts', './feature/**/controller/*.ts'], // Swagger가 API 정보를 가져올 경로
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
