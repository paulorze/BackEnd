import { transporter } from "../utils.js"
import { resetPasswordHTML } from "../utils/mailhtml.js";

export const sendEmail = async (email, token) => {
    await transporter.sendMail({
        from: 'BackendCoderHouse',
        to: email,
        subject: 'Password Reset',
        html: resetPasswordHTML(token)
    });
};