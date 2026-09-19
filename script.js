document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       BASIC HELPERS
    ========================================================= */

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => [...document.querySelectorAll(selector)];

    const body = document.body;

    const birthdayExperience = $("#birthdayExperience");
    const loadingOverlay = $("#loadingOverlay");

    const bgMusic = $("#bgMusic");
    const crackerSound = $("#crackerSound");

    let currentScene = 1;

    const timers = [];

    function delay(callback, milliseconds) {
        const timer = setTimeout(callback, milliseconds);
        timers.push(timer);
        return timer;
    }

    function showScene(number) {
        const scenes = $$(".scene");

        scenes.forEach((scene) => {
            scene.classList.remove("active");
        });

        const nextScene = $(`#scene${number}`);

        if (nextScene) {
            nextScene.classList.add("active");
            currentScene = number;
        }
    }


    /* =========================================================
       LOADING SCREEN
    ========================================================= */

    let loadingFinished = false;

    function hideLoading() {
        if (loadingFinished) return;

        loadingFinished = true;

        if (loadingOverlay) {
            loadingOverlay.classList.add("hidden");
        }

        if (birthdayExperience) {
            birthdayExperience.classList.add("ready");
        }
    }

    window.addEventListener("load", () => {
        delay(hideLoading, 350);
    });

    // Safety fallback
    delay(hideLoading, 2500);


    /* =========================================================
       BACKGROUND PARTICLES
    ========================================================= */

    const backgroundParticles = $("#backgroundParticles");

    function createBackgroundParticles() {
        if (!backgroundParticles) return;

        backgroundParticles.innerHTML = "";

        const count =
            window.innerWidth <= 600
                ? 25
                : 45;

        for (let i = 0; i < count; i++) {
            const particle =
                document.createElement("span");

            particle.className = "bgParticle";

            particle.style.left =
                `${Math.random() * 100}%`;

            particle.style.top =
                `${Math.random() * 100}%`;

            const size =
                1 + Math.random() * 3;

            particle.style.width =
                `${size}px`;

            particle.style.height =
                `${size}px`;

            particle.style.animationDelay =
                `${Math.random() * 6}s`;

            particle.style.animationDuration =
                `${4 + Math.random() * 7}s`;

            particle.style.opacity =
                `${0.2 + Math.random() * 0.5}`;

            backgroundParticles.appendChild(
                particle
            );
        }
    }

    createBackgroundParticles();

    window.addEventListener("resize", () => {
        createBackgroundParticles();
    });


    /* =========================================================
       SCENE 1 — GIFT
    ========================================================= */

    const giftWrapper = $("#giftWrapper");
    const giftButton = $("#giftButton");

    let giftOpened = false;

    function openGift() {
        if (giftOpened) return;

        giftOpened = true;

        if (giftWrapper) {
            giftWrapper.classList.add("opening");
        }

        delay(() => {
            showScene(2);

            const secretCode =
                $("#secretCode");

            if (secretCode) {
                secretCode.focus();
            }
        }, 1050);
    }

    if (giftWrapper) {
        giftWrapper.addEventListener(
            "click",
            () => {
                openGift();
            }
        );

        giftWrapper.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    openGift();
                }
            }
        );
    }

    if (giftButton) {
        giftButton.addEventListener(
            "click",
            (event) => {
                event.stopPropagation();
                openGift();
            }
        );
    }


    /* =========================================================
       SCENE 2 — SECRET CODE
    ========================================================= */

    const secretCode = $("#secretCode");
    const secretSubmit = $("#secretSubmit");
    const secretError = $("#secretError");

    const SECRET_CODE = "Ammayi";

    let secretAccepted = false;

    function startMusic() {
        if (!bgMusic) return;

        try {
            bgMusic.volume = 0.45;
            bgMusic.currentTime = 0;

            const playPromise =
                bgMusic.play();

            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {
                playPromise.catch(() => {
                    // Browser autoplay restriction.
                });
            }
        } catch (error) {
            console.log(
                "Background music error:",
                error
            );
        }
    }

    function checkSecretCode() {
        if (secretAccepted) return;

        const enteredCode =
            secretCode
                ? secretCode.value.trim()
                : "";

        if (enteredCode === SECRET_CODE) {

            secretAccepted = true;

            if (secretError) {
                secretError.classList.remove(
                    "show"
                );
            }

            startMusic();

            showScene(3);

            delay(() => {
                startCrackerSequence();
            }, 3200);

        } else {

            if (secretError) {

                secretError.classList.remove(
                    "show"
                );

                void secretError.offsetWidth;

                secretError.classList.add(
                    "show"
                );
            }

            if (secretCode) {

                secretCode.classList.remove(
                    "wrong"
                );

                void secretCode.offsetWidth;

                secretCode.classList.add(
                    "wrong"
                );

                secretCode.focus();
                secretCode.select();
            }
        }
    }

    if (secretSubmit) {
        secretSubmit.addEventListener(
            "click",
            checkSecretCode
        );
    }

    if (secretCode) {
        secretCode.addEventListener(
            "keydown",
            (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    checkSecretCode();
                }
            }
        );
    }


    /* =========================================================
       SCENE 5 — CRACKER
    ========================================================= */

    const fallingCracker =
        $("#fallingCracker");

    const crackerFuse =
        $("#crackerFuse");

    const crackerFlame =
        $("#crackerFlame");

    let crackerStarted = false;

    function resetCracker() {

        if (fallingCracker) {
            fallingCracker.classList.remove(
                "drop"
            );

            void fallingCracker.offsetWidth;
        }

        if (crackerFuse) {
            crackerFuse.classList.remove(
                "burning"
            );
        }

        if (crackerFlame) {
            crackerFlame.classList.remove(
                "active"
            );
        }
    }

    function startCrackerSequence() {

        if (crackerStarted) return;

        crackerStarted = true;

        showScene(5);

        resetCracker();

        delay(() => {

            if (crackerFuse) {
                crackerFuse.classList.add(
                    "burning"
                );
            }

            if (crackerFlame) {
                crackerFlame.classList.add(
                    "active"
                );
            }

        }, 100);

        delay(() => {

            if (fallingCracker) {
                fallingCracker.classList.add(
                    "drop"
                );
            }

        }, 180);

        delay(() => {
            createBlast();
        }, 3200);
    }


    /* =========================================================
       SCENE 6 — HUGE BLAST
    ========================================================= */

    const blastFlash =
        $("#blastFlash");

    const blastCore =
        $("#blastCore");

    const blastParticlesCanvas =
        $("#blastParticlesCanvas");

    const paperBlastPieces =
        $("#paperBlastPieces");

    const goldBlastPieces =
        $("#goldBlastPieces");

    let blastStarted = false;

    function playCrackerSound() {

        if (!crackerSound) return;

        try {

            crackerSound.currentTime = 0;
            crackerSound.volume = 0.9;

            const promise =
                crackerSound.play();

            if (
                promise &&
                typeof promise.catch === "function"
            ) {
                promise.catch(() => {});
            }

        } catch (error) {
            console.log(
                "Cracker sound error:",
                error
            );
        }
    }

    function createBlast() {

        if (blastStarted) return;

        blastStarted = true;

        showScene(6);

        playCrackerSound();


        /* FLASH */

        if (blastFlash) {

            blastFlash.classList.remove(
                "active"
            );

            void blastFlash.offsetWidth;

            blastFlash.classList.add(
                "active"
            );
        }


        /* CORE */

        if (blastCore) {

            blastCore.classList.remove(
                "explode"
            );

            void blastCore.offsetWidth;

            blastCore.classList.add(
                "explode"
            );
        }


        /* CAMERA SHAKE */

        body.classList.remove(
            "cameraShake"
        );

        void body.offsetWidth;

        body.classList.add(
            "cameraShake"
        );


        /* PARTICLES */

        createExplosionCanvas();

        createPaperBlastPieces();

        createGoldBlastPieces();


        delay(() => {
            body.classList.remove(
                "cameraShake"
            );
        }, 900);


        delay(() => {
            startLetterFormation();
        }, 2900);
    }


    /* =========================================================
       EXPLOSION CANVAS PARTICLES
    ========================================================= */

    function createExplosionCanvas() {

        if (!blastParticlesCanvas) {
            return;
        }

        const canvas =
            blastParticlesCanvas;

        const ctx =
            canvas.getContext("2d");

        if (!ctx) return;

        const width =
            window.innerWidth;

        const height =
            window.innerHeight;

        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        canvas.width =
            width * dpr;

        canvas.height =
            height * dpr;

        canvas.style.width =
            `${width}px`;

        canvas.style.height =
            `${height}px`;

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        const centerX =
            width / 2;

        const centerY =
            height / 2;

        const particles = [];

        const count =
            width <= 600
                ? 110
                : 180;

        const particleColors = [
            "#FFD86B",
            "#FFF1B0",
            "#FFFFFF",
            "#FFB52E",
            "#F4A62A",
            "#D63B2F"
        ];

        for (let i = 0; i < count; i++) {

            const angle =
                Math.random() *
                Math.PI *
                2;

            const speed =
                2.5 +
                Math.random() * 8;

            particles.push({

                x: centerX,
                y: centerY,

                vx:
                    Math.cos(angle) *
                    speed,

                vy:
                    Math.sin(angle) *
                    speed,

                size:
                    1 +
                    Math.random() *
                    3.5,

                life: 1,

                decay:
                    0.012 +
                    Math.random() *
                    0.018,

                gravity:
                    0.035 +
                    Math.random() *
                    0.06,

                color:
                    particleColors[
                        Math.floor(
                            Math.random() *
                            particleColors.length
                        )
                    ]
            });
        }

        let lastTime =
            performance.now();

        function animate(now) {

            const delta =
                Math.min(
                    (now - lastTime) /
                        16.67,
                    2
                );

            lastTime = now;

            ctx.clearRect(
                0,
                0,
                width,
                height
            );

            let activeParticles = 0;

            particles.forEach(
                (particle) => {

                    if (
                        particle.life <= 0
                    ) {
                        return;
                    }

                    activeParticles++;

                    particle.x +=
                        particle.vx *
                        delta;

                    particle.y +=
                        particle.vy *
                        delta;

                    particle.vy +=
                        particle.gravity *
                        delta;

                    particle.vx *=
                        Math.pow(
                            0.992,
                            delta
                        );

                    particle.vy *=
                        Math.pow(
                            0.992,
                            delta
                        );

                    particle.life -=
                        particle.decay *
                        delta;

                    ctx.save();

                    ctx.globalAlpha =
                        Math.max(
                            0,
                            particle.life
                        );

                    ctx.fillStyle =
                        particle.color;

                    ctx.beginPath();

                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.size,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();

                    ctx.restore();
                }
            );

            if (
                activeParticles > 0
            ) {
                requestAnimationFrame(
                    animate
                );
            } else {
                ctx.clearRect(
                    0,
                    0,
                    width,
                    height
                );
            }
        }

        requestAnimationFrame(
            animate
        );
    }


    /* =========================================================
       PAPER BLAST PIECES
       NO FLOWERS / NO PETALS
    ========================================================= */

    function createPaperBlastPieces() {

        if (!paperBlastPieces) {
            return;
        }

        paperBlastPieces.innerHTML = "";

        const count =
            window.innerWidth <= 600
                ? 48
                : 78;

        const paperColors = [
            "#FFF5D7",
            "#F9E6B5",
            "#FFFFFF",
            "#E8C875",
            "#F1D79B"
        ];

        for (let i = 0; i < count; i++) {

            const piece =
                document.createElement(
                    "span"
                );

            piece.className =
                "paperBlastPiece";


            const angle =
                Math.random() *
                Math.PI *
                2;

            const distance =
                130 +
                Math.random() * 430;

            const x =
                Math.cos(angle) *
                distance;

            const y =
                Math.sin(angle) *
                distance;

            const rotation =
                -720 +
                Math.random() * 1440;

            const width =
                8 +
                Math.random() * 28;

            const height =
                6 +
                Math.random() * 22;

            const duration =
                1.7 +
                Math.random() * 1.7;


            piece.style.setProperty(
                "--x",
                `${x}px`
            );

            piece.style.setProperty(
                "--y",
                `${y}px`
            );

            piece.style.setProperty(
                "--rotation",
                `${rotation}deg`
            );

            piece.style.setProperty(
                "--piece-width",
                `${width}px`
            );

            piece.style.setProperty(
                "--piece-height",
                `${height}px`
            );

            piece.style.setProperty(
                "--duration",
                `${duration}s`
            );


            piece.style.background =
                paperColors[
                    Math.floor(
                        Math.random() *
                        paperColors.length
                    )
                ];

            piece.style.animationDelay =
                `${Math.random() * 0.18}s`;


            paperBlastPieces.appendChild(
                piece
            );
        }
    }


    /* =========================================================
       GOLD BLAST PIECES
    ========================================================= */

    function createGoldBlastPieces() {

        if (!goldBlastPieces) {
            return;
        }

        goldBlastPieces.innerHTML = "";

        const count =
            window.innerWidth <= 600
                ? 34
                : 58;

        for (let i = 0; i < count; i++) {

            const piece =
                document.createElement(
                    "span"
                );

            piece.className =
                "goldBlastPiece";


            const angle =
                Math.random() *
                Math.PI *
                2;

            const distance =
                100 +
                Math.random() * 420;

            const x =
                Math.cos(angle) *
                distance;

            const y =
                Math.sin(angle) *
                distance;

            const rotation =
                -900 +
                Math.random() * 1800;

            const width =
                3 +
                Math.random() * 7;

            const height =
                3 +
                Math.random() * 9;

            const duration =
                1.5 +
                Math.random() * 1.8;


            piece.style.setProperty(
                "--x",
                `${x}px`
            );

            piece.style.setProperty(
                "--y",
                `${y}px`
            );

            piece.style.setProperty(
                "--rotation",
                `${rotation}deg`
            );

            piece.style.setProperty(
                "--piece-width",
                `${width}px`
            );

            piece.style.setProperty(
                "--piece-height",
                `${height}px`
            );

            piece.style.setProperty(
                "--duration",
                `${duration}s`
            );


            piece.style.animationDelay =
                `${Math.random() * 0.15}s`;


            goldBlastPieces.appendChild(
                piece
            );
        }
    }


    /* =========================================================
       SCENE 7 — LETTER FORMATION
    ========================================================= */

    const letterFormation =
        $("#letterFormation");

    const letterFormationParticles =
        $("#letterFormationParticles");

    let letterFormationStarted = false;

    function createFormationParticles() {

        if (!letterFormationParticles) {
            return;
        }

        letterFormationParticles.innerHTML =
            "";

        const count =
            window.innerWidth <= 600
                ? 28
                : 48;

        for (let i = 0; i < count; i++) {

            const particle =
                document.createElement(
                    "span"
                );

            particle.className =
                "formationParticle";

            particle.style.left =
                `${20 + Math.random() * 60}%`;

            particle.style.top =
                `${20 + Math.random() * 60}%`;

            particle.style.animationDelay =
                `${Math.random() * 1.2}s`;

            particle.style.animationDuration =
                `${1.5 + Math.random() * 2}s`;

            letterFormationParticles.appendChild(
                particle
            );
        }
    }

    function startLetterFormation() {

        if (letterFormationStarted) {
            return;
        }

        letterFormationStarted = true;

        showScene(7);

        createFormationParticles();

        if (letterFormation) {

            letterFormation.classList.remove(
                "forming"
            );

            void letterFormation.offsetWidth;

            letterFormation.classList.add(
                "forming"
            );
        }

        delay(() => {
            showLetterCover();
        }, 2700);
    }


    /* =========================================================
       SCENE 8 — FLORAL LETTER COVER
       NO STICK / NO ROUND NOTE
    ========================================================= */

    const letterCover =
        $("#letterCover");

    const openLetterButton =
        $("#openLetterButton");

    let letterCoverShown = false;

    function showLetterCover() {

        if (letterCoverShown) {
            return;
        }

        letterCoverShown = true;

        showScene(8);

        if (letterCover) {

            letterCover.classList.remove(
                "show"
            );

            void letterCover.offsetWidth;

            letterCover.classList.add(
                "show"
            );
        }
    }


    /* =========================================================
       SCENE 9 — OPEN LETTER
    ========================================================= */

    const letterPaper =
        $("#letterPaper");

    let letterOpening = false;

    function openLetter() {

        if (letterOpening) {
            return;
        }

        letterOpening = true;

        if (letterCover) {
            letterCover.classList.add(
                "opening"
            );
        }

        showScene(9);

        delay(() => {

            if (letterPaper) {

                letterPaper.classList.remove(
                    "open"
                );

                void letterPaper.offsetWidth;

                letterPaper.classList.add(
                    "open"
                );
            }

        }, 100);

        delay(() => {
            startActualLetter();
        }, 1550);
    }

    if (openLetterButton) {

        openLetterButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                openLetter();
            }
        );
    }

    if (letterCover) {

        letterCover.addEventListener(
            "click",
            (event) => {

                if (
                    event.target.closest(
                        "#openLetterButton"
                    )
                ) {
                    return;
                }

                openLetter();
            }
        );
    }


    /* =========================================================
       SCENE 10 — LETTER
    ========================================================= */

    const letterScroll =
        $("#letterScroll");

    const letterHeading =
        $("#letterHeading");

    const letterLines =
        $$("#scene10 .letterLine");

    const finallyButton =
        $("#finallyButton");

    let letterStarted = false;


    /* =========================================================
       SMOOTH AUTO SCROLL
    ========================================================= */

    function smoothScrollTo(
        element,
        target,
        duration
    ) {

        return new Promise(
            (resolve) => {

                if (!element) {
                    resolve();
                    return;
                }

                const maxScroll =
                    element.scrollHeight -
                    element.clientHeight;

                target =
                    Math.max(
                        0,
                        Math.min(
                            target,
                            maxScroll
                        )
                    );

                const start =
                    element.scrollTop;

                const distance =
                    target - start;

                if (
                    Math.abs(distance) < 2
                ) {
                    element.scrollTop =
                        target;

                    resolve();

                    return;
                }

                const startTime =
                    performance.now();

                function animate(now) {

                    const elapsed =
                        now - startTime;

                    const progress =
                        Math.min(
                            elapsed / duration,
                            1
                        );

                    const eased =
                        progress < 0.5
                            ? 2 *
                              progress *
                              progress
                            : 1 -
                              Math.pow(
                                  -2 *
                                      progress +
                                      2,
                                  2
                              ) /
                              2;

                    element.scrollTop =
                        start +
                        distance *
                            eased;

                    if (
                        progress < 1
                    ) {

                        requestAnimationFrame(
                            animate
                        );

                    } else {

                        resolve();
                    }
                }

                requestAnimationFrame(
                    animate
                );
            }
        );
    }


    /* =========================================================
       START LETTER EXPERIENCE
    ========================================================= */

    async function startActualLetter() {

        if (letterStarted) {
            return;
        }

        letterStarted = true;

        showScene(10);


        if (letterScroll) {
            letterScroll.scrollTop = 0;
        }


        if (finallyButton) {
            finallyButton.classList.remove(
                "show"
            );
        }


        letterLines.forEach(
            (line) => {
                line.classList.remove(
                    "visible"
                );
            }
        );


        if (letterHeading) {
            letterHeading.classList.add(
                "visible"
            );
        }


        /*
         * Give the letter a moment to appear.
         */

        await new Promise(
            (resolve) => {
                setTimeout(
                    resolve,
                    800
                );
            }
        );


        if (!letterScroll) {
            return;
        }


        /*
         * Reveal each line one by one.
         *
         * Each line is automatically moved
         * into view with a slow smooth scroll.
         */

        for (
            let i = 0;
            i < letterLines.length;
            i++
        ) {

            const line =
                letterLines[i];


            line.classList.add(
                "visible"
            );


            await new Promise(
                (resolve) => {
                    setTimeout(
                        resolve,
                        450
                    );
                }
            );


            const target =
                Math.max(
                    0,
                    line.offsetTop -
                        letterScroll.clientHeight *
                            0.38
                );


            await smoothScrollTo(
                letterScroll,
                target,
                1650
            );


            await new Promise(
                (resolve) => {
                    setTimeout(
                        resolve,
                        500
                    );
                }
            );
        }


        /*
         * Final slow movement to bottom.
         */

        await new Promise(
            (resolve) => {
                setTimeout(
                    resolve,
                    700
                );
            }
        );


        const bottom =
            letterScroll.scrollHeight -
            letterScroll.clientHeight;


        await smoothScrollTo(
            letterScroll,
            bottom,
            3000
        );


        await new Promise(
            (resolve) => {
                setTimeout(
                    resolve,
                    700
                );
            }
        );


        /*
         * Finally button appears.
         */

        if (finallyButton) {
            finallyButton.classList.add(
                "show"
            );
        }
    }


    /* =========================================================
       SCENE 11 — FINALLY
    ========================================================= */

    const finallySparkles =
        $("#finallySparkles");

    const finallyContinue =
        $("#finallyContinue");


    function createFinallySparkles() {

        if (!finallySparkles) {
            return;
        }

        finallySparkles.innerHTML = "";

        const count =
            window.innerWidth <= 600
                ? 45
                : 75;

        for (let i = 0; i < count; i++) {

            const sparkle =
                document.createElement(
                    "span"
                );

            sparkle.className =
                "finallySparkle";

            sparkle.style.left =
                `${Math.random() * 100}%`;

            sparkle.style.top =
                `${Math.random() * 100}%`;

            sparkle.style.animationDelay =
                `${Math.random() * 2}s`;

            sparkle.style.animationDuration =
                `${1.5 + Math.random() * 2.5}s`;

            finallySparkles.appendChild(
                sparkle
            );
        }
    }


    function showFinallyScene() {

        showScene(11);

        createFinallySparkles();


        if (finallyContinue) {

            finallyContinue.classList.remove(
                "show"
            );

            delay(() => {

                finallyContinue.classList.add(
                    "show"
                );

            }, 1800);
        }
    }


    if (finallyButton) {

        finallyButton.addEventListener(
            "click",
            () => {
                showFinallyScene();
            }
        );
    }


    /* =========================================================
       SCENE 12 — HAPPY BIRTHDAY
    ========================================================= */

    const birthdaySparkles =
        $("#birthdaySparkles");


    function createBirthdaySparkles() {

        if (!birthdaySparkles) {
            return;
        }

        birthdaySparkles.innerHTML = "";

        const count =
            window.innerWidth <= 600
                ? 55
                : 95;

        for (let i = 0; i < count; i++) {

            const sparkle =
                document.createElement(
                    "span"
                );

            sparkle.className =
                "birthdaySparkle";

            sparkle.style.left =
                `${Math.random() * 100}%`;

            sparkle.style.top =
                `${Math.random() * 100}%`;

            sparkle.style.animationDelay =
                `${Math.random() * 2.5}s`;

            sparkle.style.animationDuration =
                `${1.8 + Math.random() * 3}s`;

            birthdaySparkles.appendChild(
                sparkle
            );
        }
    }


    function showBirthdayScene() {

        showScene(12);

        createBirthdaySparkles();


        /*
         * Happy Birthday scene stays long enough
         * to clearly show:
         *
         * Happy Birthday
         * To You
         * Pallavi
         * Left photo
         * Right photo
         */

        delay(() => {
            showSmileScene();
        }, 6500);
    }


    if (finallyContinue) {

        finallyContinue.addEventListener(
            "click",
            () => {
                showBirthdayScene();
            }
        );
    }


    /* =========================================================
       SCENE 13 — SMILE
    ========================================================= */

    const smileParticles =
        $("#smileParticles");

    const smileGlow =
        $("#smileGlow");

    const glowingSmile =
        $("#glowingSmile");


    function createSmileParticles() {

        if (!smileParticles) {
            return;
        }

        smileParticles.innerHTML = "";

        const count =
            window.innerWidth <= 600
                ? 35
                : 65;

        for (let i = 0; i < count; i++) {

            const particle =
                document.createElement(
                    "span"
                );

            particle.className =
                "smileParticle";

            particle.style.left =
                `${Math.random() * 100}%`;

            particle.style.top =
                `${Math.random() * 100}%`;

            particle.style.animationDelay =
                `${Math.random() * 2}s`;

            particle.style.animationDuration =
                `${2 + Math.random() * 3}s`;

            smileParticles.appendChild(
                particle
            );
        }
    }


    function showSmileScene() {

        showScene(13);

        createSmileParticles();


        delay(() => {

            if (smileGlow) {
                smileGlow.classList.add(
                    "active"
                );
            }

            if (glowingSmile) {
                glowingSmile.classList.add(
                    "active"
                );
            }

        }, 250);


        delay(() => {
            showFinalScene();
        }, 7000);
    }


    /* =========================================================
       SCENE 14 — FINAL
    ========================================================= */

    const finalGoldenParticles =
        $("#finalGoldenParticles");


    function createFinalGoldenParticles() {

        if (!finalGoldenParticles) {
            return;
        }

        finalGoldenParticles.innerHTML =
            "";

        const count =
            window.innerWidth <= 600
                ? 35
                : 65;

        for (let i = 0; i < count; i++) {

            const particle =
                document.createElement(
                    "span"
                );

            particle.className =
                "finalGoldenParticle";

            particle.style.left =
                `${Math.random() * 100}%`;

            particle.style.top =
                `${Math.random() * 100}%`;

            particle.style.animationDelay =
                `${Math.random() * 3}s`;

            particle.style.animationDuration =
                `${2.5 + Math.random() * 4}s`;

            finalGoldenParticles.appendChild(
                particle
            );
        }
    }


    function showFinalScene() {

        showScene(14);

        createFinalGoldenParticles();
    }


    /* =========================================================
       TOUCH / PAGE SCROLL CONTROL
    ========================================================= */

    document.addEventListener(
        "touchmove",
        (event) => {

            /*
             * Allow normal touch scrolling only
             * inside the letter.
             */

            if (
                letterScroll &&
                letterScroll.contains(
                    event.target
                )
            ) {
                return;
            }

            /*
             * Keep the cinematic scenes fixed.
             */

            if (currentScene !== 10) {
                event.preventDefault();
            }
        },
        {
            passive: false
        }
    );


    /* =========================================================
       KEYBOARD SUPPORT
    ========================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            const active =
                document.activeElement;

            const typing =
                active &&
                (
                    active.tagName ===
                        "INPUT" ||
                    active.tagName ===
                        "TEXTAREA"
                );

            if (typing) return;


            /*
             * Press Enter on letter cover
             * to open the letter.
             */

            if (
                event.key === "Enter" &&
                currentScene === 8
            ) {
                openLetter();
            }
        }
    );


    /* =========================================================
       INITIAL STATE
    ========================================================= */

    showScene(1);


    if (letterCover) {
        letterCover.classList.remove(
            "show",
            "opening"
        );
    }


    if (letterPaper) {
        letterPaper.classList.remove(
            "open"
        );
    }


    if (finallyButton) {
        finallyButton.classList.remove(
            "show"
        );
    }


    if (finallyContinue) {
        finallyContinue.classList.remove(
            "show"
        );
    }


    if (smileGlow) {
        smileGlow.classList.remove(
            "active"
        );
    }


    if (glowingSmile) {
        glowingSmile.classList.remove(
            "active"
        );
    }


    console.log(
        "🎁 Birthday Surprise — Final Version Ready!"
    );

});