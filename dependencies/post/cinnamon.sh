#!/bin/bash

echo "----> Installing Cinnamon nightly..."

sudo add-apt-repository ppa:gwendal-lebihan-dev/cinnamon-nightly
sudo apt-get update
sudo apt-get install cinnamon

echo "----> Cinnamon install complete. Please restart..."