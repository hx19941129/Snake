var blocksize=10   //每个小格的长和宽
var initialScore=0 //初始分数为0

var width=$("#game").width() //场景的宽度
var height=$("#game").height()  //场景的高度

//蛇的身体
//初始化蛇的位置
var snake=[[2,5],[2,4],[2,3],[2,2]]
//游戏状态
var gameStatus="playing"
//蛇的初始方向
var snakedirection="right"
//分数
var score=0


//创建所有的网格并赋予行和列
function createBg(){
    for(let i=0;i<height/blocksize;i++){
        let tr=document.createElement("tr")
        $("#game")[0].appendChild(tr)
        for(let j=0;j<width/blocksize;j++){
            let td=document.createElement("td")
            createBorder(i,j,td)
            $(td).attr("id",(i+1)+"-"+(j+1))
            tr.appendChild(td)
        }
    }
}

//画出边界
function createBorder(i,j,td){
    if(i===0||i===height/blocksize-1){
        $(td).css("background","gray")
        return
    }
    if(j===0||j===width/blocksize-1){
        $(td).css("background","gray")
        return
    }
}

//画出食物
function drawFood(){
    var foodPosition=[]
    var row=Math.floor(Math.random()*(height/blocksize-2)+2)
    var col=Math.floor(Math.random()*(width/blocksize-2)+2)
    while(checkFoodandSnake(row,col)){
        row=Math.floor(Math.random()*(height/blocksize-2)+2)
        col=Math.floor(Math.random()*(width/blocksize-2)+2)
    }
        $("#"+row+"-"+col).css("background","red")
        foodPosition.push(row)
        foodPosition.push(col)
        return foodPosition
}

//检查生成的食物是否在蛇的位置
function checkFoodandSnake(row,col){
    for(let i=0;i<snake.length;i++){
        if(row===snake[i][0]&&col===snake[i][1]){
            return true
        }
    }
    return false
}

//画出蛇的位置
function drawSnake(){
    for(let i=0;i<snake.length;i++){
        $("#"+snake[i][0]+"-"+snake[i][1]).css("background","green")
    }
}
//擦掉最后一格
function eraseSnake(array){
    $("#"+array[array.length-1][0]+"-"+array[array.length-1][1]).css("background","white")
}

//检测蛇头是否撞墙
function isBoom(){
    if(snake[0][0]===1||snake[0][1]===1||snake[0][1]===width/blocksize||snake[0][0]===height/blocksize){
        return true
    }
    return false
}

//蛇运动的逻辑(让后面的往前移动)
function move(snakeCp){
    for(let i=1;i<snakeCp.length;i++){
        snake[i]=snakeCp[i-1].slice(0)
    }
}

//复制移动之前的数组数据
function copySnakeArray(){
    var snakeCp=[]
    for(let i=0;i<snake.length;i++){
        snakeCp[i]=snake[i].slice(0)
    }
    return snakeCp
}

//判断是否吃到食物
function isEatFood(){
    if(food[0]===snake[0][0]&&food[1]===snake[0][1]){
        score+=1
        return true
    }
    return false
}

//判断蛇移动的方向
function snakeDirection(){
    if(snake[0][1]-snake[1][1]>0){
        snakedirection="right"
    }
    if(snake[0][1]-snake[1][1]<0){
        snakedirection="left"
    }
    if(snake[0][0]-snake[1][0]>0){
        snakedirection="down"
    }
    if(snake[0][0]-snake[1][0]<0){
        snakedirection= "up"
    }
}

//根据蛇的方向自己移动
function snakeMove(direct){
    switch(direct){
        case "left":
            snake[0][1]-=1
        break;
        case "right":
            snake[0][1]+=1
        break;
        case "up":
            snake[0][0]-=1
        break;
        case "down":
            snake[0][0]+=1
        break;
    }
}
//键盘控制蛇的方向改变
document.onkeydown=function(e){
    e=window.event||e
    if(gameStatus==="playing"){
        switch(e.keyCode){
            case 37:     //向左移动
                if(snakedirection!=="right"&&snakedirection!=="left"){
                    snakedirection="left"
                }
            break;
            case 38:    //向上移动
                if(snakedirection!=="up"&&snakedirection!=="down"){
                    snakedirection="up"
                }
            break;
            case 39:  //向右移动
                if(snakedirection!=="right"&&snakedirection!=="left"){
                    snakedirection="right"
                }
            break;
            case 40: //向下移动
                if(snakedirection!=="up"&&snakedirection!=="down"){
                    snakedirection="down"
                }
        }
    }
    
}

//判断是否撞到自己的身体
function isBoomOurselves(){
    for(let i=1;i<snake.length;i++){
        if(snake[0][0]===snake[i][0]&&snake[0][1]===snake[i][1]){
            return true
        }
    }
    return false
}


createBg()
var food=drawFood()   //食物的位置
drawSnake()


var timer=setInterval(function(){
    var snakeCp=copySnakeArray()   //copy移动前的数组
    snakeMove(snakedirection)
    if(isBoom()||isBoomOurselves()){    //碰到墙壁了
        alert("boom")  //结束
        clearInterval(timer)   
    }else{
        move(snakeCp)  //移动
        if(isEatFood()){ //如果吃到食物了
            food=drawFood()  //重新画一个食物
            $("#score").text(score)  //加分
            snake.push(snakeCp[snakeCp.length-1].slice())  //蛇长加1
        }
        drawSnake()     //画出来
        eraseSnake(snakeCp)  //擦掉1格尾巴
    }
},100)

