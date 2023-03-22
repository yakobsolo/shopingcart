const express = require('express');
const router = express.Router();
var auth = require('../connect/auth');
var isAdmin = auth.isAdmin;




// get PAGE MODEL
const Page = require('../models/page');

// get pages index

router.get('/',isAdmin, (req, res) => {
    Page.find({}).sort({sorting: 1}).exec((err, pages) => {
        res.render('admin/pages', {
            pages: pages
        });
    })
})


// get add page

router.get('/add-page',isAdmin, (req, res) => {
    const title = "";
    const slug = "";
    const content = "";


    res.render('admin/add_page', {
        title,
        slug,
        content,
    })
})


// post add page

router.post('/add-page', (req, res) => {
    
    
    req.checkBody('title', 'title must have a value').notEmpty();
    req.checkBody('content', 'content must have a value').notEmpty();

    const title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();

    if (slug == "") {
        slug = title.replace(/\s+/g, '-').toLowerCase();
    }

    const content = req.body.content;

    const errors = req.validationErrors();
    if (errors) {
        
        res.render('admin/add_page', {
            errors,
            title,
            slug,
            content,
        })

    } else {
        Page.findOne({slug: slug}, (err, page) => {
            if (page) {
                req.flash('danger', 'Page slug existes, choose another');
                res.render('admin/add_page', {
                   
                    title,
                    slug,
                    content,
                })
            } else {
                const page = new Page({
                    title,
                    slug,
                    content,
                    sorting: 100,
                });

                page.save((err) => {
                    if (err) return console.log(err);

                    
                    Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.app.locals.pages = pages;
                        }
                    });

                    req.flash('success','Page added');
                    res.redirect('/admin/pages');

                })
            }
        })
        
    }

    
})

// // post reorder pages

// router.post('/reorder-page ', (req, res) => {
//     console.log(req.body);
   
// })

// get edit page

router.get('/edit-page/:id',isAdmin,  (req, res) => {
    Page.findById(req.params.id, (err, page) => {
        if (err) {
            return console.log(err);
        } else {
            res.render('admin/edit_page', {
                title: page.title,
                slug: page.slug,
                content: page.content,
                id: page._id
            })
        }
    })
   
})



// post edit page

router.post('/edit-page/:id', (req, res) => {
    
    
    req.checkBody('title', 'title must have a value').notEmpty();
    req.checkBody('content', 'content must have a value').notEmpty();

    const title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();

    if (slug == "") {
        slug = title.replace(/\s+/g, '-').toLowerCase();
    }

    const content = req.body.content;
    const id = req.params.id;


    const errors = req.validationErrors();
    if (errors) {
        
        res.render('admin/edit_page', {
            errors,
            title,
            slug,
            content,
            id,
        })

    } else {
        Page.findOne({slug: slug, _id: {'$ne': id}}, (err, page) => {
            if (page) {
                req.flash('danger', 'Page slug existes, choose another');
                res.render('admin/edit_page', {
                   
                    title,
                    slug,
                    content,
                    id,
                })
            } else {
                Page.findById(id, function(err, page) {
                    if (err) return console.log(err);

                    page.title = title;
                    page.slug = slug;
                    page.content = content;

                    

                    page.save((err) => {
                        if (err) return console.log(err);

                        Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.pages = pages;
                            }
                        });
                        req.flash('success','Page edited');
                        res.redirect('/admin/pages/edit-page/'+id);

                    })
                })

            }
        })
        
    }

    
})

// get delete page

router.get('/delete-page/:id', isAdmin, (req, res) => {
    Page.findByIdAndDelete(req.params.id, (err) => {
        if (err) return console.log(err);

        Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.pages = pages;
            }
        });

        req.flash('success', 'Page deleted');
        res.redirect('/admin/pages/')
    })

})




//Exports
module.exports = router;
