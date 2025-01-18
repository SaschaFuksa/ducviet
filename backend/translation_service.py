"""
This script provides a translation service that translates text from German to Vietnamese.
It uses the Hugging Face translation library and the LLaMA chatbot.

How to run ollama locally: Install ollama, install llama3.2 and run `ollama run llama3.2` in console
"""
import torch.multiprocessing as mp
from transformers import pipeline
from ollama import chat
from ollama import ChatResponse
import re

input: str
runs: int = 0

def translate_to_vietnamese(text: str) -> str:
  return translator(text)[0]["translation_text"]

def generate_example_sentence(word: str, translation: str) -> dict:
  global runs
  runs += 1
  if runs > 10:
    return {"deutsch": "", "vietnamesisch": ""}
  print("runs:", runs)
  response: ChatResponse = chat(model='llama3.2', messages=[
      {
        'role': 'user',
        'content': 'Erstelle einen sehr kurzen Beispielsatz, maximal 20 Wörter, in dem folgendes Wort vorkommt: ' + word,
      },
    ])
  response = response['message']['content']
  v = translator(response)[0]["translation_text"]

  if translation.lower() in v.lower():
    return {"deutsch": response, "vietnamesisch": v}
  else:
    print(translation, v)
    return generate_example_sentence(word, translation)

def main():
  print("Input:", input)
  t = translate_to_vietnamese(input)
  translation = re.sub(r'[^\w\s]', '', t)
  print("Übersetzung:", translation)
  e = generate_example_sentence(input, translation)
  print("Beispielsatz DE:", e["deutsch"])
  print("Beispielsatz VI:", e["vietnamesisch"])

if __name__ == "__main__":
  input = "Liebe"
  mp.freeze_support()
  translator = pipeline("translation_de_to_vi", model="Helsinki-NLP/opus-mt-de-vi")
  main()
