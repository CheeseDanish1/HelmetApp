import pyautogui
import time


def hold_W (hold_time):
    start = time.time()
    while time.time() - start < hold_time:
        pyautogui.press('w')

hold_W(10)