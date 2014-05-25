#!/bin/bash

##################################
# KERNEL
##################################
NEW_KERNEL=3144
CURRENT_KERNEL=$(uname -r|cut -d\- -f1|tr -d '.'| tr -d '[A-Z][a-z]')

if [[ $CURRENT_KERNEL -ne $NEW_KERNEL ]]; then
  echo "----> Update and upgrading..."

  # apply configs
  ./apply/rc_local.sh
  ./apply/trackpoint.sh

  # actions
  ./fixes/touchpad.sh

  # update the machine
  sudo apt-get update
  sudo apt-get upgrade

  # install dependencies
  ./dependencies/initial/install.sh

  # update the kernel
  ./system/kernel.sh

  exit 0
fi

echo "----> Kernel is updated, proceeding..."

##################################
# NVIDIA
##################################
CURRENT_NVIDIA=$(dpkg --status nvidia-331|grep Version|cut -f 1 -d '-'|sed 's/[^.,0-9]//g')

if [[ -z $CURRENT_NVIDIA ]]; then
  echo "----> No NVIDIA drivers found..."
  ./system/nvidia.sh

  exit 0
fi

##################################
# FLASH
##################################
FLASH_CHECK=$(ls -l /usr/lib/firefox-addons/plugins | grep libflashplayer.so -ci)
if [[ $FLASH_CHECK -eq 0 ]]; then
  echo "---->  No Flash detected..."
  ./dependencies/post/flash.sh
  exit 0
fi

##################################
# CINNAMON
##################################
CINNAMON=$(which cinnamon)

if [[ -z $CINNAMON ]]; then
  echo "----> No Cinnamon found..."
  ./dependencies/post/cinnamon.sh
  exit 0
fi

#################################
# REMOVE UNITY
#################################

UNITY=$(which unity)
if [[ -z $UNITY ]]; then
  echo "----> Theres no Unity! Yay!"
else
  echo "----> Unity found..."
  # actions
  ./actions/show_startup_applications.sh
  ./remove/unity.sh
  exit 0
fi

