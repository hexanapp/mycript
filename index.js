file = require('./files/js/File.js');

hex = require('hexan');


hex.setStatic(__dirname,'/node_modules');
hex.setStatic(__dirname,'/files');


hex.app.get('/', (req, res) => {
  res.sendFile(__dirname+'/files/views/index.html');
})

// on connect user
hex.onconnect((socket)=>{

  console.log('connect user');

  socket.on('close-app',()=>{
    hex.close();
  });

  socket.on('add',(title,description)=>{
    file.add(title,description);
  });

  socket.on('send-key',(name,code='',friend='',password='')=>{

    file.skey = file.getHash(name+code+friend+password);

    file.initFile(name,code);

    file.getData(function (data) {

      if (data===false) {
        socket.emit('login-fail');
      }
      else {
        socket.emit('login-ok',data);
      }
    });

  });

});

// on disconnect event
hex.ondisconnect(function (socket) {
  console.log('disconnect user');
});

hex.run(true);
