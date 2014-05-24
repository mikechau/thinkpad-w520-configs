#!/bin/bash

echo "----> Installing TLP"

sudo add-apt-repository ppa:linrunner/tlp
sudo apt-get update
sudo apt-get install tlp tlp-rdw tp-smapi-dkms acpi-call-tools