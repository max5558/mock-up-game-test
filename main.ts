// 1. STRICT INTERFACES
interface PlatformData {
    x: number;
    y: number;
    w: number;
    h: number;
    platType: string;
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

let activeTetherNode: MagnetData = null;
let tetherLength = 0;

// CAMERA
let camX = 0;

// 3. WIDE LEVEL DEFINITIONS (8 STAGES)
const levels: LevelData[] = [
    {
        // Stage 1: Safe Space (Ki)
        door: "1", spawnX: 10, spawnY: 40, goalX: 230,
        platforms: [
            { x: 0, y: 75, w: 80, h: 45, platType: "normal" },
            { x: 80, y: 95, w: 50, h: 25, platType: "retry" },
            { x: 130, y: 75, w: 120, h: 45, platType: "goal" }
        ],
        nodes: [
            { x: 105, y: 25, color: "blue", isFloor: false }
        ]
    },
    {
        // Stage 2: Challenge & Pillar (Sho)
        door: "2", spawnX: 10, spawnY: 40, goalX: 280,
        platforms: [
            { x: 0, y: 75, w: 60, h: 45, platType: "normal" },
            { x: 60, y: 114, w: 70, h: 15, platType: "spikes" },
            { x: 130, y: 45, w: 20, h: 75, platType: "normal" },
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
    {
        // Stage 5: Momentum Transfer Gauntlet
        door: "5", spawnX: 10, spawnY: 40, goalX: 420,
        platforms: [
            { x: 0, y: 80, w: 45, h: 40, platType: "normal" },
            { x: 45, y: 114, w: 335, h: 15, platType: "spikes" },
            { x: 380, y: 80, w: 60, h: 40, platType: "goal" }
        ],
        nodes: [
            { x: 100, y: 20, color: "blue", isFloor: false },
            { x: 180, y: 20, color: "red", isFloor: false },
            { x: 260, y: 20, color: "blue", isFloor: false },
            { x: 340, y: 20, color: "red", isFloor: false }
        ]
    },
    {
        // Stage 6: The Confined Spike Tunnel (FIXED MAGNET SPACING!)
        door: "6", spawnX: 10, spawnY: 40, goalX: 400,
        platforms: [
            { x: 0, y: 85, w: 40, h: 35, platType: "normal" },
            { x: 40, y: 114, w: 320, h: 15, platType: "spikes" },
            { x: 120, y: 0, w: 160, h: 30, platType: "spikes" },
            { x: 360, y: 85, w: 60, h: 35, platType: "goal" }
        ],
        nodes: [
            { x: 90, y: 55, color: "blue", isFloor: false },
            { x: 160, y: 55, color: "red", isFloor: false },   // Added to balance gap
            { x: 230, y: 55, color: "blue", isFloor: false },  // Added to balance gap
            { x: 300, y: 55, color: "red", isFloor: false }
        ]
    },
    {
        // Stage 7: Dual Color Launch Pads
        door: "7", spawnX: 10, spawnY: 50, goalX: 460,
        platforms: [
            { x: 0, y: 90, w: 40, h: 30, platType: "normal" },
            { x: 40, y: 114, w: 380, h: 15, platType: "spikes" },
            { x: 420, y: 90, w: 60, h: 30, platType: "goal" }
        ],
        nodes: [
            { x: 80, y: 105, color: "red", isFloor: true },
            { x: 190, y: 105, color: "blue", isFloor: true },
            { x: 310, y: 30, color: "red", isFloor: false },
            { x: 380, y: 30, color: "blue", isFloor: false }
        ]
    },
    {
        // Stage 8: Mega Grand Trial
        door: "8", spawnX: 10, spawnY: 40, goalX: 560,
        platforms: [
            { x: 0, y: 80, w: 35, h: 40, platType: "normal" },
            { x: 35, y: 114, w: 500, h: 15, platType: "spikes" },
            { x: 200, y: 65, w: 40, h: 15, platType: "normal" },
            { x: 380, y: 55, w: 40, h: 15, platType: "normal" },
            { x: 535, y: 80, w: 60, h: 40, platType: "goal" }
        ],
        nodes: [
            { x: 80, y: 105, color: "red", isFloor: true },
            { x: 140, y: 20, color: "blue", isFloor: false },
            { x: 290, y: 105, color: "blue", isFloor: true },
            { x: 340, y: 25, color: "red", isFloor: false },
            { x: 460, y: 25, color: "blue", isFloor: false },
            { x: 510, y: 25, color: "red", isFloor: false }
        ]
    }
];

function resetPlayer() {
    let lvl = levels[currentStage];
    playerX = lvl.spawnX;
    playerY = lvl.spawnY;
    playerVx = 0;
    playerVy = 0;
    playerColor = "blue";
    activeTetherNode = null;
}

// B BUTTON TO SWAP POLARITY (Standard X or Z key)
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    playerColor = (playerColor == "blue") ? "red" : "blue";
});

function getDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function resolveCollision(axis: string, lvl: LevelData) {
    for (let i = 0; i < lvl.platforms.length; i++) {
        let plat = lvl.platforms[i];
        if (playerX + 8 > plat.x && playerX < plat.x + plat.w &&
            playerY + 12 > plat.y && playerY < plat.y + plat.h) {

            if (plat.platType == "spikes") {
                resetPlayer();
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

    // Camera following horizontal coordinates
    camX = Math.max(0, playerX - 60);

    // D-Pad Left / Right Arrow navigation
    if (controller.left.isPressed()) playerVx -= 0.35;
    if (controller.right.isPressed()) playerVx += 0.35;

    // NATIVE UP ARROW TO JUMP
    if (controller.up.isPressed() && isGrounded && !controller.A.isPressed()) {
        playerVy = -2.3;
        isGrounded = false;
    }

    playerVy += 0.15;
    playerVx *= activeTetherNode ? 0.97 : 0.82;
    playerVy *= 0.98;

    // SPACEBAR (A BUTTON) HOOK CONTROLS
    if (controller.A.isPressed()) {
        if (!activeTetherNode) {
            let targetNode: MagnetData = null;
            let bestDistance = 80;

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
                    // SAME COLOR REPEL BLASTS
                    if (targetNode.isFloor) {
                        playerVy = -5.6;
                        playerVx = 2.2;
                    } else {
                        let dx = (playerX + 4) - targetNode.x;
                        playerVx += dx > 0 ? 1.3 : -1.3;
                        playerVy += 0.8;
                    }
                } else {
                    // OPPOSITE COLOR GRAPPLE HOLD
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
        resetPlayer();
    }
});

// 5. GRAPH PAPER CANVAS RENDERING ENGINE
game.onPaint(function () {
    let lvl = levels[currentStage];
    let tick = game.runtime() / 150;

    // Background (White paper sheets)
    screen.fill(1);

    // Blue Ink Blueprint Grid lines
    let offsetX = -(camX % 16);
    for (let i = offsetX; i < 160; i += 16) screen.drawLine(i, 0, i, 120, 9);
    for (let j = 0; j < 120; j += 16) screen.drawLine(0, j, 160, j, 9);

    // Platforms
    for (let i = 0; i < lvl.platforms.length; i++) {
        let plat = lvl.platforms[i];
        let dX = plat.x - camX;

        if (dX > 160 || dX + plat.w < 0) continue;

        if (plat.platType == "spikes") {
            // Hand-sketched hazards (Black)
            for (let s = 0; s < plat.w; s += 4) {
                screen.drawLine(dX + s, plat.y + 6, dX + s + 2, plat.y + 2, 15);
                screen.drawLine(dX + s + 2, plat.y + 2, dX + s + 4, plat.y + 6, 15);
            }
        } else {
            // Outlined map structures
            screen.fillRect(dX, plat.y, plat.w, plat.h, 1);
            screen.drawRect(dX, plat.y, plat.w, plat.h, 15);
        }
    }

    // Door UI Spawners
    let doorX = 6 - camX;
    if (doorX > -20 && doorX < 160) {
        screen.fillRect(doorX, lvl.spawnY + 20, 8, 15, 1);
        screen.drawRect(doorX, lvl.spawnY + 20, 8, 15, 15);
        screen.print(lvl.door, doorX + 2, lvl.spawnY + 24, 15);
    }

    // Goal Checkpoints
    let gX = (lvl.goalX + 15) - camX;
    if (gX > 0 && gX < 160) {
        screen.drawCircle(gX, 62, 5, 15);
        screen.drawCircle(gX, 62, 2, 15);
    }

    // Magnet Anchor Points
    for (let i = 0; i < lvl.nodes.length; i++) {
        let node = lvl.nodes[i];
        let nX = node.x - camX;

        if (nX > -25 && nX < 185) {
            let isBlue = node.color == "blue";
            let textColor = isBlue ? 8 : 2;

            if (node.isFloor) {
                screen.fillRect(nX - 16, node.y, 32, 4, 1);
                screen.drawRect(nX - 16, node.y, 32, 4, 15);
                screen.print(node.color, nX - 8, node.y + 5, textColor);
            } else {
                screen.fillRect(nX - 12, node.y - 5, 24, 10, 1);
                screen.drawRect(nX - 12, node.y - 5, 24, 10, 15);
                screen.print(node.color, nX - 10, node.y - 3, textColor);
            }
        }
    }

    // Linked Rope Lines
    if (activeTetherNode) {
        let tColor = playerColor == "blue" ? 8 : 2;
        screen.drawLine((playerX + 4) - camX, playerY + 6, activeTetherNode.x - camX, activeTetherNode.y, tColor);
    }

    // CHARACTER SPRITE MODEL
    let cx = (playerX + 4) - camX;
    let cy = playerY + 6;
    let pAura = playerColor == "blue" ? 8 : 2;
    let chestColor = playerColor == "blue" ? 9 : 2;

    // Pulsing aura boundary tracking ring
    let pulse = Math.sin(tick) > 0 ? 1 : 0;
    screen.drawCircle(cx, cy, 10 + pulse, pAura);

    // Core character modules
    screen.fillCircle(cx, playerY, 3, 1);
    screen.drawCircle(cx, playerY, 3, 15);
    screen.fillRect(cx - 3, playerY + 4, 6, 6, chestColor);
    screen.drawRect(cx - 3, playerY + 4, 6, 6, 15);

    // Scissor Running Legs animation frames
    let legOffset = 0;
    if (Math.abs(playerVx) > 0.1 && isGrounded) {
        legOffset = Math.sin(tick * 3) * 2;
    }
    screen.drawLine(cx - 2, playerY + 10, cx - 2 + legOffset, playerY + 14, 15);
    screen.drawLine(cx + 1, playerY + 10, cx + 1 - legOffset, playerY + 14, 15);
});

resetPlayer();