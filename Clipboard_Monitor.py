"""
Если не работает напишите в консоль:
pip install gradio pyperclip
"""

import gradio as gr
import pyperclip
import time

last_text = ''
total_text = ''

def check_clipboard():
    global last_text
    global total_text
    current_text = pyperclip.paste()
    if current_text != last_text:
        last_text = current_text
        total_text +=  current_text + '\n'
    return total_text

def update_textbox():
    return gr.update(value=check_clipboard())

with gr.Blocks() as interface:
    textbox = gr.Textbox(interactive=False, label='')
    interface.load(fn=update_textbox, inputs=None, outputs=textbox, every=1)
    
interface.launch(share=True)
