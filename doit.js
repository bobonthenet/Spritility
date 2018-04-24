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

const frameObj = {
  "frame": {},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0},
	"sourceSize": {},
	"pivot": {"x":0.5,"y":0.5}
}

Spritesmith.run({src: sprites.map(sprite => spriteFolder + sprite)}, function handleResult(err, result) {
  if(err){
    console.log(err);
  }
  fs.writeFileSync('spritesheet.png', result.image);

  for (let key in result.coordinates){
    const image = key.replace(spriteFolder, ""); 
    spriteJson.frames[image] = frameObj;
    spriteJson.frames[image].frame = {
        "x": result.coordinates[key].x, 
        "y": result.coordinates[key].y, 
        "w": result.coordinates[key].width, 
        "h": result.coordinates[key].height
    }
    spriteJson.frames[image].spriteSourceSize.w = result.coordinates[key].width;
    spriteJson.frames[image].spriteSourceSize.h = result.coordinates[key].height;
    spriteJson.frames[image].sourceSize.w = result.coordinates[key].width;
    spriteJson.frames[image].sourceSize.h = result.coordinates[key].height;
  };

  spriteJson.meta.size = {
    "w" : result.properties.width,
    "h" : result.properties.height
  };
  let json = JSON.stringify(spriteJson, null, 2);
  fs.writeFileSync('spritesheet.json', json, 'utf8');
});
