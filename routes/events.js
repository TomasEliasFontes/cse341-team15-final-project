const express = require("express");
const router = express.Router();

const eventsController = require("../controllers/events");
const { handleErrors } = require("../utilities/utilities");
const { isAuthenticated } = require("../middleware/authenticate");

// Public routes (no authentication)
router.get("/", 
  /* #swagger.tags = ['Events']
     #swagger.description = 'Get all events'
  */
    handleErrors(eventsController.getAll));
router.get("/:id", 
  /* #swagger.tags = ['Events']
     #swagger.description = 'Get a single event by ID'
  */
    handleErrors(eventsController.getSingle));

// Protected routes (authentication required)
router.post("/", 
  /* #swagger.tags = ['Events']
     #swagger.description = 'Create a new events'
     #swagger.parameters['body'] = {
       in: 'body',
       description: 'Event data',
       required: true,
       schema: { $ref: '#/definitions/Event' }
     }
  */
    isAuthenticated, handleErrors(eventsController.createEvent));
router.put("/:id", 
  /* #swagger.tags = ['Events']
     #swagger.description = 'Update an existing event'
     #swagger.parameters['body'] = {
       in: 'body',
       description: 'Updated event data',
       required: true,
       schema: { $ref: '#/definitions/Event' }
     }
  */
    isAuthenticated, handleErrors(eventsController.updateEvent));
router.delete(
  "/:id",
  /* #swagger.tags = ['Events']
     #swagger.description = 'Delete a event'
  */
    isAuthenticated,
  handleErrors(eventsController.deleteEvent)
);

module.exports = router;
