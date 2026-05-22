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

// 3. WIDE LEVEL DEFINITIONS (8 STAGES WITH UPDATED GEOMETRY)
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
        // Stage 6: The Confined Spike Tunnel
        door: "6", spawnX: 10, spawnY: 40, goalX: 400,
        platforms: [
            { x: 0, y: 85, w: 40, h: 35, platType: "normal" },
            { x: 40, y: 114, w: 320, h: 15, platType: "spikes" },
            { x: 120, y: 0, w: 160, h: 30, platType: "spikes" },
            { x: 360, y: 85, w: 60, h: 35, platType: "goal" }
        ],
        nodes: [
            { x: 90, y: 55, color: "blue", isFloor: false },
            { x: 160, y: 55, color: "red", isFloor: false },
            { x: 230, y: 55, color: "blue", isFloor: false },
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

    camX = Math.max(0, playerX - 60);

    if (controller.left.isPressed()) playerVx -= 0.35;
    if (controller.right.isPressed()) playerVx += 0.35;

    // UP ARROW TO JUMP
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

// 5. CYBERNETIC NEON GRAPHICS CANVAS RENDERING ENGINE
game.onPaint(function () {
    let lvl = levels[currentStage];
    let tick = game.runtime() / 150;

    // Background: 15 = Pure Cyber Void Black
    screen.fill(15);

    // Neon Circuit Grid lines: 11 = Sleek Dark Blue Matrix
    let offsetX = -(camX % 20);
    for (let i = offsetX; i < 160; i += 20) screen.drawLine(i, 0, i, 120, 11);
    for (let j = 0; j < 120; j += 20) screen.drawLine(0, j, 160, j, 11);

    // Render Platforms
    for (let i = 0; i < lvl.platforms.length; i++) {
        let plat = lvl.platforms[i];
        let dX = plat.x - camX;

        if (dX > 160 || dX + plat.w < 0) continue;

        if (plat.platType == "spikes") {
            // Plasma Laser Hazards (Flashing Red/Yellow alerts)
            let laserColor = (Math.floor(tick) % 2 == 0) ? 2 : 5;
            screen.fillRect(dX, plat.y + 3, plat.w, 4, laserColor);
            for (let s = 0; s < plat.w; s += 8) {
                screen.drawLine(dX + s, plat.y + 7, dX + s + 4, plat.y, laserColor);
                screen.drawLine(dX + s + 4, plat.y, dX + s + 8, plat.y + 7, laserColor);
            }
        } else {
            // Metallic Sci-Fi Blocks (Dark Blue core with crisp Cyan/Purple trim)
            screen.fillRect(dX, plat.y, plat.w, plat.h, 11);
            screen.drawRect(dX, plat.y, plat.w, plat.h, 12); // Purple casing edge
            screen.drawLine(dX, plat.y, dX + plat.w, plat.y, 9); // Neon Cyan top runner plate
        }
    }

    // High Tech Security Entrance Door
    let doorX = 6 - camX;
    if (doorX > -20 && doorX < 160) {
        screen.fillRect(doorX, lvl.spawnY + 16, 10, 19, 11);
        screen.drawRect(doorX, lvl.spawnY + 16, 10, 19, 9);
        screen.print(lvl.door, doorX + 3, lvl.spawnY + 22, 1);
    }

    // Holographic Extraction Portal (Goal Area)
    let gX = (lvl.goalX + 15) - camX;
    if (gX > 0 && gX < 160) {
        let radiusPulse = 4 + Math.abs(Math.sin(tick) * 4);
        screen.drawCircle(gX, 62, radiusPulse, 9);
        screen.drawCircle(gX, 62, radiusPulse - 3, 13);
        screen.fillCircle(gX, 62, 1, 1);
    }

    // Magnet Anchor Points (Quantum Power Orbs)
    for (let i = 0; i < lvl.nodes.length; i++) {
        let node = lvl.nodes[i];
        let nX = node.x - camX;

        if (nX > -25 && nX < 185) {
            let isBlue = node.color == "blue";
            let mainColor = isBlue ? 9 : 4;  // 9 = Neon Cyan, 4 = Neon Orange
            let coreColor = isBlue ? 8 : 2;  // 8 = Sky Blue,  2 = High Voltage Red

            if (node.isFloor) {
                // Ground Launch Pad
                screen.fillRect(nX - 14, node.y, 28, 4, 11);
                screen.drawRect(nX - 14, node.y, 28, 4, mainColor);
                screen.fillRect(nX - 6, node.y + 1, 12, 2, coreColor);
            } else {
                // Suspended Quantum Node Grid
                screen.drawCircle(nX, node.y, 7, mainColor);
                screen.fillCircle(nX, node.y, 3, coreColor);
                // Orbiting Crosshair lines
                screen.drawLine(nX - 10, node.y, nX - 5, node.y, 1);
                screen.drawLine(nX + 5, node.y, nX + 10, node.y, 1);
            }
        }
    }

    // Energy Beam Tether Line
    if (activeTetherNode) {
        let tColor = playerColor == "blue" ? 9 : 4;
        screen.drawLine((playerX + 4) - camX, playerY + 6, activeTetherNode.x - camX, activeTetherNode.y, tColor);
        // Secondary Inner core lighting line
        screen.drawLine((playerX + 4) - camX, playerY + 6, activeTetherNode.x - camX, activeTetherNode.y, 1);
    }

    // ----------------------------------------------------
    // CHAR-MODEL UPGRADE: CYBER-RUNNER POWER SUIT
    // ----------------------------------------------------
    let cx = (playerX + 4) - camX;
    let cy = playerY + 6;
    let activeNeon = playerColor == "blue" ? 9 : 4;   // Visor & Core Glows
    let accentNeon = playerColor == "blue" ? 8 : 2;   // Structural Accents

    // Radiant Shield Aura
    let pulse = Math.sin(tick) > 0 ? 1 : 0;
    screen.drawCircle(cx, cy, 9 + pulse, activeNeon);

    // 1. Sleek Armored Helmet (Dark Gray structure with active horizontal visors)
    screen.fillRect(cx - 3, playerY - 3, 6, 6, 11); // Helmet Base
    screen.drawRect(cx - 3, playerY - 3, 6, 6, 12); // Outer shell
    screen.drawLine(cx - 2, playerY, cx + 2, playerY, activeNeon); // Glowing Neon Visor Shield

    // 2. Heavy Exo-Torso (Plated shoulders with glowing central reactor)
    screen.fillRect(cx - 4, playerY + 3, 8, 7, 12); // Dark Carbon Frame
    screen.fillRect(cx - 2, playerY + 4, 4, 4, activeNeon); // Luminous Chest Core Power cell
    screen.fillCircle(cx, playerY + 6, 1, 1); // Hyper-white fusion center

    // 3. Dynamic Moving Kinetic Thruster Boots (Leg Modules)
    let legOffset = 0;
    if (Math.abs(playerVx) > 0.1 && isGrounded) {
        legOffset = Math.sin(tick * 4) * 2.5; // Smooth mechanical sprinting cycle
    }

    // Left Mechanical Boot + Jet Trail
    screen.drawLine(cx - 2, playerY + 10, cx - 2 + legOffset, playerY + 13, 1);
    screen.fillRect(cx - 3 + legOffset, playerY + 13, 2, 1, accentNeon);

    // Right Mechanical Boot + Jet Trail
    screen.drawLine(cx + 2, playerY + 10, cx + 2 - legOffset, playerY + 13, 1);
    screen.fillRect(cx + 1 - legOffset, playerY + 13, 2, 1, accentNeon);
});

resetPlayer();