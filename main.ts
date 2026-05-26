// 1. STRICT INTERFACES
interface PlatformData {
    x: number;
    y: number;
    w: number;
    h: number;
    platType: string; // "normal", "spikes", "retry", "goal", "phaseBlue", "phaseRed"
}

interface MagnetData {
    x: number;
    y: number;
    color: string;
    isFloor: boolean;
}

interface LevelData {
    door: string;
    spawnX: number;
    spawnY: number;
    goalX: number;
    platforms: PlatformData[];
    nodes: MagnetData[];
}

// 2. CORE GAME STATE
let playerX = 15;
let playerY = 40;
let playerVx = 0;
let playerVy = 0;
let playerColor = "blue";
let isGrounded = false;
let currentStage = 0;
let livesCount = 3;

let activeTetherNode: MagnetData = null;
let tetherLength = 0;

// CAMERA
let camX = 0;

// 3. WIDE LEVEL DEFINITIONS (8 STAGES - 2 KISHOTENKETSU LOOPS)
const levels: LevelData[] = [
    // --- LOOP 1: THE TETHER CORE (STAGES 1-4) ---
    {
        // Stage 1: Safe Space (Ki)
        door: "1", spawnX: 10, spawnY: 40, goalX: 230,
        platforms: [
            { x: 0, y: 75, w: 60, h: 45, platType: "normal" },
            { x: 60, y: 90, w: 80, h: 30, platType: "retry" },
            { x: 140, y: 75, w: 110, h: 45, platType: "goal" }
        ],
        nodes: [
            { x: 100, y: 25, color: "blue", isFloor: false }
        ]
    },
    {
        // Stage 2: Challenge & Pillar (Sho)
        door: "2", spawnX: 10, spawnY: 40, goalX: 280,
        platforms: [
            { x: 0, y: 75, w: 60, h: 45, platType: "normal" },
            { x: 60, y: 114, w: 70, h: 15, platType: "spikes" },
            { x: 130, y: 60, w: 20, h: 60, platType: "normal" },
            { x: 150, y: 114, w: 70, h: 15, platType: "spikes" },
            { x: 220, y: 75, w: 80, h: 45, platType: "goal" }
        ],
        nodes: [
            { x: 95, y: 15, color: "blue", isFloor: false },
            { x: 185, y: 15, color: "red", isFloor: false }
        ]
    },
    {
        // Stage 3: The Massive Gap (Ten)
        door: "3", spawnX: 10, spawnY: 40, goalX: 320,
        platforms: [
            { x: 0, y: 75, w: 40, h: 45, platType: "normal" },
            { x: 40, y: 114, w: 240, h: 15, platType: "spikes" },
            { x: 280, y: 75, w: 60, h: 45, platType: "goal" }
        ],
        nodes: [
            { x: 80, y: 25, color: "blue", isFloor: false },
            { x: 140, y: 25, color: "red", isFloor: false },
            { x: 200, y: 25, color: "blue", isFloor: false },
            { x: 260, y: 25, color: "red", isFloor: false }
        ]
    },
    {
        // Stage 4: Mastery Integration (Ketsu)
        door: "4", spawnX: 10, spawnY: 60, goalX: 430,
        platforms: [
            { x: 0, y: 95, w: 40, h: 25, platType: "normal" },
            { x: 40, y: 114, w: 350, h: 15, platType: "spikes" },
            { x: 130, y: 40, w: 40, h: 20, platType: "normal" },
            { x: 390, y: 60, w: 60, h: 60, platType: "goal" }
        ],
        nodes: [
            { x: 70, y: 105, color: "red", isFloor: true },
            { x: 190, y: 55, color: "blue", isFloor: false },
            { x: 250, y: 55, color: "red", isFloor: false },
            { x: 310, y: 55, color: "blue", isFloor: false },
            { x: 370, y: 55, color: "red", isFloor: false }
        ]
    },

    // --- LOOP 2: QUANTUM PHASE FIELDS (STAGES 5-8) ---
    {
        // Stage 5: Phase Shift Introduction (Ki)
        door: "5", spawnX: 10, spawnY: 40, goalX: 320,
        platforms: [
            { x: 0, y: 80, w: 40, h: 40, platType: "normal" },
            { x: 40, y: 85, w: 10, h: 35, platType: "normal" },
            { x: 50, y: 90, w: 10, h: 30, platType: "normal" },
            { x: 60, y: 95, w: 220, h: 25, platType: "normal" },
            { x: 80, y: 75, w: 35, h: 10, platType: "phaseBlue" },
            { x: 140, y: 75, w: 35, h: 10, platType: "phaseRed" },
            { x: 200, y: 75, w: 35, h: 10, platType: "phaseBlue" },
            { x: 260, y: 80, w: 80, h: 40, platType: "goal" }
        ],
        nodes: []
    },
    {
        // Stage 6: The Ghost Barrier Swing (Sho)
        door: "6", spawnX: 10, spawnY: 40, goalX: 330, // Right edge
        platforms: [
            { x: 0, y: 85, w: 40, h: 35, platType: "normal" },
            { x: 40, y: 114, w: 250, h: 15, platType: "spikes" },
            { x: 140, y: 25, w: 15, h: 65, platType: "phaseBlue" },
            { x: 240, y: 25, w: 15, h: 65, platType: "phaseRed" }, // Red wall to force color swap!
            { x: 290, y: 85, w: 60, h: 35, platType: "goal" }
        ],
        nodes: [
            { x: 95, y: 20, color: "red", isFloor: false },
            { x: 195, y: 20, color: "blue", isFloor: false }
        ]
    },
    {
        // Stage 7: The Rhythm Drop Filter (Ten)
        door: "7", spawnX: 15, spawnY: 30, goalX: 330,
        platforms: [
            { x: 0, y: 65, w: 45, h: 55, platType: "normal" },
            { x: 45, y: 114, w: 255, h: 15, platType: "spikes" },
            { x: 70, y: 75, w: 30, h: 10, platType: "phaseBlue" },
            { x: 125, y: 65, w: 30, h: 10, platType: "phaseRed" },
            { x: 180, y: 55, w: 30, h: 10, platType: "phaseBlue" },
            { x: 235, y: 65, w: 30, h: 10, platType: "phaseRed" },
            { x: 285, y: 75, w: 65, h: 45, platType: "goal" }
        ],
        nodes: []
    },
    {
        // Stage 8: Grand Convergence Gauntlet (Ketsu)
        door: "8", spawnX: 10, spawnY: 40, goalX: 410,
        platforms: [
            { x: 0, y: 85, w: 35, h: 40, platType: "normal" },
            { x: 35, y: 114, w: 345, h: 15, platType: "spikes" },
            { x: 120, y: 75, w: 35, h: 10, platType: "phaseBlue" },
            { x: 245, y: 20, w: 15, h: 65, platType: "phaseRed" },
            { x: 370, y: 85, w: 60, h: 40, platType: "goal" }
        ],
        nodes: [
            { x: 65, y: 105, color: "red", isFloor: true },
            { x: 195, y: 25, color: "blue", isFloor: false },
            { x: 310, y: 105, color: "blue", isFloor: true }
        ]
    }
];

