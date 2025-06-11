export const generateEmailHTML = (content: string) => {
	return `
<!DOCTYPE html>
<html> 
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Admin Account Has Been Created</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eaeaea;
        }

        .logo {
            max-width: 150px;
            height: auto;
            border-radius: 100%;
        }

        .content {
            padding: 20px 0;
        }

        .credentials {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }

        .credentials p {
            margin: 5px 0;
        }

        .button {
            display: inline-block;
            background-color: #3182ce;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: 600;
            margin: 20px 0;
            cursor: pointer;
        }

        .footer {
            text-align: center;
            padding: 20px 0;
            color: #718096;
            font-size: 14px;
            border-top: 1px solid #eaeaea;
        }

        .warning {
            color: #e53e3e;
            font-weight: 600;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="https://scontent.flgp1-1.fna.fbcdn.net/v/t39.30808-6/449198692_986550536594114_7319273666011228303_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=uAITklf1lWoQ7kNvgFerfj-&_nc_oc=AdjQ968hQ8Z9jN8POgnNSvE8Esour8UuWcSnziau5YYLhg4BPCTc9etPTCOcDPTu-bg&_nc_zt=23&_nc_ht=scontent.flgp1-1.fna&_nc_gid=L-a1-roALS5cV3r9egnDkw&oh=00_AYHa1bEmquNXZ1_7qFlh2fi2YRSy6W0WROWKOcGBJPHscw&oe=67DEAB23" alt="Company Logo" class="logo">
            <h1>BU Connect</h1>
        </div>

        <div class="content">
           ${content}
        </div>

        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} BU Connect | Alumni Association. All rights reserved.</p>
        </div>
    </div>
</body> 
</html>
    
`;
};
