#!/bin/bash

echo "----> Installing Flash..."

sudo apt-get install flashplugin-installer
sudo apt-get install libvdpau1 vdpau-va-driver

echo "----> Setting up VDPAU config..."
sudo mkdir /etc/adobe
sudo cp ./configs/etc/adobe/mms.cfg /etc/adobe