/*const WebSocket = require("ws");




const wss = new WebSocket.Server({ port: 8000 }, () => {
  console.log("server started");
});*/


const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const express = require("express");

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

  const WebSocket  = require('ws');

  const wss = new WebSocket.Server({ server });



const auth = require("./auth");

let users = [];
let userlist_ver = 0;

let prefabs = [];
let prefab_ver = 0;

let timer = 0.0;

setInterval(updateFunc, 10);

function updateFunc() {
  timer += 0.01;
  if (timer >= 0.1) {
    timer = 0.0;
  }
}

function findByKey(key, value) {
  return (item, i) => item[key] === value;
}

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const d = JSON.parse(data);

    if (d.method == "msg_add_prefab") {
      let findParams = findByKey("id", d.id);

      let index = prefabs.findIndex(findParams);
      if (d.newobj == "true") {
        let newMovement = {
          id: prefabs.length,
          ownerid: d.ownerid,
          name: d.name,
          method: d.method,
          newobj: "false",
          active: d.active,
          x: d.x,
          y: d.y,
        };
        prefabs.push(newMovement);
        ws.send(JSON.stringify(newMovement));
      } else if (index != -1) {
        prefabs[index].newobj = "false";
        ws.send(JSON.stringify(prefabs[index]));
      } else {
        let newMovement = {
          id: d.id,
          ownerid: d.ownerid,
          name: d.name,
          method: d.method,
          newobj: "false",
          active: d.active,
          x: d.x,
          y: d.y,
        };
        prefabs.push(newMovement);
        ws.send(JSON.stringify(newMovement));
      }
    }

    if (d.method == "msg_init_prefab") {
      let findParams = findByKey("id", d.id);

      let index = prefabs.findIndex(findParams);
      if (index != -1) {
      }
    }

    if (d.method == "msg_update_prefab") {
      let findParams = findByKey("id", d.id);

      let index = prefabs.findIndex(findParams);
      if (index != -1) {
        prefabs[index] = d;
      }
    }

    if (d.method == "msg_get_prefab_move") {
      let findParams = findByKey("id", d.id);

      let index = prefabs.findIndex(findParams);
      if (index != -1) {
        ws.send(JSON.stringify(prefabs[index]));
      }
    }

    if (d.method == "msg_get_uTimer") {
      ws.send(timer);
      return;
    }

    if (d.method == "user_join") {
      let findParams = findByKey("name", d.name);
      let existId = "9999";
      let index = users.findIndex(findParams);
      if (index != -1) {
        existId = index;
      }
      if (d.name == "") {
        ws.send("9999");
      } else if (index == -1) {
        let newUser = {
          id: users.length,
          name: d.name,
          method: d.method,
          active: d.active,
        };
        userlist_ver += 1;
        users.push(newUser);

        ws.send(newUser.id);
      } else {
        ws.send(existId);
      }
      console.log(d.name + " has joined the server");
      return;
    }

    if (d.method == "msg_get_uList") {
      ws.send(JSON.stringify(users));
      return;
    }
    if (d.method == "msg_get_uList_ver") {
      ws.send(userlist_ver);
      return;
    }
  });
});

wss.on("listening", () => {
  updateFunc();
  console.log("server is listening on port 8000");
  auth.demo().then(
    function(value) {console.log(value);}
  );
});
