import { randomIntFromInterval } from "common-helpers";

export function GenerateBinaryTree(options) {
    let x1 = options.x1;
    let x2 = options.x2;
    let y1 = options.y1;
    let y2 = options.y2;

    let minLevels = 4;
    let maxLevels = 12;

    let maxWidth = 9;
    let maxHeight = 9;

    let roomPadding = options.roomPadding || 0;

    let minWidth = 3 + roomPadding;
    let minHeight = 3 + roomPadding;

    let splitOptions = {
        minHeight: minHeight,
        minWidth: minWidth,
        x1: x1,
        x2: x2,
        y1: y1,
        y2: y2,
        padding: roomPadding,
        level: 1,
        minLevels: minLevels,
        maxLevels: maxLevels,
        levelName: "X",
        maxWidth: maxWidth,
        maxHeight: maxHeight,
        splitWay: null
    };

    let splits = new BinaryTreeSplitter(splitOptions);

    while(!splits.branch1 || !splits.branch2) {
        console.log("retry generation");
        splits = new BinaryTreeSplitter(splitOptions);
    }

    let allRooms = returnAllChildRooms(splits);

    let potk1rooms = [];
    let poth2rooms = [];
    let potk3rooms = [];

    for(let i = 0; i < allRooms.length; i++) {
        let room = allRooms[i];

        if(room.potentialKeyroomFor == 1) {
            potk1rooms.push(room);
        }

        if(room.potentialKeyroomFor == 2) {
            poth2rooms.push(room);
        }

        if(room.potentialKeyroomFor == 3) {
            potk3rooms.push(room);
        }
    }

    let k1Room,k2Room, k3Room = null;


    if(potk1rooms.length > 0) {
        k1Room = potk1rooms.pop();
        k1Room.keyRoom = 1;
    }

    if(poth2rooms.length > 0) {
        k2Room = poth2rooms.pop();
        k2Room.keyRoom = 2;
    }

    if(potk3rooms.length > 0) {
        k3Room = potk3rooms.pop();
        k3Room.keyRoom = 3;
    }

    for(let i = 0; i < allRooms.length; i++) {
        let room = allRooms[i];

        for(let j = 0; j < room.doors.length; j++) {
            let door = room.doors[j];

            if(door.keyId == 1 || !k1Room || k1Room.keyRoom != 1) {
                door.locked = false;
                door.keyId = 0;
            }

            if(door.keyId == 2 || !k2Room || k2Room.keyRoom != 2) {
                door.locked = false;
                door.keyId = 0;
            }

            if(door.keyId == 3 || !k3Room || k3Room.keyRoom != 3) {
                door.locked = false;
                door.keyId = 0;
            }
        }
    }

    return splits;
}

