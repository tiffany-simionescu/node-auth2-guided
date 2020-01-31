const server = require('./api/server.js');

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));


// client sends credentials to server
// server verifies credentials
// server creates a session for the client
// server sends back cookie as header (set-cookie header)
// client stores the cookie in it's cookie-jar
// client sends all cookies in cookie jar on every request
// server verifies the cookie is valid
// server provides access to resource