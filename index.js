

//PROJECT NODEJS (Mohamed Jassem Debbich && Mouadh Abdellatif -----GLSI-A)


const express = require('express')
const app = express()
const port = 3000
app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`)
})

var bodyParser = require('body-parser')
app.use(bodyParser.json())
var fs = require('fs')
const { get } = require('http')
const req = require('express/lib/request')
const res = require('express/lib/response')
const file = __dirname+"/students.json"

// we tried to insert joi to validate the entry data but it's not working :')

//const studentsSchema = Joi.object({
  //nom : Joi.string().required(),
  //classe : Joi.string().min(3).max(10).required(),
  //module : Joi.string().min(3).max(10).required(),
  //note : Joi.string().min(0).max(20).required(),

//})

//const { error, value} = studentsSchema.validate(student, {
      //abortEarly : false,
    //});
    //if (error){
     // console.log(error);
      //return res.send(error.details)
    //}



//api crud

// post an student 
app.post('/add', (req,res)=> {
  var students = getStudentsData()
  var student = req.body
  calculmoy(student,(moyen)=>{
    console.log(student)
    console.log(moyen)
  const Id = Math.floor(100000 + Math.random() * 900000)
  student.moyenne = moyen
  students[Id] = student
  saveStudentData(students)
  res.send("student saved")
  })



})

//read data from json 
const getStudentsData = () => {
  const jsonData = fs.readFileSync(file)
  return JSON.parse(jsonData)   
}
app.get('/', (req, res) => {
  var students = getStudentsData()
  console.log(typeof(students))
  console.log(students)
  res.send(students)
  
})

//delete student
const deleteStudentById = (Id,cb) => {
  let delet = false
  students = getStudentsData()
  console.log(students)
  for (let idd in students) {
    if (idd == Id ) {
      delete students[idd]
      saveStudentData(students)
      delet = true
    }
  }
  cb(delet)
} 
app.delete('/delete/:Id', (req, res) => {
  const Id = req.params.Id
  console.log(Id)
  deleteStudentById(Id,(data)=>{
    if (data == true) {
      res.send("student name =" + Id+"delete succesfully")
    }else {
      res.send("student name =" + Id+"delete failed")
    }
  })

}) 
// save after changes
const saveStudentData = (data) => {
  const stringifyData = JSON.stringify(data)
  fs.writeFileSync(file, stringifyData)
}

//update students
app.put('/update/:Id', (req, res) => {
  var students = getStudentsData()
  var Id = req.params.Id
  console.log(students[Id]) 
  var student = req.body
  if (students[Id] == undefined) {
    res.send("failed")

  }else {
    delete students[Id]
    calculmoy(student, (moyen)=>{
      student.moyenne = moyen
      students[Id] = student
      saveStudentData(students)
    res.send("success")
    })

  }
})

//fonction pour calculer la moyenne automatique
const calculmoy = (student,cb) => {

  var modules = student.modules
  let i = 0 
  let somme = 0
  modules.forEach( module =>{
    console.log(module)
    somme += module.note
    i++;
  })
  let moyen = somme / i;
  cb(moyen)
}


//output the best and the worst note for each student
let affichebyStudent=(students,cb)=>{
  var listt=[]
  for (let i in students){
    var objet ={}
    student = students[i]
    objet.nom = student.nom
    var best = 0 ;
    var worst = 20;
    student.modules.forEach((module)=>{
      if (module.note > best ){
        best = module.note
        objet.best_module = module
      }
      if (module.note < worst){
        worst = module.note
        objet.worst_module=module
      }
    })
    listt.push(objet)
  }
  cb(listt)
}

//output name and moyenne of students
let affiche_name_moyen = (students,cb)=> {
  var name_moyen = {}
  var rep = []
  for (let j in students){
    var student = students[j]
   name_moyen.nom=student["nom"];
   name_moyen.moyenne=student["moyenne"];
   
   rep.push(name_moyen)
   cb(rep)

  }
  
}
  
  


app.get('/afficher', (req, res)=>{
  const students = getStudentsData()
  affiche_name_moyen(students,(rep) =>{
    res.send(rep);
  })
}
 )

app.get('/affiche-bystudent',(req,res) => {
  const students = getStudentsData()
  affichebyStudent(students,(listt)=>{
    res.send(listt)
  })

})