function handlePlayerDeath() {
    livesCount--;
    if (livesCount <= 0) {
        game.over(false);
    } else {
        resetPlayer();
    }
}

function resetPlayer() {
    let lvl = levels[currentStage];
    playerX = lvl.spawnX;
    playerY = lvl.spawnY;
    playerVx = 0;
    playerVy = 0;
    playerColor = "blue";
    activeTetherNode = null;
}

// B BUTTON TO SWAP POLARITY
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    playerColor = (playerColor == "blue") ? "red" : "blue";
});

function getDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function resolveCollision(axis: string, lvl: LevelData) {
    for (let i = 0; i < lvl.platforms.length; i++) {
        let plat = lvl.platforms[i];

        if (plat.platType == "phaseBlue" && playerColor != "blue") continue;
        if (plat.platType == "phaseRed" && playerColor != "red") continue;

        if (playerX + 8 > plat.x && playerX < plat.x + plat.w &&
            playerY + 12 > plat.y && playerY < plat.y + plat.h) {

            if (plat.platType == "spikes") {
                handlePlayerDeath();
                return;
            }

            if (axis == "x") {
                if (playerVx > 0) playerX = plat.x - 8;
                if (playerVx < 0) playerX = plat.x + plat.w;
                playerVx = 0;
            } else {
                if (playerVy > 0) {
                    playerY = plat.y - 12;
                    playerVy = 0;
                    isGrounded = true;
                } else if (playerVy < 0) {
                    playerY = plat.y + plat.h;
                    playerVy = 0;
                }
            }
        }
    }
}

