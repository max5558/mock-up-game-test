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

interface SpaceParticle {
    x: number;
    y: number;
    speed: number;
    color: number;
}

// 2. CORE GAME STATE
let appState = "CONSENT"; // "CONSENT", "PLAYING", "FINISHED"
let dataConsent = false;
let startTime = 0;
let endTime = 0;
let totalButtonPresses = 0;

let playerX = 15;
let playerY = 40;
let playerVx = 0;
let playerVy = 0;
let playerColor = "blue";
let isGrounded = false;
let currentStage = 0;
let livesCount = 5;

let activeTetherNode: MagnetData = null;
let tetherLength = 0;
let prevAPressed = false;

// CAMERA
let camX = 0;

// GALAXY PARTICLES ARRAY
let galaxyParticles: SpaceParticle[] = [];
for (let i = 0; i < 20; i++) {
    galaxyParticles.push({
        x: Math.randomRange(0, 160),
        y: Math.randomRange(0, 120),
        speed: Math.randomRange(2, 6) / 10,
        color: (Math.randomRange(0, 1) == 0) ? 1 : 11
    });
}

// 3. WIDE LEVEL DEFINITIONS
const levels: LevelData[] = [
    {
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
        door: "6", spawnX: 10, spawnY: 40, goalX: 330,
        platforms: [
            { x: 0, y: 85, w: 40, h: 35, platType: "normal" },
            { x: 40, y: 114, w: 250, h: 15, platType: "spikes" },
            { x: 140, y: 25, w: 15, h: 65, platType: "phaseBlue" },
            { x: 240, y: 25, w: 15, h: 65, platType: "phaseRed" },
            { x: 290, y: 85, w: 60, h: 35, platType: "goal" }
        ],
        nodes: [
            { x: 95, y: 20, color: "red", isFloor: false },
            { x: 195, y: 20, color: "blue", isFloor: false }
        ]
    },
    {
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

// --- AMBIENT GALAXY CHORD SYNTH THREAD ---
forever(function () {
    if (appState === "PLAYING") {
        // Chord 1: Shimmering E Minor 9 (Deep Space)
        let chord1 = [330, 392, 494, 587, 740]; // E, G, B, D, F#
        for (let i = 0; i < chord1.length; i++) {
            if (appState !== "PLAYING") return;
            music.playTone(chord1[i], 160);
            pause(40); // Fast cascade to mimic a single chord strum
        }
        pause(600); // Breathe inside the nebula

        // Chord 2: Cosmic C Major 7 (Bright/Athereal)
        let chord2 = [262, 330, 392, 494, 659]; // C, E, G, B, E
        for (let i = 0; i < chord2.length; i++) {
            if (appState !== "PLAYING") return;
            music.playTone(chord2[i], 160);
            pause(40);
        }
        pause(600);

        // Chord 3: Mysterious A Minor 11
        let chord3 = [440, 523, 587, 659, 784]; // A, C, D, E, G
        for (let i = 0; i < chord3.length; i++) {
            if (appState !== "PLAYING") return;
            music.playTone(chord3[i], 160);
            pause(40);
        }
        pause(1400); // Silent drift before loop restarts
    } else {
        pause(500);
    }
});

function handlePlayerDeath() {
    music.playTone(262, 100);
    music.playTone(131, 200);
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

function startGame() {
    appState = "PLAYING";
    startTime = game.runtime();
    resetPlayer();
}

// 4. DATA COLLECTION & BUTTON EVENTS
function trackPress() {
    if (appState === "PLAYING" && dataConsent) {
        totalButtonPresses++;
    }
}

controller.left.onEvent(ControllerButtonEvent.Pressed, trackPress);
controller.right.onEvent(ControllerButtonEvent.Pressed, trackPress);
controller.up.onEvent(ControllerButtonEvent.Pressed, trackPress);

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (appState === "CONSENT") {
        dataConsent = true;
        startGame();
    } else if (appState === "FINISHED") {
        currentStage = 0;
        livesCount = 5;
        totalButtonPresses = 0;
        startGame();
    } else {
        trackPress();
    }
});

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (appState === "CONSENT") {
        dataConsent = false;
        startGame();
    } else if (appState === "PLAYING") {
        trackPress();
        playerColor = (playerColor == "blue") ? "red" : "blue";
        if (playerColor == "blue") {
            music.playTone(392, 50);
            music.playTone(523, 80);
        } else {
            music.playTone(523, 50);
            music.playTone(392, 80);
        }
    }
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

// 5. MAIN GAME ENGINE LOOP
game.onUpdate(function () {
    if (appState !== "PLAYING") return;

    let lvl = levels[currentStage];
    camX = Math.max(0, playerX - 60);

    let currentAPressed = controller.A.isPressed();
    let justPressedA = currentAPressed && !prevAPressed;

    if (controller.left.isPressed()) playerVx -= 0.35;
    if (controller.right.isPressed()) playerVx += 0.35;

    if (controller.up.isPressed() && isGrounded && !currentAPressed) {
        playerVy = -2.3;
        isGrounded = false;
        music.playTone(330, 40);
        music.playTone(659, 100);
    }

    playerVy += 0.15;
    playerVx *= activeTetherNode ? 0.98 : 0.82;
    playerVy *= 0.98;

    if (currentAPressed) {
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
                        if (justPressedA) {
                            music.playTone(165, 80);
                            music.playTone(330, 150);
                        }
                    } else {
                        let dx = (playerX + 4) - targetNode.x;
                        playerVx += dx > 0 ? 1.3 : -1.3;
                        playerVy += 0.8;
                        if (justPressedA) {
                            music.playTone(262, 50);
                            music.playTone(196, 100);
                        }
                    }
                } else {
                    activeTetherNode = targetNode;
                    tetherLength = bestDistance;
                    music.playTone(880, 40);
                    music.playTone(1047, 60);
                }
            }
        } else {
            if (playerColor == activeTetherNode.color) {
                activeTetherNode = null;
            } else {
                let nextX = playerX + 4 + playerVx;
                let nextY = playerY + 6 + playerVy;
                let dist = getDistance(nextX, nextY, activeTetherNode.x, activeTetherNode.y);

                if (dist > tetherLength) {
                    let dx = (nextX - activeTetherNode.x) / dist;
                    let dy = (nextY - activeTetherNode.y) / dist;

                    let dotProduct = playerVx * dx + playerVy * dy;
                    if (dotProduct > 0) {
                        playerVx -= dotProduct * dx;
                        playerVy -= dotProduct * dy;
                    }

                    let currentDist = getDistance(playerX + 4, playerY + 6, activeTetherNode.x, activeTetherNode.y);
                    if (currentDist > tetherLength) {
                        let cdx = (playerX + 4 - activeTetherNode.x) / currentDist;
                        let cdy = (playerY + 6 - activeTetherNode.y) / currentDist;
                        playerX = (activeTetherNode.x + cdx * tetherLength) - 4;
                        playerY = (activeTetherNode.y + cdy * tetherLength) - 6;
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
            music.playTone(523, 100);
            music.playTone(659, 100);
            music.playTone(784, 200);
            resetPlayer();
        } else {
            appState = "FINISHED";
            endTime = game.runtime();
            music.playTone(1047, 100);
            music.playTone(1318, 100);
            music.playTone(1568, 400);
        }
    }

    if (playerY > 135) {
        handlePlayerDeath();
    }

    prevAPressed = currentAPressed;
});

