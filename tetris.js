"use strict";

const tet_Canvas = document.getElementById("tetrisCanvas");
const ctx = tet_Canvas.getContext("2d");
const nextCanvas = document.getElementById("nextCanvas");
const nextCtx = nextCanvas.getContext("2d");
const hold_Canvas = document.getElementById("holdCanvas");
const hold_Ctx = hold_Canvas.getContext("2d");
let move_direction;
let move_ = true;
let put = 0;
let tet;
let tet_x = 5; //ミノの中心のx座標
let tet_y = 1; //ミノの中心のy座標
let hold_mino = 0;
let push_ = false;
let tet_tiles = Array(20)
  .fill()
  .map(() => Array(10).fill(0));
let next_minos = [];
let save_tet_mino = [];
let put_minos = Array(20)
  .fill()
  .map(() => Array(10).fill(0));
const mino_color = [
  "#9933FF",
  "#00CCFF",
  "#00FF00",
  "#FF0000",
  "#FF9900",
  "#3333FF",
  "#FFFF00",
]; //T, I, S, Z, L, J, O
let keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
  z: false,
  x: false,
  c: false
};
let sensitivitys = {
    ARR: 10,
    SDF: 20,
    DAS: 6,
    DCD: 3,
}
let auto_mino_down = 0;
let elsekey_put = false;
let Right_push = false;
let Left_push = false;
let DAS_count = 0;
let DCD_count = 0;
let another_push = false;
let push_interval_count = 0;
let lotate_num = 0;
let save_lotate_num = lotate_num;
let canHardDrop = true;
let canRotateLeft = true;
let canRotateRight = true;
let canHold = true;
let mino_style = [
    0,-1,0,1,-1,0,0,0,0,-1,0,0,-1,0,0,1,-1,0,1,0,-0,0,0,1,0,0,1,0,-1,0,0,1, // T
    -1,0,1,2,0,0,0,0,0,0,0,0,-1,0,1,2,-2,-1,0,1,0,0,0,0,0,0,0,0,-2,-1,0,1, //I
    1,0,0,-1,-1,-1,0,0,-1,0,-1,0,-1,0,0,1,1,0,0,-1,0,0,1,1,0,1,0,1,-1,0,0,1, //S
     -1,0,0,1,-1,-1,0,0,1,0,1,0,-1,0,0,1,-1,0,0,1,0,0,1,1,0,-1,0,-1,-1,0,0,1,//Z
    1,-1,0,1,-1,0,0,0,-1,0,0,0,-1,-1,0,1,-1,0,1,-1,0,0,0,1,0,0,0,1,-1,0,1,1, //L
    -1,-1,0,1,-1,0,0,0,0,0,-1,0,-1,0,1,1,-1,0,1,1,0,0,0,1,0,1,0,0,-1,-1,0,1, //J
    0,1,0,1,-1,-1,0,0,0,1,0,1,-1,-1,0,0,0,1,0,1,-1,-1,0,0,0,1,0,1,-1,-1,0,0 //O
];
let lotate_style = [
    0,0, 0,1, -1,1, 2,0, 2,1,  //01
    0,0, 0,-1, -1,-1, 2,0, 2,-1,  //03
    0,0, 0,1, 1,1, -2,0, -2,1,  //30
    0,0, 0,1, 1,1, -2,0, -2,1,  //32
    0,0, 0,-1, -1,-1, 2,0, 2,-1,  //23
    0,0, 0,1, -1,1, 2,0, 2,1,  //21
    0,0, 0,-1, 1,-1, -2,0, -2,-1,  //12
    0,0, 0,-1, 1,-1, -2,0, -2,-1  //10
]

let lotate_I = [
    0,0,0,2,0,-1,1,2,-2,-1,
    0,0,0,1,0,-2,-2,1,1,-2,
    0,0,0,-1,0,2,2,-1,-1,2,
    0,0,0,2,0,-1,1,2,-2,-1,
    0,0,0,-2,0,1,-1,-2,2,1,
    0,0,0,-1,0,2,2,-1,-1,2,
    0,0,0,1,0,-2,-2,1,1,-2,
    0,0,0,-2,0,1,-1,-2,2,1
]

document.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }
});

