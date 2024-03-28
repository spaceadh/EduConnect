import express from 'express';
const router = express.Router();

import 
{ 
    registerUserController,
    loginUserController,
    resetpasswordController,
    profileUpdateController,
    AddLecturerController,studentListController 
} from '../controllers/controllers.client.js';

router.route('/register').post(registerUserController);
router.route('/login').post(loginUserController);
router.route('/studentlist').post(studentListController);
router.route('/addlec/v1').post(AddLecturerController);
router.route('/resetpassword').post(resetpasswordController);
router.route('/profileupdate').post(profileUpdateController);

export default router;