// 6. HIGH-PERFORMANCE GRAPHICS ENGINE
game.onPaint(function () {
    if (appState === "CONSENT") {
        screen.fill(15);
        screen.fillRect(10, 10, 140, 100, 1);
        screen.drawRect(10, 10, 140, 100, 9);
        screen.print("DATA CONSENT", 35, 20, 9);
        screen.print("We'd like to track", 15, 40, 11);
        screen.print("your completion time", 15, 52, 11);
        screen.print("& button presses.", 15, 64, 11);
        screen.print("A: YES  (Track)", 20, 85, 5);
        screen.print("B: NO   (Opt out)", 20, 97, 2);
        return;
    }

    if (appState === "FINISHED") {
        screen.fill(15);
        screen.print("VICTORY!", 55, 10, 5);
        if (dataConsent) {
            let finalTime = (endTime - startTime) / 1000;
            let finalMins = finalTime / 60;
            let bpm = totalButtonPresses / finalMins;
            screen.print("Time:", 25, 30, 11);
            screen.print((Math.round(finalTime * 10) / 10) + " s", 85, 30, 9);
            screen.print("Presses:", 25, 45, 11);
            screen.print("" + totalButtonPresses, 85, 45, 9);
            screen.print("Avg BPM:", 25, 60, 11);
            screen.print("" + Math.round(bpm), 85, 60, 5);
            screen.print("Lives Left:", 25, 75, 11);
            screen.print("" + livesCount, 95, 75, 8);
        } else {
            screen.print("Lives Left:", 40, 40, 11);
            screen.print("" + livesCount, 110, 40, 8);
            screen.print("Data not tracked.", 15, 65, 11);
            screen.print("(Consent opted out)", 15, 80, 2);
        }
        let flash = Math.floor(game.runtime() / 400) % 2 === 0 ? 9 : 1;
        screen.print("Press A to Restart", 15, 105, flash);
        return;
    }

    let lvl = levels[currentStage];
    let tick = game.runtime() / 150;
    let floorTick = Math.floor(tick);

    screen.fill(15);

    // RENDER FLOATING GALAXY PARTICLES (STARS)
    for (let p of galaxyParticles) {
        p.x -= p.speed;
        if (p.x < 0) {
            p.x = 160;
            p.y = Math.randomRange(0, 120);
        }
        screen.setPixel(p.x, p.y, p.color);
    }

    // Large Nebulae Clouds
    for (let n = 0; n < 3; n++) {
        let nebX = (n * 100 - Math.floor(camX * 0.1)) % 200;
        if (nebX < -40) nebX += 200;
        screen.fillCircle(nebX, 30 + (n * 25), 18, 12);
        screen.fillCircle(nebX + 15, 35 + (n * 25), 12, 11);
    }

    // Platform Drawing
    for (let i = 0; i < lvl.platforms.length; i++) {
        let plat = lvl.platforms[i];
        let dX = plat.x - camX;

        if (dX > 160 || dX + plat.w < 0) continue;

        if (plat.platType == "spikes") {
            let laserColor = (floorTick % 2 == 0) ? 2 : 4;
            screen.fillRect(dX, plat.y + 6, plat.w, plat.h - 6, 15);
            for (let sx = 0; sx < plat.w; sx += 8) {
                if (dX + sx + 8 <= dX + plat.w) {
                    screen.drawLine(dX + sx, plat.y + 8, dX + sx + 4, plat.y, laserColor);
                    screen.drawLine(dX + sx + 4, plat.y, dX + sx + 8, plat.y + 8, laserColor);
                }
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
                if (floorTick % 2 == 0) {
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

    let gX = (lvl.goalX + 15) - camX;
    if (gX > 0 && gX < 160) {
        let goalY = (currentStage == 3) ? 47 : (levels[currentStage].platforms[levels[currentStage].platforms.length - 1].y - 15);
        if (currentStage === 7) {
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

    let px = playerX - camX;
    let py = playerY;
    let suitColor = 1;
    let accent = playerColor == "blue" ? 9 : 4;
    let darkAccent = playerColor == "blue" ? 8 : 2;

    screen.fillRect(px - 2, py + 2, 3, 6, darkAccent);
    screen.drawLine(px - 2, py + 2, px - 2, py + 7, accent);
    screen.fillRect(px + 1, py, 6, 5, suitColor);
    screen.fillRect(px + 3, py + 1, 5, 3, 15);
    screen.fillRect(px + 4, py + 1, 3, 2, accent);
    screen.fillRect(px, py + 5, 8, 5, suitColor);
    screen.fillRect(px + 1, py + 7, 6, 2, darkAccent);
    screen.setPixel(px + 4, py + 6, accent);

    let leftLegY = py + 10;
    let rightLegY = py + 10;
    if (Math.abs(playerVx) > 0.1 && isGrounded) {
        let bob = Math.sin(tick * 5);
        if (bob > 0) leftLegY -= 1;
        else rightLegY -= 1;
    }
    screen.fillRect(px + 1, leftLegY, 2, 2, suitColor);
    screen.fillRect(px + 1, leftLegY + 2, 2, 1, darkAccent);
    screen.fillRect(px + 5, rightLegY, 2, 2, suitColor);
    screen.fillRect(px + 5, rightLegY + 2, 2, 1, darkAccent);

    screen.print("STAGE " + (currentStage + 1), 5, 5, 9);
    screen.print("LIVES: " + livesCount, 105, 5, 2);
    if (dataConsent) {
        let runningTime = (game.runtime() - startTime) / 1000;
        screen.print(Math.round(runningTime) + "s", 70, 5, 11);
    }
});