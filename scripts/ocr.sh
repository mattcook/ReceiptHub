#!/bin/bash

#rotate image convert -rotate "-90>" $1 $1
PWD=`pwd`
$PWD/scripts/exposure -a 60 $1 $1
$PWD/scripts/innercrop -o white $1 $1
convert $1 -crop 1400x640+650+200 +repage $1
$PWD/scripts/graytoning $1 $1
