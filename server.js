/*********************************************************************************
* WEB700 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Nirmal Mayur Panchal Student ID: 143130219  Date: 08th March 2022
*
* Online(Heroku) Link: https://mysterious-tundra-87270.herokuapp.com/
********************************************************************************/
var HTTP_PORT=process.env.PORT || 8082;

var express=require('express');
const res = require('express/lib/response');
var collegeData=require('./modules/collegeData.js');
var path=require('path');
var app=express();
const exphbs=require("express-handlebars");
const { rejects } = require('assert');
app.engine(".hbs",exphbs.engine({
    extname: ".hbs",
    helpers:{
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
            '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
            },
        equal: function (lvalue, rvalue, options) {
                if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
                if (lvalue != rvalue) {
                return options.inverse(this);
                } else {
                return options.fn(this);
                }
                }
    }

}));

app.set("view engine", ".hbs");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
    });
//setup a route to listen on the default url path
app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/about",(req,res)=>{
    res.render("about");
})

app.get("/students/add",(req,res)=>{
    collegeData.getCourses().then((courses)=>{
        res.render("addStudent",{
            courses:courses
        });
    }).catch(err=>{
        res.render("addStudent",{
            courses:[]
        });
    });
  
})

app.get("/courses/add",(req,res)=>{
    res.render("addCourse");
})

app.post("/students/add",(req,res)=>{
    collegeData.addstudent(req.body).then(students=>{
        res.redirect('/students');
    }).catch(err=>{
        res.json({message:"Some error occured"});
    });
})

app.post("/courses/add",(req,res)=>{
    collegeData.addCourse(req.body).then(courses=>{
        res.redirect('/courses');
    }).catch(err=>{
        res.json({message:"Some error occured"});
    });
})

app.post("/course/update",(req,res)=>{
    collegeData.updateCourse(req.body).then(courses=>{
        res.redirect('/courses');
    }).catch(err=>{
        res.json({message:"Some error occured"});
    });
})

app.get("/htmlDemo",(req,res)=>{
    res.render("htmlDemo");
})

app.get("/students",(req,res)=>{
    if(req.query.course)
    {
        collegeData.getStudentsByCourse(req.query.course).then(students=>{
            if(students.length>0)
            {
                res.render("students",{
                    students:students
                });
            }else
            {
                res.render("students",{message:"no results"});
            }
          
        }).catch(err=>{
            res.render("students",{message:"no results"});
        });
    }
    else
    {
        collegeData.getAllStudents(req.query.course).then(students=>{
            if(students.length>0)
            {
                res.render("students",{
                    students:students
                });
            }else
            {
                res.render("students",{message:"no results"});
            }
        }).catch(err=>{
            res.render("students",{message:"no results"});
        });
    }
})

// app.get("/tas",(req,res)=>{
//     collegeData.getTAs().then(students=>{
//         res.json(students);
//     }).catch(err=>{
//         res.json({message:"no results returned"});
//     });

// })

app.get("/courses",(req,res)=>{
    collegeData.getCourses().then(courses=>{
        if(courses.length>0)
        {
            res.render("courses",{courses:courses});

        }else{
            res.render("courses",{message:"no results"});
        }
    }).catch(err=>{
        res.render("courses",{message:"no results returned"});
    });
})


app.get("/courses/:id",(req,res)=>{
    collegeData.getCoursesById(req.params.id).then((course)=>{
        if(course!=undefined)
        {
            res.render("course",{course:course});

        }else{
            res.status(404).send("Course Not Found");
        }
    }).catch(err=>{
        res.render("course",{message:"no results returned"});
    });
})

app.get("/student/:num",(req,res)=>{
    //initialize an empty object to store the values
    let viewData={};
    collegeData.getStudentByNum(req.params.num).then(students=>{
        if(students)
        {
            viewData.student=students 
        }else{
            viewData.student=null;
        }
        //res.render("student",{student:students});
    }).catch(err=>{
        //res.render("student",{message:"no results returned"});
        viewData.student=null;
    }).then(collegeData.getCourses).then((courses)=>{
        viewData.courses = courses;
        for(let i =0; i < viewData.courses.length;i++)
        {
            if(viewData.courses[i].courseId==viewData.student.course){
                viewData.courses[i].selected= true;
            }
        }
    }).catch(()=>{
        viewData.courses=[];
    }).then(()=>{
        if(viewData.student==null){ //if no student - return an error
            res.status(404).send("Student not Found");
        }else{
            res.render("student",{viewData:viewData}); //render the student view
        }
    });
});

app.post("/student/update",(req,res)=>{
    collegeData.updateStudent(req.body).then(students=>{
        res.redirect("/students");
    }).catch(err=>{
        res.render("students",{message:"no results returned"})
    })
    

})

app.get("/course/delete/:id",(req,res)=>{
    collegeData.deleteCourseById(req.params.id).then(course=>{
        res.redirect("/courses");
    }).catch(err=>{
        res.status(500).send("Unable to Remove Course/ Course not Found");
    })
})

app.get("/student/delete/:studentNum",(req,res)=>{
    collegeData.deleteStudentByNum(req.params.studentNum).then(students=>{
        res.redirect("/students");
    }).catch(err=>{
        res.status(500).send("Unable to remove Student/ Student not Found");
    })
    

})
app.use((req,res,next)=>{
    res.status(404).send("Page Not Found"); // .sendFile(), .json(), etc or .end() (sends nothing back)
});

collegeData.initialize().then(
    app.listen(HTTP_PORT,()=>{console.log("Server listening on Port: "+HTTP_PORT)})
).catch(err=>{
});
