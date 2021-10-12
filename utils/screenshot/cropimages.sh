#!/bin/bash

read -p "screenshots directory: " dir
read -p "crop border (8): " crop
for file in $(find $dir -name '*.png'); do 
    convert $file -crop +$crop+$crop -crop -$crop-$crop $file
done
