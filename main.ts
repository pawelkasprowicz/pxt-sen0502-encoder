
sen0502.ustawAdres(0x54)
sen0502.ustawKrok(1)
sen0502.ustawWartosc(512)

let poprzednia = sen0502.odczytajWartosc()

function pokazZmiane(zmiana: number) {
    let liczba = Math.abs(zmiana)

    if (liczba == 1) {
        basic.showLeds(`
            . . # . .
            . # # . .
            . . # . .
            . . # . .
            . # # # .
        `)
    } else if (liczba == 2) {
        basic.showLeds(`
            . # # # .
            # . . . #
            . . # # .
            . # . . .
            # # # # .
        `)
    } else {
        basic.clearScreen()
    }

    if (zmiana < 0) {
        led.plot(4, 4)
    } else {
        led.unplot(4, 4)
    }
}

basic.forever(function () {
    let aktualna = sen0502.odczytajWartosc()
    let zmiana = aktualna - poprzednia

    if (zmiana != 0) {
        pokazZmiane(zmiana)
        poprzednia = aktualna
    }

    basic.pause(30)
})

