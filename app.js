const express     = require('express');
const app         = express();

const port        = process.env.PORT || 8000;

app.use(express.static(`${__dirname}/public`));

app.listen(port, () => console.log(`Express is listening on port ${port}`));
