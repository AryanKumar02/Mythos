import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RPG Quest API',
      version: '1.0.0',
      description: 'API documentation for the RPG Quest application',
      contact: {
        name: 'Aryan',
        email: 'aryan@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api', // Replace with your base URL
        description: 'Development server',
      },
    ],
  },
  apis: ['/Users/aryan/Project-RPG/backend/routes/*.js'], // Correct path for all .js files in the routes folder
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

export { swaggerDocs, swaggerUi }
