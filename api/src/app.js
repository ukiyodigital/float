const   mongoose = require('mongoose')
        cors = require('cors')
        express = require('express')
        bodyParser = require('body-parser')

const routes = require('./routes')

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/', routes)

app.on('ready', function() {
    if (!module.parent) { app.listen(8000) }
    console.log(`Application started. Access via ${process.env.proxy_host}`)
})

mongoose.connect( process.env.MONGODB_URI, { useNewUrlParser: true } );
mongoose.connection.once('open', function() {
    // All OK - fire (emit) a ready event.
    console.log('Found mongodb connection!');
    app.emit('ready');
});
