import express from "express";
import cors from "cors";
import DataStore from "@seald-io/nedb";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, "build");

app.use(express.static(buildPath));
app.use(cors());
app.use(express.json({ limit: "1mb" }))

app.listen(port, () => {console.log(`Listening to port ${port}`)});
const dataBase = new DataStore({ filename: "dataBase.db", autoload: true});
dataBase.setAutocompactionInterval(10000);

app.get("/", (req,res)=>{
  res.sendFile(path.join(buildPath, "index.html"));
})
app.get("/login", (req, res)=>{
  res.sendFile(path.join(buildPath, "index.html"));
})
app.get("/register", (req, res)=>{
  res.sendFile(path.join(buildPath, "index.html"));
})
app.get("/bodyInfo", (req, res)=>{
  res.sendFile(path.join(buildPath, "index.html"));
})
app.get("/dailyStat", (req, res)=>{
  res.sendFile(path.join(buildPath, "index.html"));
})
app.get("/overallStat", (req, res)=>{
  res.sendFile(path.join(buildPath, "index.html"));
})
app.get("/recomendation", (req, res)=>{
  res.sendFile(path.join(buildPath, "index.html"));
})
app.get("/settings", (req, res)=>{
  res.sendFile(path.join(buildPath, "index.html"));
})


app.post("/addUser", async (request, response) => {
  const data = request.body;
  const login = await dataBase.findAsync({login: data.login});
  const email = await dataBase.findAsync({email: data.email});
  if (login.length !== 0) {
    response.json("user exists");
  } else if (email.length !==0){
    response.json("email exists");
  } else {
    dataBase.insert(data);
    response.json("success"); 
  }
});

app.post("/addStats/:login", async (request, response) => {
  const login = request.params.login;
  dataBase.find({login: login}, async (err, data) => {
    const date = data[0].health.findIndex(item => item.date == request.body.date);
    if (date !== -1) {
      response.json("date exists");
    } else {
      await dataBase.updateAsync({ login: login}, { $push: {health: request.body}}, {});
      dataBase.find({login: login}, (err, data) => {
        if (err) {
          response.json(err);
        } else {
          response.json(["updated", data[0].health]);
        } 
      });
    }
  })
})

app.post("/updateSleep/:login/:idAndSleep", (request, response)=>{
  const login = request.params.login;
  const idAndSleep = request.params.idAndSleep.split("&");

  dataBase.findOne({ login: login }, (err, data) => {
    if (err) {
    response.json("User was not found");
    return;
    }
    if (data) {
      const index = data.health.findIndex(item => item.id == idAndSleep[0]);
      if (index !== -1) {
        data.health[index].sleep = idAndSleep[1];
        dataBase.update({ login: login }, data, {});
      } else {
        response.json("not found");
      }
    }
    dataBase.find({login: login}, (err, data)=>{
      if (err) {
        response.json(err)
      } else {
        response.json(["updated", data[0].health])
      }
    });  
  });
});

app.post("/updateMeals/:login/:idAndMeals", (request, response)=>{
  const login = request.params.login;
  const idAndMeals = request.params.idAndMeals.split("&");

  dataBase.findOne({ login: login }, (err, data) => {
    if (err) {
    response.json("User was not found");
    return;
    }
    if (data) {
      const index = data.health.findIndex(item => item.id == idAndMeals[0]);
      if (index !== -1) {
        data.health[index].meals = idAndMeals[1];
        dataBase.update({ login: login }, data, {});
      } else {
        response.json("not found");
      }
    }
    dataBase.find({login: login}, (err, data)=>{
      if (err) {
        response.json(err)
      } else {
        response.json(["updated", data[0].health])
      }
    });  
  });
});

app.post("/updateSteps/:login/:idAndSteps", (request, response)=>{
  const login = request.params.login;
  const idAndSteps = request.params.idAndSteps.split("&");

  dataBase.findOne({ login: login }, (err, data) => {
    if (err) {
    response.json("User was not found");
    return;
    }
    if (data) {
      const index = data.health.findIndex(item => item.id == idAndSteps[0]);
      if (index !== -1) {
        data.health[index].steps = idAndSteps[1];
        dataBase.update({ login: login }, data, {});
      } else {
        response.json("not found");
      }
    }
    dataBase.find({login: login}, (err, data)=>{
      if (err) {
        response.json(err)
      } else {
        response.json(["updated", data[0].health])
      }
    });  
  });
});

app.post("/updateExer/:login/:idAndIcon", (request, response)=>{
  const login = request.params.login;
  const idAndIcon = request.params.idAndIcon.split("&");

  dataBase.findOne({ login: login }, (err, data) => {
    if (err) {
    response.json("User was not found");
    return;
    }
    if (data) {
      const index = data.health.findIndex(item => item.id == idAndIcon[0]);
      if (index !== -1) {
        let exercise;
        if (idAndIcon[1] === "dumbbell") {
          exercise = "yes";
        } else if (idAndIcon[1] === "ban") {
          exercise = "no";
        }
        data.health[index].exercise = exercise;
        dataBase.update({ login: login }, data, {});
      } else {
        response.json("not found");
      }
    }
    dataBase.find({login: login}, (err, data)=>{
      if (err) {
        response.json(err)
      } else {
        response.json(["updated", data[0].health])
      }
    });  
  });
});

