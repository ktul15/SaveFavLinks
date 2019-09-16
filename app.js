const bodyParser        = require('body-parser'),
    methodOverride      = require('method-override')
    mongoose            = require('mongoose'),
    express             = require('express'),
    app                 = express();

mongoose.connect('mongodb://localhost/savefavlinks', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.static('public'));

//Schema Setup
const linkSchema = new mongoose.Schema({
    url     : String,
    added   : Date
})

const Link = mongoose.model('Link', linkSchema);

//Demo Link
// Link.create({
//     url     : 'https://www.quora.com/How-can-I-be-more-attractive-to-women-1/answer/Sean-Kernan',
//     added   : Date.now()
// }, 
//     (err, link) => {
//         if(err) console.log(err);

//         console.log('New Link: ', link);
//     }
// )

//RESTful Routes

    //INDEX - show all links
    app.get('/links', (req, res) => {
        //Get all goals from the DB
        Link.find({}, (err, allLinks) => {
            
            if(err) console.log(err);

            res.render('index', {allLinks: allLinks});
        })
    })

    //NEW - show form to create new links.
    app.get('/links/new', (req, res) => {
        res.render('new');
    })

    //CREATE - add new link to DB
    app.post('/links', (req, res) => {
        var newLink = req.body.link;
        Link.create(newLink, (err, newlyCreatedLink) => {
            if(err) {
                console.log(err);
            } else {
                res.redirect('/links');
            }
        })
    })

    //EDIT - edit one link based on the id in the url
    app.get('/links/:id/edit', (req, res) => {
        Link.findById(req.params.id, (err, foundLink) => {
            if(err) {
                console.log(err);
            } else {
                res.render('edit', {link: foundLink});
            }
        })
    })

    //UPDATE - update one goal based on the id in the url
    app.post('/links/:id', (req, res) => {
        Link.findByIdAndUpdate(req.params.id, req.body.link, (err, updatedLink) => {
            if(err) {
                console.log(err);
            } else {
                res.redirect('/links/');
            }
        })
    })

    //DELETE - delete one goal based on the id in the url
    app.delete('/links/:id', (req, res) => {
        Link.findByIdAndRemove(req.params.id, (err, removedLink) => {
            if(err) {
                console.log(err);
            } else {
                res.redirect('/links/');
            }
        })
    })

//Server Setup
app.listen('8000', () => {
    console.log('Server Started!');
})
