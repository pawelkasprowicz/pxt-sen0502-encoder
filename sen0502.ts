
/**
 * DFRobot SEN0502 Rotary Encoder
 * MakeCode extension for BBC micro:bit
 */

//% color="#168B78" icon="\uf021" block="SEN0502"
//% groups='["Zdarzenia", "Enkoder", "Procenty", "Przycisk", "Ustawienia"]'
namespace sen0502 {

    let adres = 0x54
    let poprzednia = 0
    let licznik = 0
    let monitorowanie = false

    let ZDARZENIA = 7602
    let PRAWO = 1
    let LEWO = 2
    let PRZYCISK = 3

    function odczytaj8(rejestr: number): number {
        pins.i2cWriteNumber(
            adres, rejestr,
            NumberFormat.UInt8BE, false
        )
        return pins.i2cReadNumber(
            adres, NumberFormat.UInt8BE, false
        )
    }

    function odczytaj16(rejestr: number): number {
        pins.i2cWriteNumber(
            adres, rejestr,
            NumberFormat.UInt8BE, false
        )
        return pins.i2cReadNumber(
            adres, NumberFormat.UInt16BE, false
        )
    }

    function zapisz8(rejestr: number, wartosc: number): void {
        let dane = pins.createBuffer(2)
        dane[0] = rejestr
        dane[1] = wartosc & 255
        pins.i2cWriteBuffer(adres, dane, false)
    }

    function zapisz16(rejestr: number, wartosc: number): void {
        let dane = pins.createBuffer(3)
        dane[0] = rejestr
        dane[1] = (wartosc >> 8) & 255
        dane[2] = wartosc & 255
        pins.i2cWriteBuffer(adres, dane, false)
    }

    function uruchomMonitorowanie(): void {
        if (monitorowanie) {
            return
        }

        monitorowanie = true
        poprzednia = odczytaj16(0x08)

        control.inBackground(function () {
            while (true) {

                let aktualna = odczytaj16(0x08)
                let roznica = aktualna - poprzednia
                poprzednia = aktualna

                if (roznica > 0 && roznica <= 100) {
                    for (let i = 0; i < roznica; i++) {
                        licznik += 1
                        control.raiseEvent(ZDARZENIA, PRAWO)
                        basic.pause(1)
                    }
                }

                if (roznica < 0 && roznica >= -100) {
                    for (let i = 0; i < -roznica; i++) {
                        licznik -= 1
                        control.raiseEvent(ZDARZENIA, LEWO)
                        basic.pause(1)
                    }
                }

                let stan = odczytaj8(0x0A)

                if ((stan & 1) != 0) {
                    zapisz8(0x0A, 0)
                    control.raiseEvent(ZDARZENIA, PRZYCISK)
                }

                basic.pause(20)
            }
        })
    }

    //% block="SEN0502 adres I2C %nowyAdres"
    //% nowyAdres.defl=84
    //% group="Ustawienia"
    export function ustawAdres(nowyAdres: number): void {
        adres = nowyAdres
        poprzednia = odczytaj16(0x08)
    }

    //% block="SEN0502 krok enkodera %krok"
    //% krok.min=1 krok.max=51 krok.defl=1
    //% group="Ustawienia"
    export function ustawKrok(krok: number): void {
        krok = Math.constrain(Math.round(krok), 1, 51)
        zapisz8(0x0B, krok)
        poprzednia = odczytaj16(0x08)
    }

    //% block="SEN0502 odczytaj wartosc"
    //% group="Enkoder"
    export function odczytajWartosc(): number {
        return odczytaj16(0x08)
    }

    //% block="SEN0502 ustaw wartosc %wartosc"
    //% wartosc.min=0 wartosc.max=1023
    //% group="Enkoder"
    export function ustawWartosc(wartosc: number): void {
        wartosc = Math.constrain(
            Math.round(wartosc), 0, 1023
        )
        zapisz16(0x08, wartosc)
        poprzednia = wartosc
    }

    //% block="SEN0502 wyzeruj"
    //% group="Enkoder"
    export function wyzeruj(): void {
        ustawWartosc(0)
        licznik = 0
    }

    //% block="SEN0502 odczytaj licznik krokow"
    //% group="Enkoder"
    export function odczytajLicznik(): number {
        uruchomMonitorowanie()
        return licznik
    }

    //% block="SEN0502 odczytaj procenty"
    //% group="Procenty"
    export function odczytajProcenty(): number {
        return Math.round(
            odczytajWartosc() * 100 / 1023
        )
    }

    //% block="SEN0502 ustaw procenty %procent"
    //% procent.min=0 procent.max=100
    //% group="Procenty"
    export function ustawProcenty(procent: number): void {
        procent = Math.constrain(procent, 0, 100)
        ustawWartosc(
            Math.round(procent * 1023 / 100)
        )
    }

    //% block="SEN0502 nacisnieto pokretlo"
    //% group="Przycisk"
    export function nacisnieto(): boolean {
        let stan = odczytaj8(0x0A)

        if ((stan & 1) != 0) {
            zapisz8(0x0A, 0)
            return true
        }

        return false
    }

    //% block="gdy SEN0502 obrot w prawo"
    //% group="Zdarzenia"
    export function onPrawo(handler: () => void): void {
        control.onEvent(ZDARZENIA, PRAWO, handler)
        uruchomMonitorowanie()
    }

    //% block="gdy SEN0502 obrot w lewo"
    //% group="Zdarzenia"
    export function onLewo(handler: () => void): void {
        control.onEvent(ZDARZENIA, LEWO, handler)
        uruchomMonitorowanie()
    }

    //% block="gdy SEN0502 nacisnieto pokretlo"
    //% group="Zdarzenia"
    export function onPrzycisk(handler: () => void): void {
        control.onEvent(ZDARZENIA, PRZYCISK, handler)
        uruchomMonitorowanie()
    }
}