document.addEventListener("keyup", (e) => {
    if (keys.hasOwnProperty(e.key)) {
      keys[e.key] = false;
      if (e.key ==="ArrowLeft") Left_push = false;
      if (e.key === "ArrowRight") Right_push = false;
      if (e.key === "ArrowUp") canHardDrop = true;
      if (Left_push === false && Right_push === false) DAS_count = 0, push_ = false; 
      if (e.key === "z") canRotateLeft = true;
      if (e.key === "x") canRotateRight = true;
    }
  });

function start() {
  next_minos = next_mino();
  next_minos.push(...next_mino());
  new_mino();
  draw_line();
  draw_next(next_minos);
  set_mino();
}

function draw_line() {
  ctx.strokeStyle = "gray";
  ctx.lineWidth = 1;
  for (let y = 1; y < 20; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * 40); //始点x,y
    ctx.lineTo(400, y * 40); //終点x,y
    ctx.stroke();
  }

  for (let x = 1; x < 10; x++) {
    ctx.beginPath();
    ctx.moveTo(x * 40, 0); //始点x,y
    ctx.lineTo(x * 40, 800); //終点x,y
    ctx.stroke();
  }
}

function draw_tiles() {
  ctx.clearRect(0, 0, tet_Canvas.width, tet_Canvas.height);
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 10; x++) {
      if (put_minos[y][x] !== 0) {
        tet_tiles[y][x] = put_minos[y][x];
      }
      if (tet_tiles[y][x] !== 0) {
        ctx.fillStyle = mino_color[tet_tiles[y][x] - 1]; //タイルの色
        ctx.fillRect(x * 40, y * 40, 40, 40); //タイルの位置とサイズ
      }
    }
  }
}

function draw_next(next_minos) {
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  for (let i = 0; i < 5; i++) {
    switch (next_minos[i + 1]) {
      case 1:
        nextCtx.fillStyle = mino_color[next_minos[i + 1] - 1];
        nextCtx.fillRect(50, i * 100 + 30, 30, 30);
        nextCtx.fillRect(20, i * 100 + 60, 90, 30);
        break;
      case 2:
        nextCtx.fillStyle = mino_color[next_minos[i + 1] - 1];
        nextCtx.fillRect(5, i * 100 + 60, 120, 30);
        break;
      case 3:
        nextCtx.fillStyle = mino_color[next_minos[i + 1] - 1];
        nextCtx.fillRect(50, i * 100 + 30, 60, 30);
        nextCtx.fillRect(20, i * 100 + 60, 60, 30);
        break;
      case 4:
        nextCtx.fillStyle = mino_color[next_minos[i + 1] - 1];
        nextCtx.fillRect(20, i * 100 + 30, 60, 30);
        nextCtx.fillRect(50, i * 100 + 60, 60, 30);
        break;
      case 5:
        nextCtx.fillStyle = mino_color[next_minos[i + 1] - 1];
        nextCtx.fillRect(80, i * 100 + 30, 30, 30);
        nextCtx.fillRect(20, i * 100 + 60, 90, 30);
        break;
      case 6:
        nextCtx.fillStyle = mino_color[next_minos[i + 1] - 1];
        nextCtx.fillRect(20, i * 100 + 30, 30, 30);
        nextCtx.fillRect(20, i * 100 + 60, 90, 30);
        break;
      case 7:
        nextCtx.fillStyle = mino_color[next_minos[i + 1] - 1];
        nextCtx.fillRect(35, i * 100 + 30, 60, 60);
        break;
    }
  }
}

function draw_shadow() {
    if (next_minos.length === 0) return;
  
    let shadow_y = tet_y;
    let is_valid = true;

    while (is_valid) {
      for (let i = 0; i < 4; i++) {
        const y = shadow_y + mino_style[(next_minos[0] - 1) * 32 + lotate_num * 8 + 4 + i];
        const x = tet_x + mino_style[(next_minos[0] - 1) * 32 + lotate_num * 8 + i];
        if (y + 1 >= 20 || put_minos[y + 1][x] !== 0) {
          is_valid = false;
          break;
        }
      }
      if (is_valid) shadow_y++;
    }

    for (let i = 0; i < 4; i++) {
      const y = shadow_y + mino_style[(next_minos[0] - 1) * 32 + lotate_num * 8 + 4 + i];
      const x = tet_x + mino_style[(next_minos[0] - 1) * 32 + lotate_num * 8 + i];
      if (y >= 0 && y < 20 && x >= 0 && x < 10) {
        ctx.fillStyle = "rgba(138, 138, 138, 0.54)";
        ctx.fillRect(x * 40, y * 40, 40, 40);
      }
    }
  }
  