class BinaryTreeSplitter {
    constructor(options) {
        /*
            LOCKS AND KEYS NEEDED
            ---------------------
            For a 3 key setup, IE Red/Blue/Yellow Keys
            By Level Name

            X:      Lock #2
            XA:     Lock #1
            XAA:    Key #1 + Player Start
            XAB:    Key #2
            XB:     Lock #3
            XBA:    Key #3
            XBB:    Exit
        */

        this.levelName = options.levelName;
        
        this.x1 = options.x1 + options.padding;
        this.x2 = options.x2 - options.padding;
        this.y1 = options.y1 + options.padding;
        this.y2 = options.y2 - options.padding;
    
        this.width = options.x2 - options.x1;
        this.height = options.y2 - options.y1;
    
        this.level = options.level;
    
        this.branch1 = null;
        this.branch2 = null;
    
            
    
        this.isRoom = false;
        this.isSpawnRoom = false;
        this.isExitRoom = false;
    
        this.keyRoom = 0;
        this.potentialKeyroomFor = 0;
    
        this.doors = [];
    
        if(this.width <= options.minWidth + 2 || this.height <= this.minHeight + 2) {
            this.isRoom = true;
        }
    
            
    
        if(this.level >= options.maxLevels) {
            this.isRoom = true;
        }
    
        if(this.level > options.minLevels) {
            let doneChance = randomIntFromInterval(1, 6);
    
            if(doneChance == 2) {
                this.isRoom = true;
            }
                
                
        }
    
        if(this.isRoom && this.width >= options.maxWidth + 2 || this.height >= this.maxHeight + 2) {
            this.isRoom = false;
        }
    
        let splitPos = 0;
    
        if(!this.isRoom) {
                
    
            splitPos = randomIntFromInterval(1, 2);
    
            let branch1Opts = null;
            let branch2Opts = null;
        
            if(this.width > this.height * 2) {
                splitPos = 2;
            }
        
            if(this.height > this.width * 2) {
                splitPos = 1;
            }
        
            if(splitPos == 1) {
                this.splitWay = "H";
    
                let heightThird = Math.round(this.height * 0.33);
        
                let splitY = randomIntFromInterval(this.y1 + heightThird, this.y2 - heightThird);
    
                let h1 = splitY - this.y1;
                let h2 = this.y2 - splitY;
    
                if(h1 > options.minHeight && h2 > options.minHeight) {
    
                    branch1Opts = {
                        minHeight: options.minHeight,
                        minWidth: options.minWidth,
                        x1: this.x1,
                        x2: this.x2,
                        y1: this.y1,
                        y2: splitY,
                        padding: options.padding,
                        level: this.level + 1,
                        minLevels: options.minLevels,
                        maxLevels: options.maxLevels,
                        levelName: this.levelName + "A",
                        maxWidth: options.maxWidth,
                        maxHeight: options.maxHeight
                    };
    
                    branch2Opts = {
                        minHeight: options.minHeight,
                        minWidth: options.minWidth,
                        x1: this.x1,
                        x2: this.x2,
                        y1: splitY,
                        y2: this.y2,
                        padding: options.padding,
                        level: this.level + 1,
                        minLevels: options.minLevels,
                        maxLevels: options.maxLevels,
                        levelName: this.levelName + "B",
                        maxWidth: options.maxWidth,
                        maxHeight: options.maxHeight
                    };
                }
        
                    
            } else {
                this.splitWay = "V";
    
                let widthThird = Math.round(this.width * 0.33);
        
                let splitX = randomIntFromInterval(this.x1 + widthThird, this.x2 - widthThird);
    
                let w1 = splitX - this.x1;
                let w2 = this.x2 - splitX;
    
                if(w1 > options.minWidth && w2 > options.minWidth) {
    
                    branch1Opts = {
                        minHeight: options.minHeight,
                        minWidth: options.minWidth,
                        x1: this.x1,
                        x2: splitX,
                        y1: this.y1,
                        y2: this.y2,
                        padding: options.padding,
                        level: this.level + 1,
                        minLevels: options.minLevels,
                        maxLevels: options.maxLevels,
                        levelName: this.levelName + "A",
                        maxWidth: options.maxWidth,
                        maxHeight: options.maxHeight
                    };
    
                    branch2Opts = {
                        minHeight: options.minHeight,
                        minWidth: options.minWidth,
                        x1: splitX,
                        x2: this.x2,
                        y1: this.y1,
                        y2: this.y2,
                        padding: options.padding,
                        level: this.level + 1,
                        minLevels: options.minLevels,
                        maxLevels: options.maxLevels,
                        levelName: this.levelName + "B",
                        maxWidth: options.maxWidth,
                        maxHeight: options.maxHeight
                    };
    
                }
         
            }
                
            if(branch1Opts && branch2Opts) {
                let tries = 0;
    
        
                while(tries < 20 && (!this.branch1 || !this.branch2)) {
                    console.log("RETRY BRANCH");
        
                    this.branch1 = new BinaryTreeSplitter(branch1Opts);
                    this.branch2 = new BinaryTreeSplitter(branch2Opts);
        
                    tries++;
                }
            }
                
        }

        // we need a door between branches
        if(this.branch1 != null && this.branch2 != null && this.splitWay != null) {
            let doorPos = checkForBSPDoorPosition(this);
    
            if(doorPos) {
                let locked = false;
                let keyId = 0;
    
                if(this.levelName == "X") {
                    locked = true;
                    keyId = 2;
                }
    
                if(this.levelName == "XA") {
                    locked = true;
                    keyId = 1;
                }
    
                if(this.levelName == "XB") {
                    locked = true;
                    keyId = 3;
                }
    
                this.doors.push({
                    x: doorPos.x,
                    y: doorPos.y,
                    locked: locked,
                    keyId: keyId
                });
            } else {
                clearOutLeaves(this);
            }
        }
    
    
        if(this.branch1 == null && this.branch2 == null) {
            this.isRoom = true;
    
            if(this.levelName.indexOf("B") == -1) {
                this.isSpawnRoom = true;
            }
    
            if(this.levelName.indexOf("A") == -1) {
                this.isExitRoom = true;
            }
    
            if(!this.isSpawnRoom && !this.isExitRoom) {
                if(this.levelName.indexOf("XAA") == 0) {
                    this.potentialKeyroomFor = 1;
                }
    
                if(this.levelName.indexOf("XAB") == 0) {
                    this.potentialKeyroomFor = 2;
                }
    
                if(this.levelName.indexOf("XBA") == 0) {
                    this.potentialKeyroomFor = 3;
                }
            }
        }
    }
}

