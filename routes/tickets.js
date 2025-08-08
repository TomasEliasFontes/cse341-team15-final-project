const express = require("express");
const router = express.Router();

const ticketsController = require("../controllers/tickets");
const { handleErrors } = require("../utilities/utilities");
const { isAuthenticated } = require("../middleware/authenticate");

// Public routes
router.get(
  "/",
  /* #swagger.tags = ['Tickets']
     #swagger.description = 'Get all tickets'
  */
  handleErrors(ticketsController.getAll)
);

router.get(
  "/:id",
  /* #swagger.tags = ['Tickets']
     #swagger.description = 'Get a single ticket by ID'
     #swagger.parameters['id'] = { 
        in: 'path', 
        description: 'Ticket ID', 
        required: true, 
        type: 'string' 
     }
  */
  handleErrors(ticketsController.getSingle)
);

// Protected routes
router.post(
  "/",
  /* #swagger.tags = ['Tickets']
     #swagger.description = 'Create a new ticket'
     #swagger.parameters['body'] = {
       in: 'body',
       description: 'Ticket data',
       required: true,
       schema: { $ref: '#/definitions/Ticket' }
     }
  */
  isAuthenticated,
  handleErrors(ticketsController.createTicket)
);

router.put(
  "/:id",
  /* #swagger.tags = ['Tickets']
     #swagger.description = 'Update an existing ticket'
     #swagger.parameters['id'] = { in: 'path', description: 'Ticket ID', required: true, type: 'string' }
     #swagger.parameters['body'] = {
       in: 'body',
       description: 'Updated ticket data',
       required: true,
       schema: { $ref: '#/definitions/Ticket' }
     }
  */
  isAuthenticated,
  handleErrors(ticketsController.updateTicket)
);

router.put(
  "/use/:id",
  /* #swagger.tags = ['Tickets']
     #swagger.description = 'Mark a ticket as used'
     #swagger.parameters['id'] = { in: 'path', description: 'Ticket ID', required: true, type: 'string' }
  */
  isAuthenticated,
  handleErrors(ticketsController.markTicketAsUsed)
);

router.delete(
  "/:id",
  /* #swagger.tags = ['Tickets']
     #swagger.description = 'Delete a ticket'
     #swagger.parameters['id'] = { in: 'path', description: 'Ticket ID', required: true, type: 'string' }
  */
  isAuthenticated,
  handleErrors(ticketsController.deleteTicket)
);

module.exports = router;
