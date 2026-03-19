import express from 'express';
import { 
    forgotPasswordOtpSending,
    forgotPasswordOtpVerify,
    forgotPasswordReset 
} from '../controller/ForgotPasswordController.js';

const ForgotPasswordrouter = express.Router();

ForgotPasswordrouter.post('/forgotPasswordOtpSending', forgotPasswordOtpSending);
ForgotPasswordrouter.post('/forgotPasswordOtpVerify', forgotPasswordOtpVerify);
ForgotPasswordrouter.post('/forgotPasswordReset', forgotPasswordReset);

export default ForgotPasswordrouter;