let loader;
async function onStart(){
   loader = PIXI.Loader.shared
//    await loader.add("patlama","images/patlama.png");
   await loader.add("restart","images/restart.png");
   await loader.add("home","images/home.png");
    console.log("yüklendi 2")
}

function start(){
    document.getElementById("giris").style.display = "none"
    const app = new PIXI.Application({ backgroundColor: 0xffbb37 });
    document.querySelector("#game").appendChild(app.view);
    let sayi = 3
    var tiles = new PIXI.Container();
    let a = 0
    let keys = {};
    let playerSheet = {};
    let bombSheet = {}
    let close = true
    let character = {
        x:150,
        y:200,
        vy:0,
        vx:0
    }
    let sure1 = 1250
    let sure = ()=>{

        var sayi = sure1--
        return sayi
    }
    var oyunbitis2 = new PIXI.Container()
    let puffs = []
    let puffSpeed = 10;
    var timer = new Timer(() => {
        finishScreen()
        timer.stop()
        setTimeout(() => {
            app.stop();    
        }, 500);
    },20000)
    
    addTile(100,400,150,20)
    addTile(525,400,150,20);
    addTile(315,250,150,20)
    addTile(100,100,150,20);
    addTile(525,100,150,20)
    
    
    app.stage.addChild(tiles)
    
    document.querySelector("#game").addEventListener("pointerdown", sendPuff)
    
    app.loader.add("character","images/characters.png");
    app.loader.add("bomb","images/bomb.png");
    app.loader.load(doneLoading);
    app.loader.load(sure)
    
    let score = 0;
    let skorPuan = new PIXI.Text(score,{fontFamily : 'Galiver', fontSize: 40, fill : 0x2c3e50 });
    const bomb2 = PIXI.Texture.from("images/bomba.png");
    const bombPng = new PIXI.Sprite(bomb2);
    bombPng.anchor.set(0.5);
    bombPng.x = 750
    bombPng.y = 40
    skorPuan.anchor.set(0.5, 0.5);
    skorPuan.position.set(700,45)
    
    
    
    
    app.stage.addChild(skorPuan)
    app.stage.addChild(bombPng)
    // app.stage.addChild(oyunbitis)
    
    function interact(){
        return tiles.children[tiles.children.length-1].y+400 == app.renderer.screen.height
    }
    function stopScreen(){
        let textureButton = new PIXI.Texture.from(loader.resources["restart"].url)
        let textureButton2 = new PIXI.Texture.from(loader.resources["home"].url)
        let bg = new PIXI.Texture.from(loader.resources["patlama"].url)
        let restart = new PIXI.Sprite(textureButton)
        let home = new PIXI.Sprite(textureButton2)
        let pauseMenuBG = new PIXI.Graphics();
        let bgPng = new PIXI.Sprite(bg)
        let alpha = new PIXI.filters.AlphaFilter(0.2)
        restart.anchor.set(0.5,0.5)
        restart.scale.set(0.2,0.2)
    restart.buttonMode = true
    restart.interactive = true
    restart.x = app.renderer.screen.width/2-50
    restart.y = app.renderer.screen.height/2
    home.anchor.set(0.5,0.5)
    home.scale.set(0.75,0.75)
    home.buttonMode = true
    home.interactive = true
    home.x = app.renderer.screen.width/2 +50
    home.y = app.renderer.screen.height/2
    bgPng.anchor.set(0.5, 0.5)
    bgPng.position.set(app.renderer.screen.width/2,app.renderer.screen.height/2)
    pauseMenuBG.beginFill(0xf7931e)
    pauseMenuBG.filters = [alpha]
    pauseMenuBG.drawRect(0, 0, app.renderer.screen.width, app.renderer.screen.height)
    pauseMenuBG.endFill()
    
    oyunbitis2.addChild(pauseMenuBG)
    oyunbitis2.addChild(bgPng)
    oyunbitis2.addChild(home)
    oyunbitis2.addChild(restart)

    
    restart.on("click", async () => {
        await PIXI.utils.clearTextureCache()
        await PIXI.utils.destroyTextureCache()
        await app.loader.destroy()
        await app.destroy();
        document.body.children[2].removeChild(document.body.children[2].children[0]) 
        start()
        
    })
    home.on("click", () => {
        app.destroy();
        window.location.reload()  
    })
    }
    function finishScreen(){
        var oyunbitis = new PIXI.Container()
    
    var result = new PIXI.Text("Skor: "+ skorPuan.text,{fontFamily : 'Galiver', fontSize: 40, fill : 0x111 });
    let textureButton = new PIXI.Texture.from(loader.resources["restart"].url)
    let textureButton2 = new PIXI.Texture.from(loader.resources["home"].url)
    let bg = new PIXI.Texture.from(loader.resources["patlama"].url)
    let restart = new PIXI.Sprite(textureButton)
    let home = new PIXI.Sprite(textureButton2)
    let pauseMenuBG = new PIXI.Graphics();
    let bgPng = new PIXI.Sprite(bg)
    let alpha = new PIXI.filters.AlphaFilter(0.2)
    result.anchor.set(0.5, 0.5)
    result.position.set(app.renderer.screen.width/2,app.renderer.screen.height/2-80)
    restart.anchor.set(0.5,0.5)
    restart.scale.set(0.2,0.2)
    restart.buttonMode = true
    restart.interactive = true
    restart.x = app.renderer.screen.width/2-50
    restart.y = app.renderer.screen.height/2
    home.anchor.set(0.5,0.5)
    home.scale.set(0.75,0.75)
    home.buttonMode = true
    home.interactive = true
    home.x = app.renderer.screen.width/2 +50
    home.y = app.renderer.screen.height/2
    bgPng.anchor.set(0.5, 0.5)
    bgPng.position.set(app.renderer.screen.width/2,app.renderer.screen.height/2)
    pauseMenuBG.beginFill(0xf7931e)
    pauseMenuBG.filters = [alpha]
    pauseMenuBG.drawRect(0, 0, app.renderer.screen.width, app.renderer.screen.height)
    pauseMenuBG.endFill()
    
    oyunbitis.addChild(pauseMenuBG)
    oyunbitis.addChild(bgPng)
    oyunbitis.addChild(result)
    oyunbitis.addChild(home)
    oyunbitis.addChild(restart)
    app.stage.addChild(oyunbitis)
    
    restart.on("click", async() => {
        await PIXI.utils.clearTextureCache()
        await PIXI.utils.destroyTextureCache()
        await app.loader.destroy()
        await app.destroy();
        document.body.children[2].removeChild(document.body.children[2].children[0]) 
        start() 
        
    })
    home.on("click", () => {
        app.destroy();
        window.location.reload()  
    })
    }
    
    window.addEventListener("keydown",keysDown)
    window.addEventListener("keyup", keysUp)
    window.addEventListener("keypress", stop)
    
    
    function addTile(x,y,w,h,){
        var tile = new PIXI.Graphics();
        tile.beginFill(0x2c3e50)
        tile.hitArea = new PIXI.Rectangle(x+50, y+50, 120, 20);
        tile.drawRoundedRect(x,y,w,h,10);
        tile.endFill()
        tiles.addChild(tile)
    }
    
    function interact2(rect1,rect2){
        interactBool = true
        return  rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y
    }
    
    function keysDown(e){
        keys[e.keyCode] = true
        console.log(e.keyCode)
    }
    function keysUp(e){
        keys[e.keyCode] = false
    }
    function tileDown(){
            if(interact2(tiles.children[0].hitArea,player)){
                interactBool = false
                character.vy = 0
                character.xy = 0
                player.jumping = false
            }else if(interact2(tiles.children[1].hitArea,player)){
                interactBool = false
                character.vy = 0
                character.xy = 0
                player.jumping = false
            }
            else if(interact2(tiles.children[2].hitArea,player)){
                interactBool = false
                character.vy = 0
                character.xy = 0
                player.jumping = false
            }
            else if(interact2(tiles.children[3].hitArea,player)){
                interactBool = false
                character.vy = 0
                character.xy = 0
                player.jumping = false
            }else if(interact2(tiles.children[4].hitArea,player)){
                interactBool = false
                character.vy = 0
                character.xy = 0
                player.jumping = false
            }
            else{
                character.vy += 0.1 
                player.y += character.vy 
                player.x += character.vx 
            }  
            
        
        if (keys["87"] && player.jumping == false ) {
            character.vy -= 5.5
            player.y += character.vy
            console.log(player.y)
            player.jumping = true;
            console.log("tıkalndı")
          }
        if(keys["87"] && keys["65"]){
            player.textures = playerSheet.jumpleft
            player.play();
        }
        if(keys["87"] && keys["68d"]){
            player.textures = playerSheet.jumpright
            player.play();
        }
        if(keys["65"]){
            if(!player.playing){
                player.textures = playerSheet.walkLeft
                player.play();
            }
            player.x -= 2
        }
        
        if(keys["68"]){
            if(!player.playing){
                player.textures = playerSheet.walkRight
                player.play();
            }
            player.x += 2
        }
        if(app.renderer.screen.height+100 < player.y){
            finishScreen()
            timer.stop()
            setTimeout(() => {
                app.stop();    
            }, 100);
        }
        if (player.x < -32) {
            player.x = 800;
        } else if (player.x > 800) {// if rectangle goes past right boundary
            player.x = -32;
        }
        
    }
    function doneLoading(){
    
        console.log(a)
        createPlayerSheet();
        createPlayer()
        createBomb()
        createB(tiles.children[sayi].hitArea.x+70,tiles.children[sayi].hitArea.y-70)
        app.ticker.add(tileDown) 
        app.ticker.add(updatePuffs)
        app.ticker.add(sure)
    }
    function createPlayerSheet(){
        let ssheet = new PIXI.BaseTexture.from(app.loader.resources["character"].url);
        let w = 50.5;
        let h = 74;
        playerSheet["standleft"] = [
            new PIXI.Texture(ssheet,new PIXI.Rectangle(0*w,0,w,h))
        ]
        playerSheet["standright"] = [
            new PIXI.Texture(ssheet,new PIXI.Rectangle(4*w,0,w,h))
        ]
        playerSheet["walkRight"] = [
            
            new PIXI.Texture(ssheet, new PIXI.Rectangle(1*w,0,w,h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(2*w,0,w,h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(3*w,0,w,h)),
            new PIXI.Texture(ssheet,new PIXI.Rectangle(0*w,0,w,h)),
        ]
        playerSheet["walkLeft"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(5*w,0,w,h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(6*w,0,w,h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(7*w,0,w,h)),
            new PIXI.Texture(ssheet,new PIXI.Rectangle(4*w,0,w,h))
        ],
        playerSheet["jumpleft"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(5*w,0,w,h)),
            new PIXI.Texture(ssheet,new PIXI.Rectangle(4*w,0,w,h))
        ],
        playerSheet["jumpright"]=[
            new PIXI.Texture(ssheet, new PIXI.Rectangle(1*w,0,w,h)),
            new PIXI.Texture(ssheet,new PIXI.Rectangle(0*w,0,w,h))
        ],
        playerSheet["shootright"]=[
            new PIXI.Texture(ssheet, new PIXI.Rectangle(8*w,0,w,h)),
            new PIXI.Texture(ssheet,new PIXI.Rectangle(0*w,0,w,h))
        ],
        playerSheet["shootleft"]=[
            new PIXI.Texture(ssheet, new PIXI.Rectangle(9*w,0,w,h)),
            new PIXI.Texture(ssheet,new PIXI.Rectangle(4*w,0,w,h))
        ]
    }
    function createPlayer(){
        player = new PIXI.AnimatedSprite(playerSheet.standright);
        player.anchor.set(0.5);
        player.animationSpeed = 0.25;
        player.loop = false;7
        player.interactive = true
        // player.hitArea =  new PIXI.Rectangle(player.position.x, player.position.y, 250, 250)
        console.log()
        player.x = character.x;
        player.y = character.y
        player.jumping = true
        app.stage.addChild(player)
        player.play();
        y_vel = 0
        x_vel = 0
    }
    function createBomb(){
        let ssheet2 = new PIXI.BaseTexture.from(app.loader.resources["bomb"].url);
        let w = 48;
        let h = 42;
        bombSheet["bomb"] = [
            new PIXI.Texture(ssheet2,new PIXI.Rectangle(0*w,0,w,h))
        ]
    }
    function stop(e){
        if(e.keyCode == 32){
           close = !close;
           if(close){ 
               stopScreen();
               app.stage.addChild(oyunbitis2)
               timer.stop()
               setTimeout(() => {
                app.stop();
            }, 100);
           }else{
                app.stage.removeChild(oyunbitis2)
                timer.reset(sure()*16)
                setTimeout(() => {
                    sure();
                    app.start();
                }, 100);
              
           }
       }
   
       // console.log(close)
       
   }
    function createB(x,y){
        
        bomb = new PIXI.AnimatedSprite(bombSheet.bomb);
        bomb.anchor.set(0.5);
        bomb.animationSpeed = 10;
        bomb.loop = true;
        bomb.x = x
        bomb.y = y
        bomb.hitArea = new PIXI.Rectangle(bomb.x, bomb.y, 100, 100)
        app.stage.addChild(bomb)
    }
    function random(){
      var sayi = Math.floor(Math.random()*5)
      return sayi
    }
    
    function Timer(fn, t) {
        var timerObj = setInterval(fn, t);
    
        this.stop = function() {
            if (timerObj) {
                clearInterval(timerObj);
                timerObj = null;
            }
            return this;
        }
        this.start = function() {
            if (!timerObj) {
                this.stop();
                timerObj = setInterval(fn, t);
            }
            return this;
        }
        this.reset = function(newT = t) {
            t = newT;
            return this.stop().start();
        }
    }
    
    function sendPuff(){
        if(player.textures== playerSheet.walkLeft || player.textures== playerSheet.standleft ||player.textures== playerSheet.shootleft){
            fireshootleft()
        }
        if (player.textures== playerSheet.walkRight || player.textures== playerSheet.standright || player.textures== playerSheet.shootright){
            fireshootright()
        }
    
        let puff = createPuff();
        puffs.push(puff)
        if(interact2(puff,bomb)){
            sayi = random();
            app.stage.removeChild(app.stage.children[4])
            createB(tiles.children[sayi].hitArea.x+70,tiles.children[sayi].hitArea.y-70)
            timer.reset(20000)
            score += 1;
            skorPuan.text = score
            console.log(score)
        } 
    }
    
    function createPuff(){
        let puff = new PIXI.Sprite.from("images/puff.png");
        puff.anchor.set(0.5);
        if(player.textures== playerSheet.walkRight || player.textures== playerSheet.standright || player.textures== playerSheet.shootright){
            puff.x = player.x+50;
        }
        if(player.textures== playerSheet.walkleft || player.textures== playerSheet.standleft || player.textures== playerSheet.shootleft){
            puff.x = player.x-50;
        }
        puff.y = player.y;
        puff.speed = puffSpeed;
        app.stage.addChild(puff)
        puff.hitArea = new PIXI.Rectangle(bomb.x, bomb.y, 100, 100)
        return puff;
    }
    function updatePuffs(delta){
        if(player.textures== playerSheet.walkRight || player.textures== playerSheet.standright || player.textures== playerSheet.shootright){
            
            for(let i=0; i<puffs.length; i++){
                
                puffs[i].position.x += puffs[i].speed
                console.log( puffs[i].position.x)
                if(puffs[i].position.x > player.x+200){
                    puffs[i].dead = true
                }
            }
            for(let i=0; i<puffs.length; i++){
                if(puffs[i].dead ==  true){
                   app.stage.removeChild(puffs[i])
                   puffs.splice(i,1)
                }
            }
        }
        if(player.textures== playerSheet.walkleft || player.textures== playerSheet.standleft || player.textures== playerSheet.shootleft){
    
            for(let i=0; i<puffs.length; i++){
                puffs[i].position.x -= puffs[i].speed
                puffs[i].rotation = 550
                if(puffs[i].position.x < player.x-200){
                    puffs[i].dead = true
                    console.log(puffs[i].dead)
                }
            } 
            for(let i=0; i<puffs.length; i++){
                if(puffs[i].dead ==  true){
                   app.stage.removeChild(puffs[i])
                   puffs.splice(i,1)
                }
            } 
        }
          
        
            
    }
    function fireshootright(){
        if(!player.playing){
            player.textures = playerSheet.shootright
            player.play();
        }
    }
    function fireshootleft(){
        if(!player.playing){
            player.textures = playerSheet.shootleft
            player.play();
        }
    }
    function loop(delta){
        updatePuffs(delta)
    }
}