function set_mino() {
    check_Delete();
  if (save_tet_mino.length === 8) {
    for (let i = 0; i < 4; i++) {
      tet_tiles[save_tet_mino[i * 2]][save_tet_mino[i * 2 + 1]] = 0;
    }
  }

  save_tet_mino = [];

  for (let i = 0; i < 4; i++) {
    let y =
      tet_y + mino_style[(next_minos[0] - 1) * 32 + lotate_num * 8 + 4 + i];
    let x = tet_x + mino_style[(next_minos[0] - 1) * 32 + lotate_num * 8 + i];
    tet_tiles[y][x] = next_minos[0];
    save_tet_mino[i * 2] = y;
    save_tet_mino[i * 2 + 1] = x;
  }
}

function put_mino() {
  for (let i = 0; i < 4; i++) {
    put_minos[save_tet_mino[i * 2]][save_tet_mino[i * 2 + 1]] = next_minos[0];
  }
  canHold = true;
  next_minos.shift();
  new_mino();
  set_mino();
  draw_next(next_minos);
}

function new_mino() {
  lotate_num = 0;
  tet_x = 4;
  tet_y = 2;
  if (next_minos.length < 7) {
    next_minos.push(...next_mino());
  }
}

function check_Delete () {
    let count_tile;
    for (let y = 0; y < 20; y++) {
        count_tile = 0;
        for (let x = 0; x < 10; x++) {
            if (put_minos[y][x] !== 0) {
                count_tile++;
            }
        }
        if (count_tile === 10) {
            put_minos.splice(y, 1);
            put_minos.unshift(Array(10).fill(0))
            for (let yy = 0; yy < 20; yy++) {
                for (let xx = 0; xx < 10; xx++) {
                    tet_tiles[yy][xx] = put_minos[yy][xx];
                }
            }
        }
    }
}

function next_mino() {
  const mino_types = [1, 2, 3, 4, 5, 6, 7]; //T, I, S, Z, L, J, O
  for (let i = mino_types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mino_types[i], mino_types[j]] = [mino_types[j], mino_types[i]]; // 要素を交換
  }
  return mino_types;
}

function hold () {
    if (canHold === true) {
        if (hold_mino === 0) {
            hold_mino = next_minos[0];
            next_minos.shift();
        }else {
            let save_hold = hold_mino;
            hold_mino = next_minos[0];
            next_minos[0] = save_hold;
        }
    canHold = false;
    new_mino();
    set_mino();
    draw_next(next_minos);
    }
}

function draw_hold () {
    let hold_color = mino_color[hold_mino - 1];
    hold_Ctx.clearRect(0, 0, hold_Canvas.width, hold_Canvas.height);
    switch (hold_mino) {
      case 1:
        hold_Ctx.fillStyle = hold_color;
        hold_Ctx.fillRect(50, 30, 30, 30);
        hold_Ctx.fillRect(20, 60, 90, 30);
        break;
      case 2:
        hold_Ctx.fillStyle = hold_color;
        hold_Ctx.fillRect(5, 60, 120, 30);
        break;
      case 3:
        hold_Ctx.fillStyle = hold_color;
        hold_Ctx.fillRect(50, 30, 60, 30);
        hold_Ctx.fillRect(20, 60, 60, 30);
        break;
      case 4:
        hold_Ctx.fillStyle = hold_color;
        hold_Ctx.fillRect(20, 30, 60, 30);
        hold_Ctx.fillRect(50, 60, 60, 30);
        break;
      case 5:
        hold_Ctx.fillStyle = hold_color;
        hold_Ctx.fillRect(80, 30, 30, 30);
        hold_Ctx.fillRect(20, 60, 90, 30);
        break;
      case 6:
        hold_Ctx.fillStyle = hold_color;
        hold_Ctx.fillRect(20, 30, 30, 30);
        hold_Ctx.fillRect(20, 60, 90, 30);
        break;
      case 7:
        hold_Ctx.fillStyle = hold_color;
        hold_Ctx.fillRect(35, 30, 60, 60);
        break;
    }
}

function move_Left() {
  move_direction = "Left";
  push_ = true;
  Left_push = true;
  if (DAS_count === 0) {
    move_check();
    if (move_ === true) {
      tet_x--;
      set_mino();
    }
  }else if(DAS_count >= sensitivitys.DAS) {
    for (let i = 0; i < sensitivitys.ARR; i ++) {
        move_check();
        if (move_ === true) {
          tet_x--;
          set_mino();
    }
    }
  }
}

