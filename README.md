
# DFRobot SEN0502 – enkoder obrotowy dla micro:bit

![Enkoder DFRobot SEN0502](dfrobot%20sen0502.png)


Rozszerzenie Microsoft MakeCode do obsługi enkodera obrotowego DFRobot Gravity SEN0502 przez magistralę I2C.

## Funkcje

- Odczyt wartości enkodera od 0 do 1023
- Ustawianie wartości enkodera
- Odczyt i ustawianie wartości procentowej (0–100%)
- Sterowanie wbudowanym paskiem LED poprzez ustawienie wartości
- Ustawianie kroku enkodera
- Zliczanie kroków obrotu w prawo i w lewo
- Zdarzenie obrotu w prawo
- Zdarzenie obrotu w lewo
- Zdarzenie naciśnięcia pokrętła
- Odczyt stanu przycisku
- Zerowanie wartości i licznika kroków
- Zmiana adresu I2C używanego przez bibliotekę

## Podłączenie do micro:bit

| SEN0502 | micro:bit |
|---------|-----------|
| VCC     | 3V        |
| GND     | GND       |
| SDA     | P20       |
| SCL     | P19       |

Domyślny adres I2C: `0x54`.

## Instalacja

1. Otwórz Microsoft MakeCode dla micro:bit.
2. Otwórz projekt.
3. Wybierz Rozszerzenia (Extensions).
4. Wklej adres repozytorium GitHub tej biblioteki.
5. Dodaj rozszerzenie do projektu.

## Przykładowy program

```typescript
sen0502.ustawAdres(0x54)
sen0502.ustawKrok(1)
sen0502.ustawWartosc(512)

sen0502.onPrawo(function () {
    basic.showArrow(ArrowNames.East)
})

sen0502.onLewo(function () {
    basic.showArrow(ArrowNames.West)
})

sen0502.onPrzycisk(function () {
    basic.showIcon(IconNames.Heart)
})
```

## Dostępne funkcje

### Enkoder

- `sen0502.odczytajWartosc()`
- `sen0502.ustawWartosc(wartosc)`
- `sen0502.wyzeruj()`
- `sen0502.odczytajLicznik()`

### Procenty

- `sen0502.odczytajProcenty()`
- `sen0502.ustawProcenty(procent)`

### Zdarzenia

- `sen0502.onPrawo(handler)`
- `sen0502.onLewo(handler)`
- `sen0502.onPrzycisk(handler)`

### Przycisk

- `sen0502.nacisnieto()`

### Ustawienia

- `sen0502.ustawAdres(adres)`
- `sen0502.ustawKrok(krok)`

## Uwagi

Biblioteka wykorzystuje komunikację I2C.

Zdarzenia obrotu są wykrywane przez cykliczny odczyt wartości enkodera. Przy bardzo szybkim obrocie mogą wystąpić ograniczenia wynikające z częstotliwości odczytu.

## Licencja

Do uzupełnienia przed publikacją.