// 4. MAIN GAME ENGINE LOOP
game.onUpdate(function () {
    let lvl = levels[currentStage];

    camX = Math.max(0, playerX - 60);

    if (controller.left.isPressed()) playerVx -= 0.35;
    if (controller.right.isPressed()) playerVx += 0.35;

    if (controller.up.isPressed() && isGrounded && !controller.A.isPressed()) {
        playerVy = -2.3;
        isGrounded = false;
    }

    playerVy += 0.15;
    playerVx *= activeTetherNode ? 0.97 : 0.82;
    playerVy *= 0.98;

    if (controller.A.isPressed()) {
        if (!activeTetherNode) {
            let targetNode: MagnetData = null;
            let bestDistance = 85;

            for (let i = 0; i < lvl.nodes.length; i++) {
                let node = lvl.nodes[i];
                let d = getDistance(playerX + 4, playerY + 6, node.x, node.y);
                if (d < bestDistance) {
                    bestDistance = d;
                    targetNode = node;
                }
            }

            if (targetNode) {
                if (playerColor == targetNode.color) {
                    if (targetNode.isFloor) {
                        playerVy = -5.6;
                        playerVx = 2.2;
                    } else {
                        let dx = (playerX + 4) - targetNode.x;
                        playerVx += dx > 0 ? 1.3 : -1.3;
                        playerVy += 0.8;
                    }
                } else {
                    activeTetherNode = targetNode;
                    tetherLength = bestDistance;
                }
            }
        } else {
            if (playerColor == activeTetherNode.color) {
                activeTetherNode = null;
            } else {
                let pX = playerX + 4;
                let pY = playerY + 6;
                let dist = getDistance(pX, pY, activeTetherNode.x, activeTetherNode.y);

                if (dist > tetherLength) {
                    let dx = (pX - activeTetherNode.x) / dist;
                    let dy = (pY - activeTetherNode.y) / dist;

                    playerX = (activeTetherNode.x + dx * tetherLength) - 4;
                    playerY = (activeTetherNode.y + dy * tetherLength) - 6;

                    let dotProduct = playerVx * dx + playerVy * dy;
                    if (dotProduct > 0) {
                        playerVx -= dotProduct * dx;
                        playerVy -= dotProduct * dy;
                    }
                }
            }
        }
    } else {
        activeTetherNode = null;
    }

    playerX += playerVx;
    resolveCollision("x", lvl);

    if (playerX < 0) {
        playerX = 0;
        if (playerVx < 0) playerVx = 0;
    }

    playerY += playerVy;
    isGrounded = false;
    resolveCollision("y", lvl);

    if (playerX > lvl.goalX) {
        if (currentStage < levels.length - 1) {
            currentStage++;
            resetPlayer();
        } else {
            game.over(true);
        }
    }

    if (playerY > 135) {
        handlePlayerDeath();
    }
});

