#!/bin/bash

read -p "screenshots directory: " dir
read -p "size (1280x800): " size
for file in $(find $dir -name '*.png'); do 
    convert $file -background 'rgba(0, 0, 0, 0)' -gravity center -extent $size $file
done