app.post("/updateStress/:login/:idAndIcon", (request, response)=>{
  const login = request.params.login;
  const idAndIcon = request.params.idAndIcon.split("&");

  dataBase.findOne({ login: login }, (err, data) => {
    if (err) {
    response.json("User was not found");
    return;
    }
    if (data) {
      const index = data.health.findIndex(item => item.id == idAndIcon[0]);
      if (index !== -1) {
        let stress;
        if (idAndIcon[1] === "stress") {
          stress = "yes";
        } else if (idAndIcon[1] === "peace") {
          stress = "no";
        }
        data.health[index].stressful = stress;
        dataBase.update({ login: login }, data, {});
      } else {
        response.json("not found");
      }
    }
    dataBase.find({login: login}, (err, data)=>{
      if (err) {
        response.json(err)
      } else {
        response.json(["updated", data[0].health])
      }
    });  
  });
});

app.get("/login/:loginPass", (request, response) => {
  const loginPass = request.params.loginPass.split("&");
  const login = loginPass[0];
  const pass = loginPass[1];
  
  dataBase.find({login: login}, (err, data) => {
    if (err) {
      response.json(err);
    } else if (data.length === 0) {
    response.json("no user")
    } else {
    if (data[0].password === pass) {
        const {login, fname, lname, health, stats} = data[0];
        response.json(["match", login, fname, lname, health, stats]);
    } else {
        response.json("wrong password");
    }
    }
  });
});


app.put("/changePass/:loginPass/:newPass", async (request, response) => {
  const inputData = request.params.loginPass.split("&");
  const newPass = request.params.newPass;
  const login = inputData[0];
  const prevPass = inputData[1];
  dataBase.findOne({login: login}, async (err, doc) => {
    if (err) {
      response.json(err);
    }
    if (doc.password === prevPass) {
    await dataBase.updateAsync({login: login}, {$set: {password: newPass}});
    response.json("password changed");
    } else if (err) {
    response.json(err);
    } else {
    response.json("prevPass doesn't match");
    }
  });
});

app.put("/addStats/:login", (request, response) => {
  const login = request.params.login;
  dataBase.find({login: login}, async (err, data)=>{
    if (data[0].stats.length === 0) {
      await dataBase.updateAsync({ login: login}, { $push: {stats: request.body}}, {});
      dataBase.find({login: login}, (err, data) => {
        if (err) {
          response.json(err);
        } 
        if (data) {
          response.json(data[0].stats);
        }
      })
    } else {
      response.json("there are stats");
    }
  });
});

app.put("/changeStats/:login/:stats", (request, response) => {
  const login = request.params.login;
  const inputStats = request.params.stats.split("&");
  dataBase.findOne({login: login}, (err, doc) => {
    if (err) {
      response.json(err)
    } 
    if (doc) {
      doc.stats[0].age = inputStats[0];
      doc.stats[0].height = inputStats[1];
      doc.stats[0].weight = inputStats[2];
      dataBase.update({login: login}, doc, {});
    }
    dataBase.find({login: login}, (err, data) => {
      if (err) {
        response.json(err)
      } else {
        response.json(data[0].stats);
      }
    })
  });
});

app.put("/changeName/:login/:names", (request, response) => {
  const login = request.params.login;
  const names = request.params.names.split("&");
  dataBase.findOne({login: login}, (err, doc) => {
    if (err) {
      response.json(err);
    } 
    if (doc) {
      doc.fname = names[0];
      doc.lname = names[1];
      dataBase.update({login: login}, doc, {});
    }
    dataBase.find({login: login}, (err, data) => {
      if (err) {
        response.json(err);
      } else {
        response.json([data[0].fname, data[0].lname]);
      }
    })
  });
});

app.delete("/deleteAcc/:user", async (request, response) => {
  const login = request.params.user;
  await dataBase.removeAsync({login: login}, {});
  response.json("user deleted");
})

app.delete("/deleteHS/:login", async (request, response) => {
  const login = request.params.login;
  await dataBase.updateAsync({login: login}, {$set: { health: []}});
  dataBase.find({login: login}, (err, data) => {
    if (err) {
      response.json(err);
    } else {
      response.json(data[0].health)
    }
  });
});

app.delete("/deleteStat/:login/:exerId", async (request, response) => {
  const login = request.params.login;
  const exerId = Number(request.params.exerId);
  await dataBase.updateAsync({ login: login }, { $pull: {health: {id: exerId}}}, {});
  dataBase.find({login: login}, (err, data)=>{
    if (err) {
    response.json(err);
    } else {
    response.json(["stat deleted", data[0].health]);
    }
  });
});