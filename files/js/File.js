const data = require('./AesUtil.js');

const fs = require('fs');
const crypto = require('crypto');


exports.skey = '';
exports.filePath = '';
exports.path = `${process.cwd()}/datacript`;
exports.fileName = '';


exports.getHash = (text)=>{
  return crypto.createHash('md5').update(text).digest('hex');
}

exports.initFile=(name,code,storage='local')=>{
  var hash = exports.getHash(name+code);

  exports.fileName = hash;

  console.log('cwd:'+process.cwd());

  if (storage=='local') {
    exports.filePath = `${exports.path}/${exports.fileName}`;
  }

  if (!fs.existsSync(exports.path)){
    fs.mkdirSync(exports.path);
  }

  if (! exports.exists()) {
    exports.write([]);
  }

}

exports.exists = ()=>{
  try {
    if (fs.existsSync(exports.filePath)) {
      return true;
    }
  } catch(err) {
    console.error(err)
  }

  return false;
}

exports.add=(title,desc)=>{
  exports.getData(function (get) {
    get.push({title:title,desc:desc});
    exports.write(get);
  });
}

exports.write=(json)=>{

  key = exports.skey;

  text = JSON.stringify(json);

  text = data.encrypt(text,key);

  fs.writeFileSync(exports.filePath,text);
}

exports.getData=(callback)=>{
  fs.readFile(exports.filePath, 'utf8', function(err, text) {
    if (err) throw err;

    try {
      key = exports.skey;

      text = data.decrypt(text,key);

      json = JSON.parse(text);

      callback(json);

    } catch (e) {
      callback(false)
    }

  });
}
