let finalsec = 0;
let minutes = 0;
let hours = 0;
let seconds = 0;
let mode = "hours";
let isCounting = false;
music.setTempo(134);
serial.redirectToUSB();

basic.showNumber(hours);

input.onButtonPressed(Button.A, function () {
    if (isCounting == false) {
        switch (mode) {
            case 'hours':
                hours = (hours < 23) ? hours + 1 : 0;
                basic.showNumber(hours);
                break;
            case 'minutes':
                minutes = (minutes < 59) ? minutes + 1 : 0;
                basic.showNumber(minutes);
                break;
            case 'seconds':
                seconds = (seconds < 59) ? seconds + 1 : 0;
                basic.showNumber(seconds);
                break;
        }
    }
});
input.onLogoEvent(TouchButtonEvent.Pressed, function() {
    
})
input.onButtonPressed(Button.B, function () {
    if (isCounting == false) {
        switch (mode) {
            case 'hours':
                hours = (hours > 0) ? hours - 1 : 23;
                basic.showNumber(hours);
                break;
            case 'minutes':
                minutes = (minutes > 0) ? minutes - 1 : 59;
                basic.showNumber(minutes);
                break;
            case 'seconds':
                seconds = (seconds > 0) ? seconds - 1 : 59;
                basic.showNumber(seconds);
                break;
        }
    }
});

input.onButtonPressed(Button.A + Button.B, function () {
    if (isCounting == false) {
        if (mode === 'seconds') {
            if (hours === 0 && minutes === 0 && seconds === 0) {
                control.inBackground(function () {
                    music.playTone(Note.E5, music.beat(BeatFraction.Whole))
                })
                printDebug("Error-1.");
                basic.clearScreen();
                basic.showIcon(IconNames.No)
                mode = 'hours';
                basic.showNumber(hours);
            } else {
                basic.clearScreen();
                finalsec = hours * 3600 + minutes * 60 + seconds;
                isCounting = true;
                startTimer(finalsec);
            }
        } else {
            mode = mode === 'hours' ? 'minutes' : 'seconds';
            printDebug("Mode changed.");
            control.inBackground(function () {
                music.playTone(1318.51, music.beat(BeatFraction.Quarter) / 2)
            })
            if (mode == 'minutes')
                basic.showNumber(minutes);
            else
                basic.showNumber(seconds);
        }
    }
});

function updateTimer(elapsedSeconds: number) {
    let remainingSeconds = finalsec - elapsedSeconds + 1;
    let percentage = remainingSeconds / finalsec * 100;
    let ledsToFill = Math.floor(percentage / 4);

    let x, y;
    for (let i = 0; i < 25; i++) {
        x = i % 5;
        y = Math.floor(i / 5);

        if (i < ledsToFill)
            led.plot(x, y);
    }
}

function initializeVariables() {
    finalsec = 0;
    minutes = 0;
    hours = 0;
    seconds = 0;
    mode = "hours";
    isCounting = false;
}

function displayCurrentValues() {
    basic.clearScreen();
    if (mode === 'hours')
        basic.showNumber(hours);
    else if (mode === 'minutes')
        basic.showNumber(minutes);
    else
        basic.showNumber(seconds);
}

function exitTimerLoop() {
    isCounting = false;
    basic.clearScreen();
    initializeVariables();
    displayCurrentValues();
}

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    control.inBackground(function () {
        music.playTone(Note.C5, music.beat(BeatFraction.Whole))
    })
    exitTimerLoop();
});

function startTimer(totalSeconds: number) {
    printDebug("Hours: ", hours);
    printDebug("Minutes: ", minutes);
    printDebug("Seconds: ", seconds);
    printDebug("Final seconds: ", finalsec);

    while (totalSeconds > 0 && isCounting) {
        printDebug("Total seconds: ", totalSeconds);
        updateTimer(totalSeconds);
        basic.pause(1000);
        totalSeconds--;
    }

    if (totalSeconds <= 0 && isCounting) {
        basic.clearScreen();
        control.inBackground(function () {
            melody();
        })
        basic.showIcon(IconNames.Yes)
        basic.pause(1000);

        initializeVariables();
        displayCurrentValues();
    } else if (!isCounting) {
        basic.clearScreen();
        displayCurrentValues();
    }
}


function melody() {
    music.playTone(196, music.beat(BeatFraction.Eighth))
    music.rest(music.beat(BeatFraction.Eighth))
    music.playTone(262, music.beat(BeatFraction.Eighth))
    music.rest(music.beat(BeatFraction.Eighth))
    music.playTone(659, music.beat(BeatFraction.Eighth))
    music.rest(music.beat(BeatFraction.Eighth))
    music.playTone(784, music.beat(BeatFraction.Eighth))
    music.rest(music.beat(BeatFraction.Half))
    music.playTone(659, music.beat(BeatFraction.Eighth))
    music.rest(music.beat(BeatFraction.Eighth))
    music.playTone(784, music.beat(BeatFraction.Whole))
}

function printDebug(txt: string, num: number = null) {
    serial.writeLine(txt);
    if (num != null)
        serial.writeNumber(num);
    serial.writeLine("");
}
