SetTitleMatchMode, 2 ; Allow partial title matches

Loop
{
    IfWinExist, Roblox ; Check if the Roblox window exists
    {
        WinActivate ; Activate the Roblox window
        Sleep, 500 ; Wait for the window to activate

        ; Part 1: Move left and right for 10 seconds
        StartTime := A_TickCount
        While (A_TickCount - StartTime < 10000)
        {
            Send {d down} ; Move right
            Sleep, 2000
            Send {d up} ; Move right
            Sleep, 1000
            Send {a down}
            Sleep, 2000
            Send {a up}
            Sleep, 1000
        }

        ; Part 2: Check pixel color and move to the side with more room
        ; PixelGetColor, Color, 960, 540
        StartTime2 := A_TickCount
        While (A_TickCount - StartTime2 < 5000)
        {
            MouseGetPos, mouseX, mouseY
            PixelGetColor, pixelColor, % mouseX, % mouseY, RGB
            targetRedMin := 200 ; Minimum red value
            targetRedMax := 255 ; Maximum red value
            
            ; Extract the red component from the pixelColor
            redComponent := (pixelColor >> 16) & 0xFF
            StartTime := A_TickCount
            ; Check if the red component is within the specified range
            if (redComponent >= targetRedMin && redComponent <= targetRedMax)
            {
                Send {d down} ; Move right
            }
        }

        ; Part 3: Repeat the loop
        Continue
    }

    Sleep, 1000 ; If the Roblox window is not found, wait and try again
}

SplitColor(Color, ByRef R, ByRef G, ByRef B, ByRef A) {
    R := (Color >> 16) & 0xFF
    G := (Color >> 8) & 0xFF
    B := Color & 0xFF
    A := (Color >> 24) & 0xFF
}