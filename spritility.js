#!/usr/bin/env node
const Spritesmith = require('spritesmith');
const fs = require('fs');
const path = require('path');

const spritePath = path.basename(process.argv[2]) + '/';
const outPath = path.basename(process.argv[3]) + '/';

let sprites = fs.readdirSync(spritePath).sort();
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

let animsJson = {
  "anims": [],
  "globalTimeScale": 1
};

Spritesmith.run({src: sprites.map(sprite => spritePath + sprite)}, function handleResult(err, result) {
  if(err){
    console.log(err);
  }
  fs.writeFileSync(outPath + 'spritesheet.png', result.image);
  for (let key in result.coordinates){
    let image = key.replace(spritePath, ""); 
    spriteJson.frames[image] = {
      "frame": {},
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {"x":0,"y":0},
      "sourceSize": {},
      "pivot": {"x":0.5,"y":0.5}
    };
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
  fs.writeFileSync(outPath + 'spritesheet.json', json, 'utf8');

  //anims
  var lastKey = '';
  var animObj = {};
  let reg = new RegExp("[0-9]", "g");
  sprites.forEach(function(sprite){
    let key = sprite.replace(reg, '').substring(0, sprite.indexOf('.')).replace('.', '');
    if (key !== lastKey) {
      if(Object.getOwnPropertyNames(animObj).length > 0){
        animObj.frameRate = 24,
        animObj.duration = 1.5,
        animObj.skipMissedFrames = true,
        animObj.delay = 0,
        animObj.repeat = -1,
        animObj.repeatDelay = 0,
        animObj.yoyo = false,
        animObj.showOnStart = false,
        animObj.hideOnComplete = false
        animsJson.anims.push(animObj);
      }
      animObj = {};
      animObj.key = key;
      animObj.type = 'frame';
      animObj.frames = [{
        "key": "spritesheet",
        "frame": sprite,
        "duration": 0,
        "visible": false
      }]
    } else {
      animObj.frames.push({
        "key": "spritesheet",
        "frame": sprite,
        "duration": 0,
        "visible": false
      })
    }
    
    lastKey = key;
    let json = JSON.stringify(animsJson, null, 2);
    fs.writeFileSync(outPath + 'anims.json', json, 'utf8');
  });
});