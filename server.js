const { InvalidArgumentError } = require('./src/erros');
const jwt = require('jsonwebtoken');

require('dotenv').config();
require('./redis/blocklist-acess-token');
require('./redis/allowlist-refresh-token');

const app = require('./app');
const port = 3000;
const db = require('./database');

const routes = require('./rotas');
routes(app);

app.use((error, req, res, next) => {
    let status = 500;
    const body = {
        message: error.message
    }

    if(error instanceof InvalidArgumentError){
        status = 422;
    }
    if(error instanceof jwt.JsonWebTokenError){
        status = 401;
    }
    if(error instanceof jwt.TokenExpiredError){
        status = 401;
        body.expiradoEm = error.expiredAt;
    }

    res.status(status);
    res.json(body);
})

app.listen(port, () => console.log(`App listening on port ${port}`));
