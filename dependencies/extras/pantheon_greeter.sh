#!/bin/bash

echo "----> Installing Pantheon Greeter..."

sudo add-apt-repository ppa:elementary-os/daily
sudo apt-get update
sudo apt-get install pantheon-greeter elementary-theme fonts-open-sans-elementary fonts-raleway-elementary

sudo cp ../../configs/etc/lightdm/lightdm.conf /etc/lightdm