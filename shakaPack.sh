
#!/bin/bash

#PATH TO THE VIDEO_FOLDER
VIDEO_FOLDER=$(pwd)
# create a temp folder for the rendered videos
$(mkdir ${VIDEO_FOLDER}/temp)
$(mkdir ${VIDEO_FOLDER}/processed_videos)
# $(mkdir ${VIDEO_FOLDER}/input_videos)
#link to the shaka docker container
packager="docker run -v ${VIDEO_FOLDER}/:/media google/shaka-packager packager"

#loop and echoing mov videos
$(cd ${VIDEO_FOLDER}/input_videos/)
VIDEOS="*.mov"
$(cd ${VIDEO_FOLDER}/)
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
#   make a folder for contain the pre-processed videos
  $(mkdir ${VIDEO_FOLDER}/temp/${filename})
  #FFMPEG COMMANDS
  $(ffmpeg -y -i $f -c:a copy \
           -vf scale=-2:360 \
           -c:v libx264 -profile:v baseline -level:v 3.0 \
           -x264opts scenecut=0:open_gop=0:min-keyint=72:keyint=72 \
           -minrate 600k -maxrate 600k -bufsize 600k -b:v 600k -flags +global_header \
           -y ${VIDEO_FOLDER}/temp/${filename}/${filename}_360p_600.mp4)
  
  $(ffmpeg -y -i $f -c:a copy \
           -vf scale=-2:480 \
           -c:v libx264 -profile:v baseline -level:v 3.0 \
           -x264opts scenecut=0:open_gop=0:min-keyint=72:keyint=72 \
           -minrate 1000k -maxrate 1000k -bufsize 1000k -b:v 1000k -flags +global_header \
           -y ${VIDEO_FOLDER}/temp/${filename}/${filename}_480p_1000.mp4)
  
  $(ffmpeg -y -i $f -c:a copy \
           -vf scale=-2:720 \
           -c:v libx264 -profile:v baseline -level:v 3.0 \
           -x264opts scenecut=0:open_gop=0:min-keyint=72:keyint=72 \
           -minrate 1500k -maxrate 1500k -bufsize 1500k -b:v 1500k -flags +global_header \
           -y ${VIDEO_FOLDER}/temp/${filename}/${filename}_720p_1500.mp4)
  
$(
    ${packager} \
     in=/media/temp/${filename}/${filename}_360p_600.mp4,stream=audio,output=/media/processed_videos/${filename}_audio_dash.mp4 \
     in=/media/temp/${filename}/${filename}_360p_600.mp4,stream=video,output=/media/processed_videos/${filename}_360p_dash.mp4  \
     in=/media/temp/${filename}/${filename}_480p_1000.mp4,stream=video,output=/media/processed_videos/${filename}_480p_dash.mp4 \
     in=/media/temp/${filename}/${filename}_720p_1500.mp4,stream=video,output=/media/processed_videos/${filename}_720p_dash.mp4 \
     --mpd_output /media/processed_videos/${filename}_manifest.mpd)


done

$(rm -r ${VIDEO_FOLDER}/temp/)


# output_name


# $(${packager} input=/media/r.mp4,stream=audio,output=/media/audio.mp4 input=/media/r.mp4,stream=video,output=/media/video.mp4 --mpd_output /media/example.mpd)
