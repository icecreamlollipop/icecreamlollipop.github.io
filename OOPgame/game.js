
// third-party code: throughout this entire thing, w3schools was used, as well as jQuery

const GRID_SIZE = 6;
const WIN_NUMBER = 2187;
const TRANSITION_TIME = 0.2;

function randRange(up) {
    return Math.floor(Math.random()*up);
}

class Game {
    static WINCON = WIN_NUMBER;
    constructor() {
        this.reset();
        $(document).keydown(event => Game.keydown(this,event));
    }
    static keydown(game, event) { // whenever user presses a key
        let key = event.keyCode;
        const keydir = {37:[0,-1], 38:[-1,0], 39:[0,1], 40:[1,0]};
        if (!keydir[key]) return;
        event.preventDefault();
        game.move(keydir[key]);
    }
    move(dir) {
        let isValid = this.grid.move(dir);
        if (!isValid) return;
        this.grid.generateSquare();
        this.grid.draw();
        if (this.grid.maxNum() >= Game.WINCON) this.win();
        if (!this.grid.anyMovesLeft()) this.lose();
    }
    reset(){    // clears the entire grid
        this.isWon = false;
        this.grid = Grid.newGrid();
        this.grid.draw();
    }
    win(){
        if (this.isWon) return;
        this.isWon = true;
        setTimeout(() => {
            let more = confirm("Congrats! You have won! Would you like to continue playing? (Pressing cancel will reset the game)");
            if (!more) this.reset();
        }, 50)
    }
    lose(){
        setTimeout(() => {
            alert("You lost! Press OK to play a new game");
            this.reset();
        }, 50);
    }
}

class Grid {
    static SIZE = GRID_SIZE;
    static grid = undefined;    // singleton used here
    static newGrid() {
        if (!Grid.grid) {
            Grid.grid = new Grid();
        }
        Grid.grid.reset();
        for (let i=0;i<3;i++) Grid.grid.generateSquare();
        return Grid.grid;
    }
    constructor() {
        const elem = $('.grid-container');
        elem.css('width',120*Grid.SIZE);
        elem.css('height',120*Grid.SIZE);
        let innerhtml = '';
        let gcolumns = '';
        for (let x=0;x<Grid.SIZE*Grid.SIZE;x++) {
            innerhtml += '<div class="grid-item" />';
        }
        for (let x=0;x<Grid.SIZE;x++) {
            gcolumns += 'auto ';
        }
        elem.html(innerhtml);
        elem.css('grid-template-columns',gcolumns);
        $('.grid-item').css('transition',TRANSITION_TIME+'s');
        this.reset();
    }
    move(dir, justCheck=false){
        let anyMoved = false;
        const START = {1:Grid.SIZE-1, 0:0, "-1":0};
        const END = {1:-1, 0:Grid.SIZE, "-1":Grid.SIZE};
        const STEP = {1:-1, 0:1, "-1":1};
        let dir_a = dir[0];
        let dir_b = dir[1];
        for (let a=START[dir_a]; a != END[dir_a]; a+=STEP[dir_a]) {
            for (let b=START[dir_b]; b != END[dir_b]; b+=STEP[dir_b]) {
                if (!this.squares[a][b].isReal()) continue;
                let xa = a;
                let xb = b;
                while (true) {
                    let pa = xa+dir_a;
                    let pb = xb+dir_b;
                    if (!Grid.inrange(pa,pb)) break;
                    if (!this.squares[pa][pb].isReal()) {
                        if (justCheck) return true;
                        let tmp = this.squares[pa][pb];
                        this.squares[pa][pb] = this.squares[xa][xb];
                        this.squares[xa][xb] = tmp;
                        anyMoved = true;
                        xa = pa;
                        xb = pb;
                        continue;
                    }
                    let ppa = pa+dir_a;
                    let ppb = pb+dir_b;
                    if (!Grid.inrange(ppa,ppb)) break;
                    if (this.squares[pa][pb].isReal() && this.squares[ppa][ppb].isReal()) {
                        let xnum = this.squares[xa][xb].getNum();
                        let pnum = this.squares[pa][pb].getNum();
                        let ppnum = this.squares[ppa][ppb].getNum();
                        if (xnum==pnum && pnum==ppnum) {
                            // merge squares
                            if (justCheck) return true;
                            this.squares[ppa][ppb] = makeSquare(this.squares[ppa][ppb].getNum()*3);
                            this.squares[xa][xb] = makeSquare();
                            this.squares[pa][pb] = makeSquare();
                            anyMoved = true;
                            xa = ppa;
                            xb = ppb;
                            continue;
                        }
                    }
                    break;
                }
            }
        }
        return anyMoved;
    }
    anyMovesLeft() {    // checks if there are any more moves left for the user
        let ans = false;
        [[-1,0],[1,0],[0,-1],[0,1]].forEach(dir => {
            ans ||= this.move(dir,true);
        })
        return ans;
    }
    static inrange(a,b) {
        if (a<0 || Grid.SIZE<=a) return false;
        if (b<0 || Grid.SIZE<=b) return false;
        return true;
    }
    generateSquare(){   // factory is used here
        if (!this.spacesLeft()) return false;
        while (true) {
            let a = randRange(Grid.SIZE);
            let b = randRange(Grid.SIZE);
            if (this.squares[a][b].isReal()) continue;
            this.squares[a][b] = makeSquare(3);
            return true;
        }
    }
    reset() {
        this.squares = [];
        for (let a=0;a<Grid.SIZE;a++) {
            let row = [];
            for (let b=0;b<Grid.SIZE;b++) row.push(makeSquare());
            this.squares.push(row);
        }
    }
    spacesLeft() {  // returns number of spaces that are blank i.e. no square on them
        let empties = Grid.SIZE*Grid.SIZE;
        for (let a=0;a<Grid.SIZE;a++) {
            for (let b=0;b<Grid.SIZE;b++) {
                if (this.squares[a][b].isReal()) empties--;
            }
        }
        return empties;
    }
    maxNum() {  // returns the max number on the grid
        let ans = 0;
        for (let a=0;a<Grid.SIZE;a++) {
            for (let b=0;b<Grid.SIZE;b++) {
                if (this.squares[a][b].isReal()) {
                    if (this.squares[a][b].getNum() > ans) {
                        ans = this.squares[a][b].getNum();
                    }
                }
            }
        }
        return ans;
    }
    draw() {
        let a=0;
        let b=0;
        $('.grid-item').each((index, item) => {
            this.squares[a][b].draw(item);
            b++;
            if (b==Grid.SIZE) {
                a++;
                b = 0;
            }
        });
    }
}

