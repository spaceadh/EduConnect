import express from 'express';
import { retrievePastMessage, newMessage } from '../controllers/controllers.chats.js';

import { groupretrievePastMessage, groupnewMessage } from '../controllers/controllers.groups.js';

import {retrieveDocStatus,lecturerDocuments,updateAcceptance } from '../controllers/controller.docstatus.js';

const router = express.Router();

// Proper route definition for retrieving past messages
router.route('/messages/retrievemessage/:studentId/:lecturerId').get(retrievePastMessage);
// Route for sending new message
router.route('/messages/newmessage').post(newMessage);


// / Proper route definition for retrieving past messages
router.route('/groups/retrievemessage/:lecturerId').get(groupretrievePastMessage);
// Route for sending new message
router.route('/groups/newmessage').post(groupnewMessage);


router.route('/retrievedocstatus/:lecturerId/:fullname/:documentType').get(retrieveDocStatus);
router.route('/retrievedocstatus/:lecturerId').get(lecturerDocuments);
router.route('/updateAcceptance/:lecturerId/:studentId/:docType').put(updateAcceptance)

export default router;
