const Spritesmith = require('spritesmith');
const fs = require('fs');
const spriteFolder = './assets/';

let sprites = fs.readdirSync(spriteFolder);
let spriteJson = {
  "frames": {},
  "meta": {
    "app": "doit",
    "version": "0.1",
    "image": "",
    "format": "RGBA8888",
    "size": {},
    "scale": "1"
  }
};

Spritesmith.run({src: sprites.map(sprite => spriteFolder + sprite)}, function handleResult(err, result) {
  if(err){
    console.log(err);
  }
  fs.writeFileSync(__dirname + '/spritesheet.png', result.image);
  console.log(result.coordinates);
  // console.log(result.properties);

  spriteJson.meta.size = {
    "w" : result.properties.width,
    "h" : result.properties.height
  };
  console.log(JSON.stringify(spriteJson));
});
