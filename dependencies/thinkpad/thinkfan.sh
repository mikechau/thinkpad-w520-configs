#!/bin/bash

echo "----> Installing Thinkfan..."

sudo apt-get install thinkfan lm-sensors

sudo echo -e "options thinkpad_acpi fan_control=1" | tee /etc/modprobe.d/thinkfan.conf

echo "continue step 3..."
echo "http://staff.science.uva.nl/~kholshei/thinkfan_guide/"
# http://staff.science.uva.nl/~kholshei/thinkfan_guide/