function move_Right() {
    move_direction = "Right";
    push_ = true;
    Right_push = true;
  if (DAS_count === 0) {
    move_check();
    if (move_ === true) {
      tet_x++;
      set_mino();
    }
  }else if(DAS_count >= sensitivitys.DAS) {
    for (let i = 0; i < sensitivitys.ARR; i ++) {
        move_check();
        if (move_ === true) {
          tet_x++;
          set_mino();
    }
    }
  }
}

function move_Down() {
  move_direction = "Down";
  move_check();
  if (move_ === true) {
    tet_y++;
    set_mino();
  }
}

function hardDrop() {
    if (canHardDrop === true) {
      move_direction = "HardDrop";
      move_check();
      canHardDrop = false;
      another_push = true;
    }
  }

function move_check() {
  move_ = true;
  let tet_mino_x = [];
  let tet_mino_y = [];
  let max;
  let block_y = [];
  let block_left = [];
  let block_right = [];
  for (let i = 0; i < 4; i++) {
    tet_mino_x[i] = save_tet_mino[i * 2 + 1];
    tet_mino_y[i] = save_tet_mino[i * 2];
  }
  for (let i = 0; i < 4; i++) {
    // 下
    for (let y = 0; y < 20; y++) {
      for (let yy = 0; tet_mino_y[i] + yy < 20; yy++) {
        if (put_minos[tet_mino_y[i] + yy][tet_mino_x[i]] !== 0) {
          block_y[i] = yy;
          break;
        }
      }
    }

    // 右
    for (let x = 0; x < 10; x++) {
      for (let xx = 0; tet_mino_x[i] + xx < 10; xx++) {
        if (put_minos[tet_mino_y[i]][tet_mino_x[i] + xx] !== 0) {
          block_right[i] = xx;
          break;
        }
      }
    }

    //   左
    for (let xx = 0; tet_mino_x[i] - xx >= 0; xx++) {
      if (put_minos[tet_mino_y[i]][tet_mino_x[i] - xx] !== 0) {
        block_left[i] = xx;
        break;
      }
    }
  }

  switch (move_direction) {
    case "Left":
      max = Math.min(...tet_mino_x);
      if (max === 0 || block_left.includes(1)) {
        move_ = false;
      }
      break;
    case "Right":
      max = Math.max(...tet_mino_x);
      if (9 - max === 0 || block_right.includes(1)) {
        move_ = false;
      }
      break;
    case "Down":
      max = Math.max(...tet_mino_y);
      if (19 - max === 0 || block_y.includes(1)) {
        move_ = false;
      }
      break;
    case "HardDrop":
      max = Math.max(...tet_mino_y);
      let distance = 19 - max;
      let block_distance = true;
      if (block_y.length !== 0) {
        if (block_y.includes(1)) {
        } else {
          for (let i = 0; i < 20; i++) {
            if (block_distance === true) {
              for (let i = 0; i < 4; i++) {
                block_y[i]--;
              }
              if (block_y.includes(1)) {
                block_distance = false;
              }
              tet_y++;
            }
          }
        }
      } else {
        while (distance > 0) {
          tet_y++;
          distance--;
        }
      }
      set_mino();
      put_mino();
      break;
  }
}

function lotate_Left() {
    if (canRotateLeft === true) {
      save_lotate_num = lotate_num;
  
      if (lotate_num === 3) {
        lotate_num = 0;
      } else {
        lotate_num++;
      }
  
      lotate_check();
      canRotateLeft = false;
      another_push = true;
    }
  }
  
  function lotate_Right() {
    if (canRotateRight === true) {
      save_lotate_num = lotate_num;
  
      if (lotate_num === 0) {
        lotate_num = 3;
      } else {
        lotate_num--;
      }
  
      lotate_check();
      canRotateRight = false;
      another_push = true;
    }
  }

