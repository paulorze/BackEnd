export const resetPasswordHTML = (token) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
            body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            }
    
            .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            h1 {
            color: #333333;
            }
    
            p {
            color: #555555;
            }
    
            .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007BFF;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            }
    
            .button:hover {
            background-color: #0056b3;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <h1>Password Reset</h1>
            <p>You have requested to reset your password. Click the button below to proceed:</p>
            <a class="button" href="http://localhost:8080/api/users/passwordReset?token=${token}" target="_blank">Reset Password</a>
        </div>
        </body>
    </html>`;
};