#!/bin/bash

#PATH TO THE VIDEO_FOLDER
VIDEO_FOLDER=$(pwd)
#loop and echoing mov videos
VIDEOS="*.mov"
echo "video folder" $VIDEO_FOLDER
echo "videos" $VIDEOS
INDEX=0
for f in $VIDEOS
do
  ((INDEX++))
    name="${f##*.}"
    filename="${f%.*}"
  echo $INDEX
  echo "input:" $f
  echo "output:" "${filename}_out.mp4"
  #FFMPEG COMMAND
  $(ffmpeg -y -i $f -c:a aac -strict -2 -ac 2 -ab 56k -c:v libx264 -x264opts keyint=24:min-keyint=24:no-scenecut -b:v $1 -vf scale=-1:$2 reducedQ_$1_${filename}.mp4)
done