function lotate_check() {
  let lotate_type = 0;
  let lotate_style_num = 0;
  let lotate = false;

  if (next_minos[0] !== 7) {
    switch (`${save_lotate_num}${lotate_num}`) {
      case "01":
        lotate_type = 0;
        break;
      case "03":
        lotate_type = 1;
        break;
      case "30":
        lotate_type = 2;
        break;
      case "32":
        lotate_type = 3;
        break;
      case "23":
        lotate_type = 4;
        break;
      case "21":
        lotate_type = 5;
        break;
      case "12":
        lotate_type = 6;
        break;
      case "10":
        lotate_type = 7;
        break;
    }

    let tet_xx = tet_x;
    let tet_yy = tet_y;

    if (save_tet_mino.length === 8) {
      for (let i = 0; i < 4; i++) {
        const clear_y = save_tet_mino[i * 2];
        const clear_x = save_tet_mino[i * 2 + 1];
        if (clear_y >= 0 && clear_y < 20 && clear_x >= 0 && clear_x < 10) {
          tet_tiles[clear_y][clear_x] = 0;
        }
      }
    }
    if (next_minos[0] !== 2) {
        for (let i = 0; i < 5; i++) {
            if (lotate === false) {
              tet_x = tet_xx + lotate_style[lotate_type * 10 + i * 2 + 1];
              tet_y = tet_yy + lotate_style[lotate_type * 10 + i * 2];
      
              let test_positions = [];
              let valid = true;
      
              for (let block = 0; block < 4; block++) {
                let test_y =
                  tet_y +
                  mino_style[(next_minos[0] - 1) * 32 + lotate_num * 8 + 4 + block];
                let test_x =
                  tet_x +
                  mino_style[(next_minos[0] - 1) * 32 + lotate_num * 8 + block];
      
                if (test_y < 0 || test_y >= 20 || test_x < 0 || test_x >= 10) {
                  valid = false;
                  break;
                }
      
                if (put_minos[test_y][test_x] !== 0) {
                  valid = false;
                  break;
                }
      
                test_positions.push({ x: test_x, y: test_y });
              }
      
              if (valid) {
                lotate = true;
                set_mino();
                break;
              } else {
                lotate_style_num++;
              }
            }
          }
      
          if (lotate === false) {
            tet_x = tet_xx;
            tet_y = tet_yy;
            lotate_num = save_lotate_num;
            set_mino();
          }
    }else {
        for (let i = 0; i < 5; i++) {
            if (lotate === false) {
              tet_x = tet_xx + lotate_I[lotate_type * 10 + i * 2 + 1];
              tet_y = tet_yy + lotate_I[lotate_type * 10 + i * 2];
      
              let test_positions = [];
              let valid = true;
      
              for (let block = 0; block < 4; block++) {
                let test_y =
                  tet_y +
                  mino_style[(next_minos[0] - 1) * 32 + lotate_num * 8 + 4 + block];
                let test_x =
                  tet_x +
                  mino_style[(next_minos[0] - 1) * 32 + lotate_num * 8 + block];
      
                if (test_y < 0 || test_y >= 20 || test_x < 0 || test_x >= 10) {
                  valid = false;
                  break;
                }
      
                if (put_minos[test_y][test_x] !== 0) {
                  valid = false;
                  break;
                }
      
                test_positions.push({ x: test_x, y: test_y });
              }
      
              if (valid) {
                lotate = true;
                set_mino();
                break;
              } else {
                lotate_style_num++;
              }
            }
          }
      
          if (lotate === false) {
            tet_x = tet_xx;
            tet_y = tet_yy;
            lotate_num = save_lotate_num;
            set_mino();
          }
    }
  } else {
    set_mino();
  }
}

setInterval(() => {
    if (DCD_count === sensitivitys.DCD || DCD_count === 0) {
      if (keys.ArrowUp) hardDrop();
      if (keys.z) lotate_Left();
      if (keys.x) lotate_Right();
      if (keys.ArrowLeft && keys.ArrowRight) {
      } else if (keys.ArrowLeft) {
        move_Left();
      } else if (keys.ArrowRight) {
        move_Right();
      }
      
      if (keys.ArrowDown) move_Down();
      if (keys.c) hold();
      
      DCD_count = 0;
      another_push = false;
      push_interval_count = 0;
    }
    if (push_ === true && !(keys.ArrowLeft && keys.ArrowRight)) {
        DAS_count++;
    }
    
    if (another_push === true) {
      DCD_count++;
    }
    if (auto_mino_down === 60) {
        auto_mino_down = 0;
        move_Down();
    } else {
        auto_mino_down++;
    }
    draw_tiles();
    draw_shadow();
    draw_line();
    draw_hold();
  }, 16);

start();