function checkForBSPDoorPosition(branch) {
    let pos = {
        x: branch.x1 + 1,
        y: branch.y1 + 1
    };

    let fails = 0;

    if(branch.splitWay == "H") {
        pos.y = branch.branch1.y2;

        let xBlocked = true;

        while(xBlocked) {
            pos.x = randomIntFromInterval(branch.x1 + 1,branch.branch1.x2 - 1);
            xBlocked = checkTreeForXBlockage(branch,pos.x,1);

            if(xBlocked) {
                fails++;

                if(fails >= 100) {
                    console.log("pos failed!");
                    pos = null;
                    break;
                }
            }
        }
    }

    if(branch.splitWay == "V") {
        pos.x = branch.branch1.x2;

        let yBlocked = true;

        while(yBlocked) {
            pos.y = randomIntFromInterval(branch.y1 + 1,branch.branch1.y2 - 1);
            yBlocked = checkTreeForYBlockage(branch,pos.y,1);

            if(yBlocked) {
                fails++;

                if(fails >= 100) {
                    console.log("pos failed!");
                    pos = null;
                    break;
                }
            }
        }
    }

    return pos;
}

function clearOutLeaves(branch) {
    branch.branch1 = null;
    branch.branch2 = null;
    branch.splitWay = null;
}

function checkTreeForXBlockage(branch,xPos,padding) {
    let blocked = false;

    if(branch.branch1 && branch.branch2) {

        for(let i = 0; i <= padding; i++) {
            if(branch.branch1.x1 + i == xPos) {
                blocked = true;
            }

            if(branch.branch1.x2 - i == xPos) {
                blocked = true;
            }

            if(xPos > branch.branch1.x2) {
                return true;
            }

            /*
            if(branch.branch2.x1 + i == xPos) {
                blocked = true;
            }

            if(branch.branch2.x2 - i == xPos) {
                blocked = true;
            }*/
        }

        if(!blocked) {
            blocked = checkTreeForXBlockage(branch.branch1,xPos,padding);
        }

        if(!blocked) {
            blocked = checkTreeForXBlockage(branch.branch2,xPos,padding);
        }

    }

    return blocked;
}

function checkTreeForYBlockage(branch,yPos,padding) {
    let blocked = false;

    if(branch.branch1 && branch.branch2) {

        for(let i = 0; i <= padding; i++) {
            if(branch.branch1.y1 + i == yPos) {
                blocked = true;
            }

            if(branch.branch1.y2 - i == yPos) {
                blocked = true;
            }

            if(yPos > branch.branch1.y2) {
                blocked = true;
            }

            /*
            if(branch.branch2.y1 + i == yPos) {
                blocked = true;
            }

            if(branch.branch2.y2 - i == yPos) {
                blocked = true;
            }
            */
        }

        if(!blocked) {
            blocked = checkTreeForYBlockage(branch.branch1,yPos,padding);
        }

        if(!blocked) {
            blocked = checkTreeForYBlockage(branch.branch2,yPos,padding);
        }

    }

    return blocked;
}

function returnAllChildRooms(branch) {
    let allRooms = [];

    if(branch.branch1 && branch.branch2) {
        
        let childrenA = returnAllChildRooms(branch.branch1);
        let chidrenB = returnAllChildRooms(branch.branch2);

        allRooms = allRooms.concat(childrenA);
        allRooms = allRooms.concat(chidrenB);
    } else {
        allRooms.push(branch);
    }

    return allRooms;
}

export default {
    GenerateBinaryTree
};