#!/bin/bash
set -e
manim -qm /manim_input/temp.py Temp --media_dir /manim_output
final_file=$(find /manim_output -type f -name 'Temp.mp4' | head -n 1)
if [ -f "$final_file" ]; then
  cp "$final_file" /manim_output/Temp.mp4
  find /manim_output -mindepth 1 ! -path /manim_output/Temp.mp4 -delete
  find /manim_output -mindepth 1 -type d -empty -delete
else
  echo "Error: Temp.mp4 not found in /manim_output!"
  exit 1
fi
