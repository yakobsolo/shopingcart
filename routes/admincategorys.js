const express = require('express');
const category = require('../models/category');
const router = express.Router();
var auth = require('../connect/auth');
var isAdmin = auth.isAdmin;


// get category MODEL
const Category = require('../models/category');

// get catagory index

router.get('/',isAdmin, (req, res) => {
    Category.find((err, categories) =>{
        if (err) return console.log(err);
        res.render('admin/categories', {
            categories,
        });

    })

  
        
})





// get add category

router.get('/add-category',isAdmin, (req, res) => {
    const title = "";
    
    


    res.render('admin/add_category', {
        title,

        
    })
})


// post add category

router.post('/add-category', (req, res) => {
    
    
    req.checkBody('title', 'title must have a value').notEmpty();

    const title = req.body.title;
    const slug = title.replace(/\s+/g, '-').toLowerCase();



    const errors = req.validationErrors();
    if (errors) {
        
        res.render('admin/add_category', {
            errors,
            title,
            
            
        })

    } else {
        Category.findOne({slug: slug}, (err, category) => {
            if (category) {
                req.flash('danger', 'category slug exists, choose another');
                res.render('admin/add_category', {
                   
                    title,
                   
                })
            } else {
                const category = new Category({
                    title,
                    slug,
                    
                });

                category.save((err) => {
                    if (err) return console.log(err);

                    Category.find(function (err, categories) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.app.locals.categories = categories;
                        }
                    });
                    req.flash('success','category added');
                    res.redirect('/admin/categories');

                })
            }
        })
        
    }

    
})

// // post reorder pages

// router.post('/reorder-page ', (req, res) => {
//     console.log(req.body);
   
// })

// get edit category

router.get('/edit-category/:id',isAdmin, (req, res) => {
    Category.findById(req.params.id, (err, category) => {
        if (err) {
            return console.log(err);
        } else {
            res.render('admin/edit_category', {
                title: category.title,
                id: category._id,
            })
        }
    })
   
})



// post edit category

router.post('/edit-category/:id', (req, res) => {
    
    
    req.checkBody('title', 'title must have a value').notEmpty();

    const title = req.body.title;
    const slug = title.replace(/\s+/g, '-').toLowerCase();
    const id = req.params.id;


    const errors = req.validationErrors();
    if (errors) {
        
        res.render('admin/edit_category', {
            errors,
            title,
            id,
        })

    } else {
        Category.findOne({slug: slug, _id: {'$ne': id}}, (err, category) => {
            if (category) {
                req.flash('danger', 'category title exists, choose another');
                res.render('admin/edit_category', {
                   
                    title,
                    id,
                })
            } else {
                Category.findById(id, function(err, category) {
                    if (err) return console.log(err);

                    category.title = title;
                    category.slug = slug;

                    

                    category.save((err) => {
                        if (err) return console.log(err);

                        Category.find(function (err, categories) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.categories = categories;
                            }
                        });
                        req.flash('success','category edited');
                        res.redirect('/admin/categories/edit-category/'+id);

                    })
                })

            }
        })
        
    }

    
})

// get delete category

router.get('/delete-category/:id',isAdmin, (req, res) => {
    Category.findByIdAndDelete(req.params.id, (err) => {
        if (err) return console.log(err);

        Category.find(function (err, categories) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.categories = categories;
            }
        });
        req.flash('success', 'Page deleted');
        res.redirect('/admin/products/')
    })

})




//Exports
module.exports = router;
