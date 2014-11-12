#!/bin/bash

#rotate image convert -rotate "-90>" $1 $1
PWD=`pwd`
$PWD/scripts/exposure -a 60 $1 $1
$PWD/scripts/graytoning $1 $1
