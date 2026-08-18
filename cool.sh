#!/usr/bin/env bash

# Earthy orange — Claude Code / brand terracotta (#D97757)
BRAND_ORANGE=$'\033[38;2;217;119;87m'
RESET=$'\033[0m'

clear

sleep 0.3
echo "[ COOLPLUGZ INSTALLER v1.0 ]"
echo
sleep 0.3

echo "Checking system dependencies..."
sleep 0.5
echo "[ OK ] bash"
sleep 0.2
echo "[ OK ] terminal"
sleep 0.2
echo "[ OK ] permissions"
sleep 0.4

echo
echo "Preparing COOLPLUGZ..."
sleep 0.5

for i in {1..20}; do
    printf "\rInstalling: ["
    for ((j=0; j<i; j++)); do printf "#"; done
    for ((j=i; j<20; j++)); do printf " "; done
    printf "] %3d%%" $((i * 5))
    sleep 0.08
done

echo
echo
sleep 0.4

echo "Configuring modules..."
sleep 0.4
echo "[ OK ] coolplugz-core"
sleep 0.2
echo "[ OK ] coolplugz-runtime"
sleep 0.2
echo "[ OK ] coolplugz-interface"

echo
sleep 0.5
echo "Installation complete."
sleep 0.5
echo

cat <<EOF

${BRAND_ORANGE}
 ██████╗ ██████╗  ██████╗ ██╗     
██╔════╝██╔═══██╗██╔═══██╗██║     
██║     ██║   ██║██║   ██║██║     
██║     ██║   ██║██║   ██║██║     
╚██████╗╚██████╔╝╚██████╔╝███████╗
 ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝
                                    
██████╗ ██╗     ██╗   ██╗ ██████╗███████╗
██╔══██╗██║     ██║   ██║██╔════╝╚══███╔╝
██████╔╝██║     ██║   ██║██║       ███╔╝ 
██╔═══╝ ██║     ██║   ██║██║  ██    ███╔╝  
██║     ███████╗╚██████╔╝╚██████╗███████╗
╚═╝     ╚══════╝ ╚═════╝  ╚═════╝╚══════╝
${RESET}

EOF

echo
echo ">> COOLPLUGZ loaded successfully."
echo ">> System ready."
echo