// 5. GRAPHICS ENGINE
game.onPaint(function () {
    let lvl = levels[currentStage];
    let tick = game.runtime() / 150;

    screen.fill(15);

    for (let n = 0; n < 3; n++) {
        let nebX = (n * 100 - Math.floor(camX * 0.1)) % 200;
        if (nebX < -40) nebX += 200;
        screen.fillCircle(nebX, 30 + (n * 25), 18, 12);
        screen.fillCircle(nebX + 15, 35 + (n * 25), 12, 11);
    }

    for (let i = 0; i < 25; i++) {
        let starScale = (i % 3 == 0) ? 0.35 : 0.20;
        let sX = (i * 43 - Math.floor(camX * starScale)) % 160;
        if (sX < 0) sX += 160;
        let sY = (i * 17) % 120;
        let starColor = 1;
        if (i % 4 == 0) starColor = 9;
        if (i % 7 == 0) starColor = 5;

        if (i % 2 == 0 && Math.sin(tick + i) > 0.4) {
            screen.setPixel(sX, sY, starColor);
        } else if (i % 2 != 0) {
            screen.setPixel(sX, sY, starColor);
        }
    }

    for (let i = 0; i < lvl.platforms.length; i++) {
        let plat = lvl.platforms[i];
        let dX = plat.x - camX;

        if (dX > 160 || dX + plat.w < 0) continue;

        if (plat.platType == "spikes") {
            let laserColor = (Math.floor(tick) % 2 == 0) ? 2 : 4;
            screen.fillRect(dX, plat.y + 3, plat.w, 4, laserColor);
            for (let s = 0; s < plat.w; s += 8) {
                screen.drawLine(dX + s, plat.y + 7, dX + s + 4, plat.y, laserColor);
                screen.drawLine(dX + s + 4, plat.y, dX + s + 8, plat.y + 7, laserColor);
            }
        } else if (plat.platType == "phaseBlue" || plat.platType == "phaseRed") {
            let isBlueField = plat.platType == "phaseBlue";
            let isActive = isBlueField ? (playerColor == "blue") : (playerColor == "red");

            if (isActive) {
                let coreColor = isBlueField ? 9 : 4;
                screen.fillRect(dX, plat.y, plat.w, plat.h, isBlueField ? 11 : 2);
                screen.drawRect(dX, plat.y, plat.w, plat.h, coreColor);
                screen.drawLine(dX + 2, plat.y + (plat.h / 2), dX + plat.w - 3, plat.y + (plat.h / 2), 1);
            } else {
                let ghostColor = isBlueField ? 11 : 2;
                if (Math.floor(tick) % 2 == 0) {
                    screen.drawRect(dX, plat.y, plat.w, plat.h, ghostColor);
                }
            }
        } else {
            screen.fillRect(dX, plat.y, plat.w, plat.h, 15);
            screen.drawRect(dX, plat.y, plat.w, plat.h, 11);
            screen.drawLine(dX, plat.y, dX + plat.w, plat.y, 9);
        }
    }

    let doorX = 6 - camX;
    if (doorX > -20 && doorX < 160) {
        screen.fillRect(doorX, lvl.spawnY + 16, 10, 19, 11);
        screen.drawRect(doorX, lvl.spawnY + 16, 10, 19, 9);
        screen.print(lvl.door, doorX + 3, lvl.spawnY + 22, 1);
    }

    // DRAW THE TARGET END-GOAL
    let gX = (lvl.goalX + 15) - camX;
    if (gX > 0 && gX < 160) {
        let goalY = (currentStage == 3) ? 47 : (levels[currentStage].platforms[levels[currentStage].platforms.length - 1].y - 15);

        if (currentStage === 7) {
            // STAGE 8: GOLDEN VICTORY CROWN
            let bobbing = Math.sin(tick) * 2;
            let crownY = goalY - 2 + bobbing;
            let goldColor = (Math.floor(tick * 1.5) % 2 == 0) ? 5 : 4;

            screen.fillRect(gX - 6, crownY, 13, 5, goldColor);
            screen.fillRect(gX - 6, crownY - 4, 2, 4, goldColor);
            screen.fillRect(gX - 2, crownY - 3, 2, 3, goldColor);
            screen.fillRect(gX + 2, crownY - 3, 2, 3, goldColor);
            screen.fillRect(gX + 5, crownY - 4, 2, 4, goldColor);
            screen.setPixel(gX - 5, crownY - 5, 1);
            screen.setPixel(gX - 1, crownY - 4, 1);
            screen.setPixel(gX + 3, crownY - 4, 1);
            screen.setPixel(gX + 6, crownY - 5, 1);
            screen.fillRect(gX - 4, crownY + 2, 9, 2, 2);
        } else {
            // STAGES 1-7: STANDARD NEON TELEPORTER RING
            let radiusPulse = 4 + Math.abs(Math.sin(tick) * 5);
            screen.drawCircle(gX, goalY, radiusPulse, 9);
            screen.drawCircle(gX, goalY, radiusPulse - 3, 3);
            screen.fillCircle(gX, goalY, 1, 1);
        }
    }

    for (let i = 0; i < lvl.nodes.length; i++) {
        let node = lvl.nodes[i];
        let nX = node.x - camX;

        if (nX > -25 && nX < 185) {
            let isBlue = node.color == "blue";
            let mainColor = isBlue ? 9 : 4;
            let coreColor = isBlue ? 8 : 2;

            if (node.isFloor) {
                screen.fillRect(nX - 14, node.y, 28, 4, 15);
                screen.drawRect(nX - 14, node.y, 28, 4, mainColor);
                screen.fillRect(nX - 6, node.y + 1, 12, 2, coreColor);
            } else {
                screen.drawCircle(nX, node.y, 7, mainColor);
                screen.fillCircle(nX, node.y, 3, coreColor);
                screen.drawLine(nX - 10, node.y, nX - 5, node.y, 1);
                screen.drawLine(nX + 5, node.y, nX + 10, node.y, 1);
            }
        }
    }

    if (activeTetherNode) {
        let tColor = playerColor == "blue" ? 9 : 4;
        screen.drawLine((playerX + 4) - camX, playerY + 6, activeTetherNode.x - camX, activeTetherNode.y, tColor);
        screen.drawLine((playerX + 4) - camX, playerY + 6, activeTetherNode.x - camX, activeTetherNode.y, 1);
    }

    let cx = (playerX + 4) - camX;
    let cy = playerY + 6;
    let activeNeon = playerColor == "blue" ? 9 : 4;
    let accentNeon = playerColor == "blue" ? 8 : 2;

    let pulse = Math.sin(tick) > 0 ? 1 : 0;
    screen.drawCircle(cx, cy, 9 + pulse, activeNeon);

    screen.fillRect(cx - 3, playerY - 3, 6, 6, 11);
    screen.drawRect(cx - 3, playerY - 3, 6, 6, 12);
    screen.drawLine(cx - 2, playerY, cx + 2, playerY, activeNeon);

    screen.fillRect(cx - 4, playerY + 3, 8, 7, 12);
    screen.fillRect(cx - 2, playerY + 4, 4, 4, activeNeon);
    screen.fillCircle(cx, playerY + 6, 1, 1);

    let legOffset = 0;
    if (Math.abs(playerVx) > 0.1 && isGrounded) {
        legOffset = Math.sin(tick * 4) * 2.5;
    }
    screen.drawLine(cx - 2, playerY + 10, cx - 2 + legOffset, playerY + 13, 1);
    screen.fillRect(cx - 3 + legOffset, playerY + 13, 2, 1, accentNeon);
    screen.drawLine(cx + 2, playerY + 10, cx + 2 - legOffset, playerY + 13, 1);
    screen.fillRect(cx + 1 - legOffset, playerY + 13, 2, 1, accentNeon);

    screen.print("STAGE " + (currentStage + 1), 5, 5, 9);
    screen.print("LIVES: " + livesCount, 105, 5, 2);
});

resetPlayer();