class Square {
    static makeSquare(number=0) {
        if (number==0) return new NullSquare();
        let ans = new Square(number);
        if (number>=WIN_NUMBER) ans = new SparkleSquare(ans);
        if (number == 3) ans.setColor('#ffff00');
        else if (number == 9) ans.setColor('#ffaa00');
        else if (number == 27) ans.setColor('#ff5500');
        else if (number == 81) ans.setColor('#ff0000');
        else if (number == 243) ans.setColor('#ff0077');
        else if (number == 729) ans.setColor('#ff00ff');
        else if (number == 2187) ans.setColor('#7700ff');
        else ans.setColor('#0000ff');
        return ans;
    }

    constructor(number) {
        this.number = number;
        this.color = 'Beige';
    }
    setColor(col) {
        this.color = col;
    }
    getString() {
        return this.number.toString();
    }
    getNum() {
        return this.number;
    }
    draw(element){
        $(element).html(this.getString());
        $(element).css('background-color', this.color)
    }
    isReal() {
        return true;
    }
}

class NullSquare extends Square {
    constructor() {
        super(0);
    }
    getString() {
        return '';
    }
    isReal() {
        return false;
    }
}

class SquareDecorator extends Square {  // decorator used here, obviously
    constructor(square) {
        super(0);
        this.square = square;
    }
    setColor(col) {
        return this.square.setColor(col);
    }
    getString() {
        return this.square.getString();
    }
    getNum() {
        return this.square.getNum();
    }
    draw(element) {
        return this.square.draw(element);
    }
    isReal() {
        return this.square.isReal();
    }
}

class SparkleSquare extends SquareDecorator {
    draw(element  ) {
        super.draw(element);
        $(element).css('color','#FFD700');
        setTimeout(() => {
            $(element).css('color','#000000');
        }, TRANSITION_TIME*1000);
    }
}

let makeSquare = Square.makeSquare;

function init() {
    let g = new Game();
    $('#startover').click(g.reset);
}
