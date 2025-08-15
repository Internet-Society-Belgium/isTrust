#!/bin/bash

read -p "screenshots directory: " dir
read -p "size (1280x800): " size
for file in $(find $dir -name '*.png'); do 
    magick $file -background '#f8fafc' -gravity center -extent $size $file
done
