#!/bin/bash

# touchpad mouse fix for screen freezing w/ nvidia
# https://bugs.launchpad.net/ubuntu/+source/nvidia-graphics-drivers-319/+bug/1220426/comments/18

echo "----> Applying fix for touchpad..."

sudo echo "options psmouse proto=imps" | sudo tee /etc/modprobe.d/psmouse.conf >/dev/null
sudo modprobe -r psmouse && sudo modprobe psmouse