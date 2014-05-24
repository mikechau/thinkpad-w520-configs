#!/bin/bash

echo "----> Installing NVIDIA Drivers..."

sudo add-apt-repository ppa:xorg-edgers/ppa
sudo apt-get update
sudo apt-get install nvidia-331

echo "----> Install complete. Restart!"