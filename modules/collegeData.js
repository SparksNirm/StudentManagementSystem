const Sequelize= require('sequelize');

var sequelize=new Sequelize('dam25plc35kpg2','xwklujlkgvzdwp','eb4b990863e04348019095d99509d2a0fa9f2b309624a89ee40dc12f2603965f',{
    host:'ec2-3-230-122-20.compute-1.amazonaws.com',
    dialect:'postgres',
    port:5432,
    dialectOptions:{
        ssl:{rejectUnauthorized:false}
    },
    query:{raw:true}
})

var Student=sequelize.define('Student',{
    studentNum:{
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true 
    },
    firstName: Sequelize.STRING,
    lastName:Sequelize.STRING,
    email:Sequelize.STRING,
    addressStreet:Sequelize.STRING,
    addressCity:Sequelize.STRING,
    addressProvince:Sequelize.STRING,
    TA:Sequelize.BOOLEAN,
    status:Sequelize.STRING
},{
    createdAt:false,
    updatedAt:false
});

var Course=sequelize.define('Course',{
    courseId:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    courseCode:Sequelize.STRING,
    courseDescription:Sequelize.STRING
},{
    createdAt:false,
    updatedAt:false
});

Course.hasMany(Student,{foreignKey:'course'});


module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
       sequelize.sync().then(()=>{
           resolve();
       }).catch(err=>{
           reject('unable to syn the database');
       });
    });
}

module.exports.getAllStudents = function () {
    return new Promise(function (resolve, reject) {
        Student.findAll().then((data)=>{
            resolve(data);
        }).catch(err=>{
            reject('no results returned')
        });
    })
}



// module.exports.getTAs = function () {
//     return new Promise(function (resolve, reject) {
//         let studentTAs = [];
//         if (dataCollection != null && dataCollection.students.length == 0) {
//             reject("no result returned");
//         } else {
//             dataCollection.students.forEach(student => {
//                 if (student.TA == true) {
//                     studentTAs.push(student);
//                 }

//             });
//             resolve(studentTAs);
//         }

//     })

// }

module.exports.getCourses = function () {
    return new Promise(function (resolve, reject) {
       Course.findAll().then(data=>{
           resolve(data)
       }).catch(err=>{
           reject('no results returned');
       });
    })
}

module.exports.getCoursesById = function (id) {
    return new Promise(function (resolve, reject) {
        Course.findAll({
            where:{
                courseId:id
            }
        }).then((course)=>{
            resolve(course[0]);
        }).catch((err)=>{
            reject('no results returned');
        })
    });
};

module.exports.getStudentsByCourse=function(searchBycourseId){
    return new Promise(function(resolve,reject){
        Student.findAll({
            where:{
                course:searchBycourseId
            }
        }).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject('no results returned')
        })
    })
}

module.exports.getStudentByNum=function(searchByStudentNum){
    return new Promise(function(resolve,reject){
        Student.findAll({
            where:{
                studentNum:searchByStudentNum
            }
        }).then(data=>{
            resolve(data[0]);
        }).catch(err=>{
            reject('no results returned')
        })
    })
}

module.exports.updateStudent=function(studentData){
    studentData.TA = (studentData.TA) ? true : false;
    for(const data in studentData)
    {
        if(`${studentData[data]}`=="")
        {
            studentData[data]=null;      
        }
    }
    return new Promise(function(resolve,reject){
        Student.update(studentData,{
            where:{
                studentNum: studentData.studentNum
            }
        }).then(()=>{
            resolve();
        }).catch(err=>{
            reject('unable to update student')
        });

    })
}

module.exports.addstudent = function (studentData) {
    studentData.TA = (studentData.TA) ? true : false;
    for(const data in studentData)
    {
        if(`${studentData[data]}`=="")
        {
            studentData[data]=null;      
        }
    }
    return new Promise(function(resolve,reject){
        Student.create(studentData).then(newStudent=>{
            resolve();
        }).catch(err=>{
            reject('unable to creat student')
        })
    });
}


module.exports.addCourse = function (courseData) {
    for(const data in courseData)
    {
        if(`${courseData[data]}`=="")
        {
            courseData[data]=null;      
        }
    }
    return new Promise(function(resolve,reject){
        Course.create(courseData).then((data)=>{
            resolve();
        }).catch(err=>{
            reject('unable to create course')
        });

    });
}

module.exports.updateCourse=function(courseData){
    for(const data in courseData)
    {
        if(`${courseData[data]}`=="")
        {
            courseData[data]=null;      
        }
    }
    return new Promise(function(resolve,reject){
        Course.update(courseData,{
            where:{
                courseId:courseData.courseId
            }
        }).then(()=>{
            resolve();
        }).catch(err=>{
            reject('unable to update course')
        })
    })
}

module.exports.deleteCourseById=function(searchById){
    return new Promise(function(resolve,reject){
        Course.destroy({
            where:{
                courseId:searchById
            }
        }).then(()=>{
            resolve();
        }).catch(err=>{
            reject('unable to delete course')
        })
    })
}

module.exports.deleteStudentByNum=function(searchByNum){
    return new Promise(function(resolve,reject){
        Student.destroy({
            where:{
                studentNum:searchByNum
            }
        }).then(()=>{
            resolve("destroyed");
        }).catch(err=>{
            reject('Was Rejected')
        })
    })
}

